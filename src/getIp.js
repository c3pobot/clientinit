const fetch = require('node-fetch');
const parseResponse = async(res)=>{
  try{
    if(!res) return
    if (res.status?.toString().startsWith('5')) throw('Bad status code '+res.status)
    let body
    if (res.headers?.get('Content-Type')?.includes('application/json')) {
      body = await res?.json()
    } else {
      body = await res?.text()
    }
    if(!body && res?.status === 204) body = res.status
    return body
  }catch(e){
    throw(e)
  }
}
const fetchUrl = async (url, options = {}) => {
  try{
    let res = await fetch(url)
    return await parseResponse(res)
  }catch(e){
    throw(e)
  }
};

const getIpV4String = async (url, options) => {
  try {
    const response = await fetchUrl(url);
    return response?.trim();
  } catch (e) {
    throw(e);
  }
}

const getICanHazIpV4 = (options) => getIpV4String(`https://ipv4.icanhazip.com`);

const getIpifyV4 = (options) => getIpV4String(`https://api.ipify.org`);

const getAwsCheckIpV4 = (options) => getIpV4String(`https://checkip.amazonaws.com`);

module.exports = async () => {
  let publicIp = await Promise.any([getICanHazIpV4(), getAwsCheckIpV4(), getIpifyV4()]);
  if (publicIp) return publicIp;
};
