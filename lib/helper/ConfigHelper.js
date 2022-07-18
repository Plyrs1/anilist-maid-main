const defaultValue = [
    { name: "anilistKey", value: "INSERT_ANILIST_KEY_HERE"},
    { name: "discordWebhook", value: "DISCORD_WEBHOOK_HERE"}
  ]
  
  class ConfigHelper {
    constructor(config) {
      this.config = config
    }
    async _default(name){
      console.log(`[-] get content3 : ${name}`)
      const tmp =  defaultValue.filter(i => i.name === name)[0]
      const a = new this.config()
      a.name = name
      a.value = !!tmp ? tmp.value : null
      console.log(`[-] get content3 val : ${a.value}`)
      await a.save()
      return a.value
    }
    async get(name){
      const tmp = this.config.findOne({name});
      console.log(`[-] get content : ${name}`);
      if(!!tmp === true) { return tmp };
      console.log(`[-] get content2 : ${name}`);
      return this._default(name);
    }
    async set(name, value){
      const options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      };
      
      return this.config.findOneAndUpdate({name}, {value}, options);
    }
  }
  
  module.exports = { ConfigHelper }