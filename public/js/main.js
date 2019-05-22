console.log("🚀");

const channels = [{ name: "general" }];
const user = [
  {
    id: "123123123123",
    username: "Papito Mi rey",
    channel: "1558544848926",
    message: "123123123123"
  }
];

function createChannel(nameChannel) {
  if (!compareName(nameChannel))
    channels.push({ id: new Date().getTime(), name: nameChannel });
  else console.log("The channel already exist!");
}

function compareName(value) {
  return channels.find(channel => {
    return channel.name == value;
  });
}

createChannel("que pasa papu");
createChannel("duke");
console.log(channels);
