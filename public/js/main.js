const $listChannel = document.getElementById('listChannel');
const $channelHeader = document.getElementsByClassName('channel-header')[0];
const $formNewMessage = document.getElementById('newMessage');
const $listMessage = document.getElementById('listMessage');
const socket = new WebSocket(`ws://localhost:3000/connection`);
const messages = [];

console.log('🚀');

function test() {
  // Data to test functions
  localStorage.setItem(
    'channels',
    JSON.stringify(['general', 'cultural', 'games', 'books'])
  );
}

function renderChannel() {
  const channels = JSON.parse(localStorage.getItem('channels'));
  $listChannel.innerHTML = channels.reduce((html, channel) => {
    const htmlElement = `<li onclick = "handleChangeChannel('${channel}')"> # ${channel}</li>`;
    return html + htmlElement;
  }, '');
}

function handleChangeChannel(channel) {
  $channelHeader.innerHTML = channel;
}

function initSocket() {
  socket.addEventListener('open', () => {
    console.log('Connection open');
  });

  socket.addEventListener('close', () => {
    alert('Connection closed');
  });

  socket.addEventListener('message', (event) => {
    messages.push(JSON.parse(event.data));
    renderMessages(messages);
  });
}

function renderMessages(messages) {
  $listMessage.innerHTML = messages.reduce((html, message) => {
    return html + `<li> ${message.user} -  ${message.content}</li>`;
  }, '');
}

function sendMessage(content) {
  socket.send(
    JSON.stringify({
      id: new Date().getTime(),
      content: content,
      user: 'diego',
      channel: 'general'
    })
  );
}

$formNewMessage.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  sendMessage(message);
  e.target.elements.message.value = '';
});

test();
renderChannel();
initSocket();
renderMessages(messages);
