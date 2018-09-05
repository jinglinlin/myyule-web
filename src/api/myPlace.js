import { myPost } from './index'

// 2.12.18查询动态
export function putLotteryNotice(params,token) {
  return myPost(params, 'myyule_get_user_dynamics', '1.0',token)
}
// 2.4.4查询歌曲列表
export function getSong(params,token) {
  return myPost(params, 'myyule_get_song', '1.0',token)
}
// 2.5.3查询专辑列表
export function getAlbum(params,token) {
  return myPost(params, 'myyule_get_album', '1.0',token)
}
// 2.9.6用户收藏
export function getCollection(params,token) {
  return myPost(params, 'myyule_get_collection', '1.0',token)
}
// 2.12.19查询用户活动卡卷
export function getUserActivityCard(params,token) {
  return myPost(params, 'myyule_get_user_activityCard', '1.0',token)
}
// 2.12.16查询用户好友/关注/粉丝
export function getUserFriend(params,token) {
  return myPost(params, 'myyule_get_user_friend', '1.0',token)
}
// 2.16.1获取用户相册图片
export function getUserPhoto(params,token) {
  return myPost(params, 'myyule_get_user_photo', '1.0',token)
}
// 2.9.11查看通知
export function getNotice(params,token) {
  return myPost(params, 'myyule_get_notice', '1.0',token)
}
//2.9.13消费通知(重置通知数量)
export function feedNotice(params,token) {
  return myPost(params, 'myyule_feed_notice', '1.0',token)
}