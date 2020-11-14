const logs = require("../../../libs/logs");

module.exports = ({ message, client }, next) => {
  const { avatarURL } = message.data.user;
  const text = message.message;
  const { user } = message;

  if (text.startsWith("!!!") || text.endsWith("!!!")) {
    logs.add("idea", { user, avatarURL, text });
    client.io.emit("logs.update", logs.getAll());
  }

  next();
};
