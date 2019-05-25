const $listChannel = document.getElementById('listChannel');
const $channelHeader = document.getElementsByClassName('channel-header')[0];
const $formNewMessage = document.getElementById('newMessage');
const $listMessage = document.getElementById('listMessage');
const $username = document.getElementById('user__name');
const socket = new WebSocket(socketUrl());
const $messageList = document.querySelector('.messages');
const $notify = document.getElementById('notifications');
const $connectNotify = document.getElementById('connection-notification');
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
  $username.innerText = currentUser ? currentUser.name : '';
}

function renderChannel() {
  const channels = JSON.parse(localStorage.getItem('channels')) || [];
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
    socket.send(
      JSON.stringify({
        user: currentUser.name,
        channel: currentChannel
      })
    );
    sendMessage('He joined the room.');
  });

  socket.addEventListener('close', () => {
    console.log('Connection closed');
    $connectNotify.style.display = 'flex';
  });

  socket.addEventListener('message', event => {
    const newMessage = JSON.parse(event.data);
    if (newMessage.type == 'message') {
      renderMessages([...messages, { ...newMessage, new: true }]);
      localStorage.setItem('messages', JSON.stringify(messages));
      if (
        (newMessage.content === 'He joined the room.') &
        (currentUser.name != newMessage.user)
      ) {
        setTimeout(() => {
          sendMessage('still connected');
        }, 5000);
      }
      messages.push(newMessage);
      sendNotification(newMessage);
    }
    verifyChannel(newMessage);
  });
}

function formatDate(time) {
  const date = new Date(time);
  const currentTime = new Date();
  if (
    date.getDate() === currentTime.getDate() &&
    date.getMonth() === currentTime.getMonth() &&
    date.getFullYear() === currentTime.getFullYear()
  ) {
    return 'Today';
  }

  if (
    date.getDate() === currentTime.getDate() - 1 &&
    date.getMonth() === currentTime.getMonth() &&
    date.getFullYear() === currentTime.getFullYear()
  ) {
    return 'Yesterday';
  }

  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  return `${dayNames[date.getDay()]}, ${date.getDate()} of ${
    monthNames[date.getMonth()]
  }`;
}

function groupBy(array, key) {
  return array.reduce((accum, x) => {
    (accum[renderDate(x[key])] = accum[renderDate(x[key])] || []).push(x);
    return accum;
  }, {});
}

function addDivision(data) {
  return `<div class="division"><hr /><span>${formatDate(
    data
  )}</span><hr /></div>`;
}

function prepareMessages(messages) {
  const currentTime = Date.now();
  return messages
    .filter(message => message.channel == currentChannel)
    .reduce((html, message) => {
      return (
        html +
        `${
          renderDate(message) < renderDate(currentTime)
            ? '<li class="old-message">'
            : '<li>'
        }
          <div class="message__content ${message.new ? 'fadeInLeft' : ''}">
            <span 
              class="message__header"
            >
              ${renderTime(message)} ${message.user}
            </span>
            -  ${message.content}
          </div>
        </li>`
      );
    }, '');
}

function renderMessages(messages) {
  let text = groupBy(messages, 'id');
  let html = '';
  Object.keys(text).map((key, index, curr) => {
    const filterMessages = text[key].filter(
      message => message.channel == currentChannel
    );
    if (filterMessages.length > 0) {
      html += `${addDivision(key)}</p>`;
    }
    html += prepareMessages(filterMessages);
  });
  $listMessage.innerHTML = html;
  $messageList.scrollTo(0, $messageList.scrollHeight);
}

function renderTime({ id }) {
  const time = new Date(id);
  const hours = ('0' + time.getHours()).slice(-2);
  const minutes = ('0' + time.getMinutes()).slice(-2);
  const seconds = ('0' + time.getSeconds()).slice(-2);
  return `${hours}:${minutes}:${seconds}:`;
}

