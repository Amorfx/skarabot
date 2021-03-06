const { shuffle, getRandomVideoByUserName } = require("../utils");
const store = require("../../../../store/pause-channels");

// DONE: command !pause <min>
// DONE: pick random start location
// DONE: increase countound if < 0 -> +42s
// DONE: command !pause stop
// DONE: loop videos
// DONE: command !pause [+-]<user>
// DONE: check if mature chanel
// DONE: random playlist

// TODO: show live stream first ???

let channels = store.get("channels");

module.exports = ({ command, message, client }) => {
  const user = message.data.user;
  let input = command.args.join(" ");

  if (!message.data.badges.broadcaster) {
    client.chat.say(message.channel, `Usage: pas pour toi ${user.name} Kappa`);
    return;
  }

  if (input === "stop") {
    return client.emit("pause.stop");
  }

  if (input && input.length > 1 && ["+", "-"].includes(input[0])) {
    const char = input[0];
    const users = input
      .slice(1)
      .split(/[ ,]+/g)
      .filter((w) => w);

    users.forEach((user) => {
      const exists = channels.indexOf(user);

      if (char === "+" && exists == -1) {
        channels.push(user);
      } else if (char === "-" && exists > -1) {
        channels.splice(exists, 1);
      }
    });

    store.set("channels", channels);

    return;
  }

  const minutes = parseFloat(input);

  if (!minutes || isNaN(minutes)) {
    client.chat.say(message.channel, `Usage: !pause <int>`);
    return;
  }

  const promises = channels.map((name) =>
    getRandomVideoByUserName({ client, name, channel: message.channel })
  );

  Promise.all(promises)
    .then((videos) => {
      videos = videos.filter((video) => video);
      client.emit("pause.start", { minutes, videos: shuffle(videos) });
    })
    .catch((error) => {
      console.log("ERROR >>>", error);
    });
};
