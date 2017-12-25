var socket = io();

socket.on('connect', () => {
  console.log('Connected to server');

 
});
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('newMessage', (message)=> {
  console.log('newMessage', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', (message)=>{
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>'); //open url in new tab
  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', (e)=> {
  e.preventDefault(); //prevents refresh process
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, ()=> {   //callback function

  });
});

//Geolocation
var locationButton = jQuery('#send-location');
locationButton.on('click', ()=> {
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser');
  }
  navigator.geolocation.getCurrentPosition((position)=> {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
    console.log(position);
  }, ()=> {
    alert('Unable to fetch your location.');
  });
});
