var socket = io();

//scroll to bottom if necessary
scrollToBottom = () =>{
  //Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');  //select last message child
  //Heights
  var clientHeight = messages.prop('clientHeight'); //prop(property we wonna fetch)
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();  //moves to previous child

  //calculation
  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    //scroll to top
    messages.scrollTop(scrollHeight); //moving to the bottom of msg area
  }
}

socket.on('connect', () => {
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, (err) => {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('updateUserList', (users)=>{
  var ol = jQuery('<ol></ol>');
  users.forEach((user)=>{
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);  //removes whole list and updates it
});

socket.on('newMessage', (message)=> {
  //var formattedTime = moment(message.createdAt).format('h:mm a'); //formatted time
  //var li = jQuery('<li></li>');
  //li.text(`${message.from} ${formattedTime} : ${message.text}`);
  //jQuery('#messages').append(li);

  //mustache js template
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', (message)=>{
  //var formattedTime = moment(message.createdAt).format('h:mm a');
  //var li = jQuery('<li></li>');
  //var a = jQuery('<a target="_blank">My current location</a>'); //open url in new tab
  //li.text(`${message.from} ${formattedTime} : `);
  //a.attr('href', message.url);
  //li.append(a);
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html(); //inner html content
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', (e)=> {
  e.preventDefault(); //prevents refresh process
  var messageTextbox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, ()=> {   //callback function
    messageTextbox.val('');
  });
});

//Geolocation
var locationButton = jQuery('#send-location');
locationButton.on('click', ()=> {
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser');
  }
  locationButton.attr('disabled', 'disabled').text('Sending location....');
  navigator.geolocation.getCurrentPosition((position)=> {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
    console.log(position);
  }, ()=> {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch your location.');
  });
});
