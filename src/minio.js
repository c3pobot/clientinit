'use strict'
const log = require('logger')
const minio = require('minio-client')
const MINIO_BUCKET = process.env.MINIO_BUCKET
module.exports.get = async(podName)=>{
  try{
    if(!MINIO_BUCKET) return
    let identities = await minio.getJSON(MINIO_BUCKET, podName, 'identities')
    if(identities){
      log.info(`Found ${identities?.length} in minio storage`)
      return identities
    }
  }catch(e){
    log.error(e)
  }
}
module.exports.set = async(podName, identities)=>{
  try{
    if(!MINIO_BUCKET) return
    return await minio.putJSON(MINIO_BUCKET, podName, 'identities', identities, null)
  }catch(e){
    log.error(e)
  }
}
