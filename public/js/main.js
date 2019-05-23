// Data to test functions
localStorage.setItem(
  "channels",
  JSON.stringify(["general", "cultural", "games", "books"])
);

const $listChannel = document.getElementById("listChannel");
const $channelHeader = document.getElementsByClassName("channel-header")[0];

console.log("🚀");

function renderChannel() {
  const channels = JSON.parse(localStorage.getItem("channels"));
  $listChannel.innerHTML = channels.reduce((html, channel) => {
    const htmlElement = `<li onclick = "handleChangeChannel('${channel}')"> # ${channel}</li>`;
    return html + htmlElement;
  }, "");
}

function handleChangeChannel(channel) {
  $channelHeader.innerHTML = channel;
}

renderChannel();
