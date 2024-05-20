const log = require('./logger');
const { createHash } = require('crypto');
const fs = require('fs')
const SWARM_SIZE = +process.env.SWARM_SIZE || 20
const APP_NAME = process.env.APP_NAME || 'unknown-app'
const POD_NAME = process.env.POD_NAME || 'unknow-pod'
const PORT = process.env.PORT || 3000
const hash = (string) => {
  return createHash('sha256').update(string).digest('base64');
}
const create = ()=>{
  try{
    let array = [], clientKey = APP_NAME+'-'+PORT+'-'+POD_NAME
    log.info(`Attempting to create ${SWARM_SIZE} identities using key ${clientKey}`)
    let i = 0
    while( i++ < SWARM_SIZE ){
      let key = `${clientKey}-${i}`
      let clientHash = hash(key).toString()
      array.push({
        clientId: i,
        uid: clientHash,
        deviceId: clientHash,
        androidId: clientHash.slice(0, 16)
      })
    }
    if(array.length > 0 && array.length === SWARM_SIZE){
      fs.writeFileSync(process.env.IDENTITY_FILE_PATH, JSON.stringify(array))
      log.info(`Saved ${array.length}/${SWARM_SIZE} identities to ${process.env.IDENTITY_FILE_PATH}`)
      return
    }
    setTimeout(create, 500)
  }catch(e){
    log.error(e)
    setTimeout(create, 500)
  }
}
create()
