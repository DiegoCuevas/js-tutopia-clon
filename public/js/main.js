const $listChannel = document.getElementById('listChannel');
const $channelHeader = document.getElementsByClassName('channel-header')[0];
const $formNewMessage = document.getElementById('newMessage');
const $listMessage = document.getElementById('listMessage');
const $username = document.getElementById('user__name');
// const socket = new WebSocket(`ws://${location.hostname}:${location.port}`); for production
const socket = new WebSocket(`ws://localhost:3000`);
const messages = JSON.parse(localStorage.getItem('messages')) || [
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

function renderUsername() {
  $username.innerText = currentUser.name;
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
    const newMessage = JSON.parse(event.data);
    messages.push(newMessage);
    sendNotification(newMessage);
    renderMessages(messages);
    verifyChannel(newMessage);
    localStorage.setItem('messages', JSON.stringify(messages));
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
  socket.send(
    JSON.stringify({
      id: new Date().getTime(),
      content: content,
      user: currentUser.name,
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
  if (!channels.includes(nameChannel)) {
    channels.push(nameChannel);
    localStorage.setItem('channels', JSON.stringify(channels));
    renderChannel();
  } else {
    alert('The channel already exists!'); // replace by notification custom
  }
}

function compareName(channels, value) {
  return channels.find(channel => channel == value);
}

const modal = document.getElementById('myModal');
const btn = document.getElementById('create');
const span = document.getElementsByClassName('close')[0];

btn.onclick = function() {
  modal.showModal();
};

span.onclick = function() {
  modal.style.display = 'none';
};

window.onclick = function(event) {
  if (event.target == modal) {
    modal.close();
  }
};

const $formChannel = document.getElementById('createChnnel');
$formChannel.addEventListener('submit', handleSubmit);
$inputChannel = document.getElementById('input-new-channel');

function handleSubmit(event) {
  event.preventDefault();
  const $name = event.target.elements.name.value;
  createChannel($name);
  renderChannel(); //Re-render show new created channel
  handleChangeChannel($name)
  $inputChannel.value="";
  modal.close();
}

async function askingNotification() {
  let status = await Notification.requestPermission();
  if (Notification.permission !== 'granted') {
    console.log('notification desactive'); // replace by notification custom
  }
}

function sendNotification(data) {
  if (data.user != currentUser.name || data.channel != currentChannel.channel) {
    const notification = new Notification(`Message's ${data.user}`, {
      body: data.content,
      icon: './img/logo.jpg'
    });
    notification.onclick = event => {
      notification.close();
    };
  }
}

function verifyChannel(message) {
  const channels = JSON.parse(localStorage.getItem('channels')) || [];
  if (!channels.includes(message.channel)) {
    createChannel(message.channel);
  }
}

function verifyUser() {
  if (!localStorage.getItem('user')) {
    window.location = 'login.html';
  }
}

// test();
verifyUser();
renderChannel();
askingNotification();
initSocket();
renderMessages(messages);
renderUsername();

console.log(
  `🚀 If you are reading this, we can use your skills to improve this application. We are a young StartUp company,
  building apps for fun, thirst of knowledge and profit. Reach us at this very app or through our email: 1337team@gmail.com`
);
