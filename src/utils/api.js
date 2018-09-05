/**
 * @description API 封装工具类
 */

import qs from 'qs'
import config from '../utils/config'
const stream = weex.requireModule('stream')
const modal = weex.requireModule('modal')
// http base url
const baseUrl = (config.versionControl=='official')?'https://srcmyyule.teamshub.com':'https://testmyyule.teamshub.com'
// const baseUrl = 'https://srcmyyule.teamshub.com'
// const baseUrl = 'http://172.26.101.5:8080/'
// const baseUrl = ''


function get(url, params) {
  return new Promise((resolve, reject) => {
    console.log('request:', `${baseUrl + url}?${qs.stringify(params)}`)
    stream.fetch({
      method: 'GET',
      url: `${baseUrl + url}?${qs.stringify(params)}`,
      type: 'json'
    }, res => {
      console.log('GET res :' + res)
      if (res.ok && res.data && res.data.code === 0) {
        resolve(res.data)
      } else {
        reject(res.data)
      }
    }, progress => {
      console.log('get in progress:' + progress.length)
    })
  })
}

function post(url, body) {
  return new Promise((resolve, reject) => {
    stream.fetch({
      method: 'POST',
      credentials: 'include',
      withCredentials: true,
      url: baseUrl + url,
      timeout: 20000, //20s
      type: 'json',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8'
      },
      body: JSON.stringify(body)
    }, res => {
      // if (res.ok && res.data && res.data.code === 0) {
      if (res.data) {
        if (res.data.missionResult) {
          console.log('任务完成')
          modal.toast({
            message: res.data.missionResult[0].missionName + "任务完成",
            duration: 1
          });
        }
      }
      resolve(res.data)
      // } else {
      //   reject(res.data)
      // }
    }, progress => {
      console.log('get in progress:' + progress.length)
    })
  })
}

export default {
  get,
  post
}