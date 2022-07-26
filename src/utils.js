const cronParser = require('cron-parser');

const msToDay = (ms) => {
  let result = ''
  days = Math.floor(ms / (24*60*60*1000));
  result += (days > 0 ? `${days} days ` : '')
  daysms=ms % (24*60*60*1000);
  hours = Math.floor((daysms)/(60*60*1000));
  result += (hours > 0 ? `${hours} hours ` : '')
  hoursms=ms % (60*60*1000);
  minutes = Math.floor((hoursms)/(60*1000));
  result += (minutes > 0 ? `${minutes} minutes ` : '')
  minutesms=ms % (60*1000);
  sec = Math.floor((minutesms)/(1000));
  result += (sec > 0 ? `${sec} seconds ` : '')
  return result
}

const cronParse = (cron) => {
  const interval = cronParser.parseExpression(cron).next();
  return msToDay(interval.getTime() - Date.now())
}
  module.exports = { msToDay, cronParse}