const Canvas = require('canvas');
const fs = require('fs');
Canvas.registerFont('./src/static/font/JosefinSans-Regular.ttf', { family: 'JosefinSans' });
const Stat = require('./models/Stat.js')
const { config } = require('../config.js')
const { cronParse } = require('./utils.js')

const calcImageScale = (image, targetWidth, targetHeight) => {
  let tmpWidth = targetWidth
  const wxh = image.width / image.height
  let tmpHeight = targetWidth * wxh
  if(image.height > targetHeight) {
    tmpHeight = targetHeight
    tmpWidth = targetHeight / wxh
  }
  return {width : tmpWidth, height: tmpHeight}
}

const clipImage = (image, width, height) => {
  const canvas = Canvas.createCanvas(width, height)
  const ctx = canvas.getContext("2d")
  // canvas.width = width
  // canvas.height = height
  const calc = calcImageScale(image, width, height)
  ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(image, 0, 0, calc.width, calc.height);
  return canvas
}

const getBestFontSize = (text, maxWidth, fontSize) => {
  const canvas = Canvas.createCanvas(maxWidth, 500)
  const c = canvas.getContext("2d")
  c.font = `${fontSize}pt JosefinSans`;
  const minFontSize = 30;
  let newFontSize = fontSize;
  let width = c.measureText(text).width
  while(width > maxWidth) {
    newFontSize -= 5
    c.font = `${newFontSize}pt JosefinSans`;
    width = c.measureText(text).width
    if(width <= maxWidth || newFontSize <= minFontSize) {
      return newFontSize
    }
  }
  return newFontSize
}

const generateBanner = async (data, type) => {
  console.log('[-] Generating banner...')
  if(data.length === 0) {
    console.log('[x] No data')
    return false
  }
  var timeSpan
  var cronTimeSpan
  if(type === 'day') {
    timeSpan = 'likeReceivedToday'
    cronTimeSpan = 'getDailyRank'
  } else if(type === 'week') {
    timeSpan = 'likeReceivedWeek'
    cronTimeSpan = 'getWeeklyRank'
  } else if(type === 'month') {
    timeSpan = 'likeReceivedMonth'
    cronTimeSpan = 'getMonthlyRank'
  } else{
    console.log(`[x] Unknown time type "${type}"`)
    return false
  }

  let winnerList = data.map(value => {return {
    name: value.user.name,
    likes: value.likes,
    image: value.user.avatar
  }})
  var c = Canvas.createCanvas(500, 1200)
  var img = await Canvas.loadImage(`./src/static/image/leaderboard-bg-${type}.png`)
  var imgFirst = await Canvas.loadImage('./src/static/image/1st.png')
  var imgSecond = await Canvas.loadImage('./src/static/image/2nd.png')
  var imgThird = await Canvas.loadImage('./src/static/image/3rd.png')


  var ctx = c.getContext("2d");
  c.width = img.width
  c.height = img.height
  ctx.drawImage(img, 0,0,img.width, img.height);
  ctx.fillStyle = '#afafaf';
  for (let i = 0; i < winnerList.length; i++) {
    const element = winnerList[i];
    const canvasFirst = clipImage(await Canvas.loadImage(element.image), 500, 500)
    ctx.drawImage(canvasFirst, 910, 340 + (200 * i), 130, 130)
    if(i === 0) {
      ctx.drawImage(imgFirst, 865, 295 + (200 * i), imgFirst.width*0.80, imgFirst.height*0.80)
    } else if( i === 1){
      ctx.drawImage(imgSecond, 865, 295 + (200 * i), imgSecond.width *0.80, imgSecond.height*0.80)
    } else if(i === 2){
      ctx.drawImage(imgThird, 865, 295 + (200 * i), imgThird.width *0.80, imgThird.height*0.80)
    }
    ctx.font = `${getBestFontSize(element.name, 400, 60)}pt JosefinSans`;
    ctx.fillText(element.name, 1100, 400 + (200 * i));
    ctx.font = '36pt JosefinSans';
    ctx.fillText(`${element.likes} likes`, 1100, 460 + (200 * i));
  }

  // const time = new Date(cronParse(config.cronSchedule[cronTimeSpan]))
  const time = new Date(cronParse(config.cronSchedule.reportLikeCount))
  const today = time.toUTCString()
  ctx.font = `${getBestFontSize(today, 600, 60)}pt JosefinSans`;
  ctx.fillText(`${today}`, 38, 1165);
  await fs.promises.writeFile(`./src/static/leaderboard-${type}.png`, c.toBuffer())
};

const getDailyRank = async () => {
  const stats = await Stat.aggregate([
    { $match: {likeReceivedToday: {$gt: 0}}},
    { $project : {
      userId: 1,
      likes: '$likeReceivedToday'
    }},
    { $sort: { likes: -1 } },
    { $limit: 5 },
    { $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: 'id',
        as: 'user'
      },
    },
    {$unwind: {path: '$user',preserveNullAndEmptyArrays: false}}
  ])
  await generateBanner(stats, 'day')
  return stats
}

const getWeeklyRank = async () => {
  const stats = await Stat.aggregate([
    { $match: {
      $or: [
            {likeReceivedWeek: {$gt: 0}},
            {likeReceivedToday: {$gt: 0}}
          ]
    }},
    { $project : {
      userId: 1,
      likes: {
        $sum: ['$likeReceivedToday', '$likeReceivedWeek']
      }
    }},
    { $sort: { likes: -1 } },
    { $limit: 5 },
    { $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: 'id',
        as: 'user'
      }
    },
    {$unwind: {path: '$user',preserveNullAndEmptyArrays: false}}
  ])
  await generateBanner(stats, 'week')
  return stats
}

const getMonthlyRank = async () => {
  const stats = await Stat.aggregate([
    { $match: {
      $or: [
            {likeReceivedWeek: {$gt: 0}},
            {likeReceivedToday: {$gt: 0}},
            {likeReceivedMonth: {$gt: 0}}
          ]
    }},
    { $project : {
      userId: 1,
      likes: {
        $sum: ['$likeReceivedToday', '$likeReceivedWeek', '$likeReceivedMonth']
      }
    }},
    { $sort: { likes: -1 } },
    { $limit: 5 },
    { $lookup : {
        from: 'users',
        localField: 'userId',
        foreignField: 'id',
        as: 'user'
      }
    },
    {$unwind: {path: '$user',preserveNullAndEmptyArrays: false}}
  ])
  await generateBanner(stats, 'month')
  return stats
}

module.exports = { generateBanner, getDailyRank, getWeeklyRank, getMonthlyRank }