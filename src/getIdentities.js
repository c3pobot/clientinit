'use strict'
const log = require('logger')
const mongo = require('mongoapiclient')
module.exports = async(clientKey)=>{
  try{
    if(!clientKey) throw('No clientKey provided to check the database...')
    let list = (await mongo.find('clientIdentityList', {_id: clientKey}))[0]
    let count = list?.data?.length || 0
    log.info('found '+count+' identities in mongo...')
    if(list?.data) return list.data
  }catch(e){
    throw(e)
  }
}
