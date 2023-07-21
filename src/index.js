const log = require('logger')
let logLevel = process.env.LOG_LEVEL || log.Level.INFO;
log.setLevel(logLevel);
const SWARM_SIZE = +process.env.SWARM_SIZE || 20
const APP_NAME = process.env.APP_NAME || 'unknown-app'
const POD_NAME = process.env.POD_NAME || 'unknow-pod'
const PORT = process.env.PORT || 3000
const fs = require('fs')
const path = require('path')
const mongo = require('mongoapiclient')
const getIp = require('./getIp')
const getIdentities = require('./getIdentities')
const getNewIdentities = require('./getNewIdentities')
let clientKey
const GetIp = async()=>{
  try{
    clientKey = APP_NAME+'-'+PORT+'-'+POD_NAME
    log.info('using '+clientKey+' to generate '+SWARM_SIZE+' identities...')
    UpdateIdentities()
  }catch(e){
    log.error(e)
    setTimeout(GetIp, 5000)
  }
}
const UpdateIdentities = async()=>{
  try{
    let identities
    let currentIdentities = await getIdentities(clientKey)
    if(currentIdentities?.length >= SWARM_SIZE) identities = currentIdentities
    if(!identities) identities = getNewIdentities(clientKey, currentIdentities, SWARM_SIZE)
    let status = await SaveIdentityFile(identities)
    if(!status) throw('error saving identities.json file ...')
  }catch(e){
    log.error(e)
    setTimeout(UpdateIdentities, 5000)
  }
}
const SaveIdentityFile = async(identities = [])=>{
  try{
    if(identities.length < SWARM_SIZE) throw('only'+identities.length+'/'+SWARM_SIZE+' provided...')
    await mongo.set('clientIdentityList', {_id: clientKey}, {data: identities})
    fs.writeFileSync(path.join(baseDir, 'data', 'identities.json'), JSON.stringify(identities))
    log.info('Saved '+identities.length+'/'+SWARM_SIZE+' to mongo and identities.json...')
    return true
  }catch(e){
    throw(e)
  }
}
GetIp()
