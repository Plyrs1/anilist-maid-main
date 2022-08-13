const ConfigModel = require('./models/Config.js')

const defaultValue = [
    { name: "anilistKey", value: "INSERT_ANILIST_KEY_HERE"},
    { name: "discordWebhook", value: "DISCORD_WEBHOOK_HERE"}
  ]

const getConfig = async (name) => {
  const tmp = await ConfigModel.findOne({name});
  console.log(`[-] get content : ${name}`);
  if(!!tmp === true) { return tmp };
  console.log(`[-] not exist. setting default value : ${name}`);
  const tmp2 =  defaultValue.filter(i => i.name === name)[0]
  const a = new ConfigModel()
  a.name = name
  a.value = !!tmp2 ? tmp2.value : null
  console.log(`[-] get content value : ${a.value}`)
  await a.save()
  return a.value
}

const setConfig = async (name, value) => {
  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  };
  
  return ConfigModel.findOneAndUpdate({name}, {value}, options);
}

  module.exports = { getConfig, setConfig}
  