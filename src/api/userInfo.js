import { myPost } from './index'

// 2.12.3查看用户等级详细信息
export function getUserIevel(params, token) {
  return myPost(params, 'myyule_get_user_level', '1.0', token)
}
// 2.12.1查看用户信息
export function getUserInfo(params, token) {
  return myPost(params, 'myyule_get_user_info', '1.0', token)
}
// 2.12.2查看用户等级下的抽奖权限
export function getUserLottery(params, token) {
  return myPost(params, 'myyule_get_user_lottery', '1.0', token)
}
// 2.12.5查询任务
export function getMission(params, token) {
  return myPost(params, 'myyule_get_mission', '1.0', token)
}
// 2.12.6领取任务奖励
export function putMissionReward(params, token) {
  return myPost(params, 'myyule_put_mission_reward', '1.0', token)
}

//2.12.7查看乐币收入支出信息
export function getBillsInfo(params, token) {
  return myPost(params, 'myyule_get_bills_info', '1.0', token)
}
// 2.12.10查询乐币可兑换的商品
export function getGoods(params, token) {
  return myPost(params, 'myyule_get_goods', '1.0', token)
}
// 2.12.12获取抽奖详情
export function getLottery(params, token) {
  return myPost(params, 'myyule_get_lottery', '1.0', token)
}

// 2.12.13用户抽奖
export function putUserLottery(params, token) {
  return myPost(params, 'myyule_put_user_lottery', '1.0', token)
}
// 2.12.19查询获奖公告
export function getLotteryNotice(params, token) {
  return myPost(params, 'myyule_get_lottery_notice', '1.0', token)
}
// 2.12.9商务合作查询
export function getUserDigital(params, token) {
  return myPost(params, 'myyule_get_user_digital', '1.0', token)
}
// 2.15.6获取文字说明(申请音乐人)
export function getIntroduce(params, token) {
  return myPost(params, 'myyule_get_introduce', '1.0', token)
}
// 2.12.8每日首次登陆签到
export function putUserSign(params, token) {
  return myPost(params, 'myyule_put_user_sign', '1.0', token)
}
// 2.2.8保存用户资料（头像、昵称、学校信息）
export function putUserInfo(params, token) {
  return myPost(params, 'myyule_update_user_info', '1.0', token)
}
// 2.2.10更新用户昵称
export function putUserNickname(params, token) {
  return myPost(params, 'myyule_put_user_nickname', '1.0', token)
}
// 2.9.7查看用户收藏
export function putGetCollection(params, token) {
  return myPost(params, 'myyule_get_collection', '1.0', token)
}
// 2.2.6查询学校/院系列表
export function putPlace(params, token) {
  return myPost(params, 'myyule_get_place', '1.0', token)
}
// 2.2.4更新用户头像
export function putUserIcon(params, token) {
  return myPost(params, 'myyule_put_user_icon', '1.0', token)
}
// 2.2.11设置密码
export function putUserPwd(params, token) {
  return myPost(params, 'myyule_put_user_pwd', '1.0', token)
}
// 点赞
export function getThumb(params,token) {
    return myPost(params, 'myyule_put_thumb', '1.0',token)
}
//取消点赞
export function getThumbDel(params,token) {
    return myPost(params, 'myyule_delete_thumb', '1.0',token)
}
// 2.17.1请求地址记录
export function putUrlLog(params,token) {
  return myPost(params, 'myyule_put_url_log', '1.0',token)
}
// 2.2.6查询学校/院系列表
export function getPlace(params,token) {
  return myPost(params, 'myyule_get_place', '1.0',token)
}
