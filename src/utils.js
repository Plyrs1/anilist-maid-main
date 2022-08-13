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
  return cronParser.parseExpression(cron).next().getTime();
}

const cronToHumanTime = (crons) => {
  return Object.keys(crons).reduce((obj, i) => {obj[i] = msToDay(cronParse(crons[i]) - Date.now()); return obj},{})

}

const cronToEpoch = (crons) => {
  return Object.keys(crons).reduce((obj, i) => {obj[i] = cronParse(crons[i]); return obj},{})
}

module.exports = { msToDay, cronParse, cronToHumanTime, cronToEpoch }
