import api from '../utils/api.js'
import {
  getUser
} from './weex.js'
const value = getUser()
// 公用参数
const commParams = getUser() ? {
  action: 'request',
  id: '336005',
  appid: value.appid,
  source: value.source
} : {
  action: 'request',
  id: '336005',
  appid: 'iMyyule',
  source: 'ios'
}
export function myPost(params, type, version, token) {
  let baseParams = {
    type: type,
    version: version
  }
  params = params ? Object.assign(params, commParams, baseParams, token) : commParams
  return api.post('/api/' + type + '/v' + version, params)
}