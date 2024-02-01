'use strict'
const fs = require('fs')
const log = require('logger')
const path = require('path')
module.exports = async(podName)=>{
  try{
    fs.mkdirSync(path.join('/app/identity', podName), { recursive: true })
    let data = await fs.readFileSync(path.join('/app/identity', podName, 'identities.json'))
    if(data){
      let identities = JSON.parse(data)
      log.info(`Found identities.json file for ${podName} with ${identities.length} id's`)
      return identities
    }
  }catch(e){
    log.error(e)
  }
}