function renderDate(date) {
  if (typeof date == 'object') date = date.id;
  const time = new Date(date);
  const years = time.getFullYear();
  const months = ('0' + (time.getMonth() + 1)).slice(-2);
  const days = ('0' + time.getDate()).slice(-2);
  return `${months}/${days}/${years}`;
}

function socketUrl() {
  return location.hostname == 'localhost'
    ? 'ws://localhost:3000'
    : `wss://${location.hostname}:${location.port}`;
}

function sendMessage(content) {
  socket.send(
    JSON.stringify({
      id: new Date().getTime(),
      content: content,
      user: currentUser.name,
      channel: currentChannel,
      type: 'message'
    })
  );
}

function sendChannel(channel) {
  socket.send(
    JSON.stringify({
      id: new Date().getTime(),
      content: '',
      user: currentUser.name,
      channel: channel,
      type: 'channel'
    })
  );
}

$formNewMessage.addEventListener('submit', e => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  if (message == '') return;
  sendMessage(message);
  e.target.elements.message.value = '';
});

function createChannel(nameChannel) {
  const channels = JSON.parse(localStorage.getItem('channels')) || [];
  if (!channels.includes(nameChannel)) {
    channels.push(nameChannel);
    localStorage.setItem('channels', JSON.stringify(channels));
    sendChannel(nameChannel);
    renderChannel();
  } else {
    alert('The channel already exists!'); // replace by notification custom
  }
}

function compareName(channels, value) {
  return channels.find(channel => channel == value);
}

const modal = document.getElementById('myModal');
const $btnCreateChannel = document.querySelectorAll('.btn-create-channel');
const span = document.getElementsByClassName('close')[0];

$btnCreateChannel.forEach(element => {
  element.addEventListener('click', () => {
    modal.showModal();
  });
});

span.onclick = function() {
  modal.close();
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
  handleChangeChannel($name);
  $inputChannel.value = '';
  modal.close();
}

function showNotification() {
  const permission = Notification.permission;
  if (permission == 'default') {
    $notify.style.display = 'flex';
    document.documentElement.style.setProperty(
      '--height-app',
      'calc(100vh - 55px)'
    );

    document
      .getElementById('close-notification')
      .addEventListener('click', () => {
        $notify.style.display = 'none';
        document.documentElement.style.setProperty('--height-app', '100vh');
      });

    document
      .getElementById('ask-notification')
      .addEventListener('click', async () => {
        $notify.style.display = 'none';
        document.documentElement.style.setProperty('--height-app', '100vh');
        const status = await Notification.requestPermission();
        if (status == 'granted') {
          new Notification(`A notification of Utopia`, {
            body: 'Well, notifications are activated!',
            icon: './img/logo.jpg'
          });
        }
      });
  }
  $connectNotify.addEventListener('click', async () => {
    $connectNotify.style.display = 'none';
    document.documentElement.style.setProperty('--height-app', '100vh');
    const response = (location.href = '/index.html');
  });
}

function sendNotification(data) {
  if (
    data.user != currentUser.name &&
    data.channel != currentChannel &&
    data.type == 'message'
  ) {
    const notification = new Notification(`New message in ${data.channel}`, {
      body: `${data.user}: ${data.content}`,
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
    if (message.type == 'channel' && !channels.includes(message.channel)) {
      new Notification(`New channel created`, {
        body: `${message.user} has created the ${message.channel} channel`,
        icon: './img/logo.jpg'
      });
    }
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
showNotification();
initSocket();
renderMessages(messages);
renderUsername();

console.log(
  `🚀 If you are reading this, we can use your skills to improve this application. We are a young StartUp company,
  building apps for fun, thirst of knowledge and profit. Reach us at this very app or through our email: 1337team@gmail.com`
);

//
function openNav() {
  document.getElementById('mySidenav').style.width = '250px';
}

function closeNav() {
  document.getElementById('mySidenav').style.width = '0';
}
//
