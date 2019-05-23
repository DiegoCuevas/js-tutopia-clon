const $listChannel = document.getElementById('listChannel');
const $channelHeader = document.getElementsByClassName('channel-header')[0];
const $formNewMessage = document.getElementById('newMessage');
const $listMessage = document.getElementById('listMessage');
const socket = new WebSocket(`ws://localhost:3000/connection`);
const messages = [
  {
    id: 1558261595489,
    user: 'diegoC',
    content: 'Papito mi rey',
    channel: 'general'
  },
  {
    id: 1558355195489,
    user: 'ChristophR',
    content: 'nuevo canal',
    channel: 'cultural'
  },
  {
    id: 1558481195489,
    user: 'diegoC',
    content: 'El más capo',
    channel: 'general'
  },
  {
    id: 1558481315489,
    user: 'deyviC',
    content: 'Chifita?',
    channel: 'general'
  },
  {
    id: 1558562359188,
    user: 'carlosA',
    content: 'This is a test message',
    channel: 'general'
  },
  {
    id: 1558562379149,
    user: 'diegoC',
    content: 'Noo nooooo',
    channel: 'general'
  },
  {
    id: 1558562391504,
    user: 'deyviC',
    content: 'Siñorsh',
    channel: 'games'
  },
  {
    id: 1558562556177,
    user: 'christophR',
    content: 'Kill Lian',
    channel: 'games'
  },
  {
    id: 1558562573403,
    user: 'frankC',
    content: 'Como abordar el problema',
    channel: 'books'
  }
];
const currentUser = JSON.parse(localStorage.getItem('user'));
let currentChannel = 'general';

function test() {
  //  Data to test functions
  localStorage.setItem(
    'channels',
    JSON.stringify(['general', 'cultural', 'games', 'books'])
  );
  localStorage.setItem('messages', JSON.stringify(messages));
}

function renderChannel() {
  const channels = JSON.parse(localStorage.getItem('channels'));
  $listChannel.innerHTML = channels.reduce((html, channel) => {
    const htmlElement = `<li 
      onclick = "handleChangeChannel('${channel}')" 
      class="${currentChannel == channel ? 'active' : ''}"
      > 
        # ${channel}
      </li>`;
    return html + htmlElement;
  }, '');
}

function handleChangeChannel(channel) {
  currentChannel = channel;
  $channelHeader.innerHTML = `# ${channel}`;
  renderMessages(messages, channel);
  renderChannel();
}

function initSocket() {
  socket.addEventListener('open', () => {
    console.log('Connection open');
  });

  socket.addEventListener('close', () => {
    alert('Connection closed');
  });

  socket.addEventListener('message', event => {
    messages.push(JSON.parse(event.data));
    renderMessages(messages);
  });
}

function renderMessages(messages) {
  // Should this be a global variable?
  const currentTime = Date.now();
  $listMessage.innerHTML = messages
    .filter(message => message.channel == currentChannel)
    .reduce((html, message) => {
      return (
        html +
        `${
          renderDate(message.id) < renderDate(currentTime)
            ? '<li class="old-message">'
            : '<li>'
        }<span class="message-header">${renderTime(message)} ${
          message.user
        }</span> -  ${message.content}</li>`
      );
    }, '');
}

function renderTime({ id }) {
  const hours = ('0' + new Date(id).getHours()).slice(-2);
  const minutes = ('0' + new Date(id).getMinutes()).slice(-2);
  const seconds = ('0' + new Date(id).getSeconds()).slice(-2);
  return `${hours}:${minutes}:${seconds}:`;
}

function renderDate(date) {
  if (typeof date == 'object') date = date.id;
  const years = new Date(date).getFullYear();
  const months = new Date(date).getMonth() + 1;
  const days = new Date(date).getDate();
  return `${years}-${months}-${days}`;
}

function sendMessage(content) {
  console.log(content, currentChannel);
  socket.send(
    JSON.stringify({
      id: new Date().getTime(),
      content: content,
      user: currentUser.username,
      channel: currentChannel
    })
  );
}

$formNewMessage.addEventListener('submit', e => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  sendMessage(message);
  e.target.elements.message.value = '';
});

function createChannel(nameChannel) {
  const channels = JSON.parse(localStorage.getItem('channels')) || [];
  if (!compareName(channels, nameChannel)) {
    channels.push(nameChannel);
    localStorage.setItem('channels', JSON.stringify(channels));
  } else console.log('The channel already exist!');
}

function compareName(channels, value) {
  return channels.find(channel => {
    return channel == value;
  });
}

const modal = document.getElementById('myModal');
const btn = document.getElementById('create');
const span = document.getElementsByClassName('close')[0];

btn.onclick = function() {
  modal.style.display = 'block';
};

span.onclick = function() {
  modal.style.display = 'none';
};

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

const $formChannel = document.getElementById('createChnnel');
$formChannel.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  const $name = event.target.elements.name.value;
  createChannel($name);
}

test();
renderChannel();
initSocket();
renderMessages(messages);

console.log(
  `🚀 If you are reading this, we can use your skills to improve this application. We are a young StartUp company,
  building apps for fun, thirst of knowledge and profit. Reach us at this very app or through our email: 1337team@gmail.com`
);
