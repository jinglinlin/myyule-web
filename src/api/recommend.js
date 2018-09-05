import { myPost } from './index'

// 2.1.3获取轮播图资源
export function getBanner(params,token) {
  return myPost(params, 'myyule_get_banner', '1.0',token)
}
// 2.1.4获取动态公告
export function getIndexNotice(params,token) {
  return myPost(params, 'myyule_get_index_notice', '1.0',token)
}
// 2.1.1获取首页推荐资源
export function getIndex(params,token) {
  return myPost(params, 'myyule_get_index', '1.0',token)
}
// 2.15.1广告图
export function getAdv(params,token) {
  return myPost(params, 'myyule_get_adv', '1.0',token)
}
// 2.1.6首页—换一批
export function getIndexChange(params,token) {
  return myPost(params, 'myyule_get_index_change', '1.0',token)
}
// 2.1.7搜索
export function getSearch(params,token) {
  return myPost(params, 'myyule_get_search', '1.0',token)
}
// 2.1.5获取今日推荐歌曲
export function getDailySong(params,token) {
  return myPost(params, 'myyule_get_daily_song', '1.0',token)
}
// 2.6.2播放视频
export function getVideoPlay(params,token) {
  return myPost(params, 'myyule_get_video_play', '1.0',token)
}
// 2.12.17查询两用户之间关系
export function getUserRelation(params,token) {
  return myPost(params, 'myyule_get_user_relation', '1.0',token)
}
// 2.4.1歌曲详情
export function getSongInfo(params,token) {
  return myPost(params, 'myyule_get_song_info', '1.0',token)
}