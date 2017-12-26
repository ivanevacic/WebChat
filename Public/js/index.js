var socket = io();

socket.on('connect', () => {
  console.log('Connected to server');

 
});
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('newMessage', (message)=> {
  var formattedTime = moment(message.createdAt).format('h:mm a'); //formatted time
  var li = jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime} : ${message.text}`);
  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', (message)=>{
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>'); //open url in new tab
  li.text(`${message.from} ${formattedTime} : `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
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
