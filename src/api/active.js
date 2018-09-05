import api from 'utils/api.js'

const commParams = {
  version:'1.0',
  action:'request',
  source:'',
  appid:''
}
// 活动 
export function getClub_Activity(params) {
  if(params){
    params = Object.assign(params,commParams)
  }
  return api.post('/myyule/club_Activity',params)
}