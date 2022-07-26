const { RateLimiter } = require('limiter')

class Discord {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl
    this.limiter = new RateLimiter({
      tokensPerInterval: 10,
      interval: "minute",
      fireImmediately: true
    });
  }
  buildEmbed(title, description, color=9764696) {
    return {
      "content": null,
      "embeds": [
        {
          title,
          description,
          color,
          "footer": {
            "text": `${user.name}`,
            "icon_url": `${user.avatar}`
          },
          "timestamp": (new Date()).toISOString()
        }
      ]
    }
  }

  send(embed) {
    console.time('discord-ratelimit')
    const remainingRequests = await this.limiter.removeTokens(1)
    console.timeEnd('discord-ratelimit')
    if (remainingRequests <= 0) {
      console.error('[x] Rate limited.')
      // return null
    }
    const a = await fetch(`${this.webhookUrl}?wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(embed)
    })
    if(a.status !== 200){
      console.log(`Error ${a.status}: ${a.statusText}`)
      console.log(await a.text())
      console.log(JSON.stringify(data))
      return null
    }
    return a.json()
  }
}

module.exports = { Discord }