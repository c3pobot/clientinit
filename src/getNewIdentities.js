'use strict'
const log = require('logger')
const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('base64');
}

module.exports = (clientKey, currentIdentities = [], size)=>{
  try{
    if(!clientKey) throw('No clientKey provided to create new identities...')
    let i = 0, res = []
    while(i++ < size){
      let key = clientKey+'-'+i
      if(currentIdentities.filter(x=>x.clientId === i).length > 0) continue;
      let clientHash = hash(key).toString();
      res.push({
        clientId: i,
        uid: clientHash,
        deviceId: clientHash,
        androidId: clientHash.slice(0, 16)
      })
    }
    if(res.length > 0) log.info('Created '+res.length+' new identities...')
    res = res.concat(currentIdentities)
    return res
  }catch(e){
    throw(e)
  }
}
