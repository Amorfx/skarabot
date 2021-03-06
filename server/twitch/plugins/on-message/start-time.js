let startTime = null;

module.exports = async ({ message, client }, next) => {
  if (startTime) {
    message.data.startTime = startTime;
    return next();
  }

  const channel = message.channel.slice(1);
  const stream = await client.api.helix.streams.getStreamByUserName(channel);

  if (!stream) {
    message.data.startTime = 0;
    startTime = 0;
    return next();
  }

  const startedAt = stream._data["started_at"];
  const gmt = Math.abs(new Date().getTimezoneOffset()) * 60;
  startTime = new Date(startedAt).getTime() + gmt;
  message.data.startTime = startTime;

  next();
};
