var socket = io(); <!--for  initialising a request so that server can respond-->

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function() {
  console.log('conncted to server');
});

socket.on('disconnect', function() {
  console.log('Disconncted to server');
});

socket.on('newMessage',function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime,
  });
  $('#message').append(html);
  scrollToBottom();
});

$('#message-form').on('submit', function (e) {
  e.preventDefault();
  var messageTextbox = $('[name=message]');

  socket.emit('createMessage', {
    from: 'Aman',
    text: messageTextbox.val()
  }, function (){
    messageTextbox.val('');
  });
});

socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime,
  });
  $('#message').append(html);
  scrollToBottom();

})

var locationButton = $('#get-location')
locationButton.on('click', function() {
  if(!navigator.geolocation){
    return alert('browser doposition.coords.latitute not support location api');
  }

  locationButton.attr('disabled','disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createlocationMessage', {
    latitute: position.coords.latitude,
    longitute: position.coords.longitude

  });
}, function() {
  locationButton.removeAttr('disabled').text('Send location');
  alert('Unable to fetch the location');
});
});
