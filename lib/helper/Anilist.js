const fetch = require('node-fetch')
const { RateLimiter } = require('limiter')

class Anilist {
  constructor(){
    this.limiter = new RateLimiter({
      tokensPerInterval: 80,
      interval: "minute",
      fireImmediately: true
    });
  }
  async query(q="",variables={}){
    console.time("graphql-ratelimit")
    const remainingRequests = await limiter.removeTokens(1);
    console.timeEnd("graphql-ratelimit")
    if (remainingRequests < 0) {
      console.error('[x] Rate limited.')
      return null
    }
    const a = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env['ANILIST_TOKEN']}`
      },
      body : JSON.stringify({
        query,
        variables 
      })
    })
    if(a.status !== 200){
      console.log(`Error ${a.status}: ${a.statusText}`)
      return null
    }
    const b = await a.json()
    return b.data
  }
}

module.exports = { Anilist }