const users = require("../../../../libs/users");

const maxCount = 42;
const costRatio = 10;

module.exports = ({ command, message, client }) => {
  const user = message.data.user;
  let [count] = command.args;

  count = parseInt(count);

  if (count > maxCount) {
    count = maxCount;
    client.chat.say(
      message.channel,
      `Désolé ${user.name} tu vas blinker que ${maxCount}x.`
    );
  }

  if (isNaN(count) || count <= 0) {
    client.chat.say(message.channel, `Usage: !blink <count> (max:${maxCount})`);
    return;
  }

  const cost = Math.abs(count * costRatio);

  if (user.points < cost) {
    client.chat.say(
      message.channel,
      `Désolé ${user.name} tu n'as pas assez de points pour blinker (cost: ${cost}).`
    );
    return;
  }

  user.points -= cost;
  users.update(user);

  client.io.emit("wof.blink", { user, count });
};
