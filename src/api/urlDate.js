import { myPost } from './index'

//图片前缀域名
export const URL = 'http://media2.myyule.cn/';

// 2.1.3.2 获取音乐人列表（通讯录搜索音乐达人）
export function getMusicionList(params,token) {
  return myPost(params, 'myyule_get_contact_musican', '1.0',token)
}
// 2.6.1 获取MV列表(查询MV列表)
export function getMVList(params,token) {
  return myPost(params, 'myyule_get_video', '1.0',token)
}
// 2.6.2播放视频
export function getVideoPlay(params,token) {
  return myPost(params, 'myyule_get_video_play', '1.0',token)
}
// 2.15.1 广告图
export function getAdver(params,token) {
  return myPost(params, 'myyule_get_adv', '1.0',token)
}

//发行
// 2.5.1 /*获取专辑详情*/
export function getAlbumInfo(params,token) {
  return myPost(params, 'myyule_get_album_info', '1.0',token)
}
// 2.5.2 查询专辑下歌曲列表
export function getAlbumSongs(params,token) {
  return myPost(params, 'myyule_get_album_songs', '1.0',token)
}

// 2.8.1 /*获取排行榜*/(获取音乐榜详情)
export function getRankInfo(params,token) {
  return myPost(params, 'myyule_get_rank_info', '1.0',token)
}
// 2.8.2 获取榜单期刊数（rankId：'',）
export function getRankJournal(params,token) {
  return myPost(params, 'myyule_get_rank_journal', '1.0',token)
}
// 2.1.5 获取今日推荐歌曲
export function getDailySong(params,token) {
  return myPost(params, 'myyule_get_daily_song', '1.0',token)
}
//2.5.3 小编推荐歌曲(查询专辑列表)
export function getRecommendSong(params,token) {
  return myPost(params, 'myyule_get_album', '1.0',token)
}
//2.4.4 最新上架(查询歌曲列表)
export function getUpList(params,token) {
  return myPost(params, 'myyule_get_song', '1.0',token)
}
//2.9.1 评论
export function getPutComment(params,token) {
  return myPost(params, 'myyule_put_comment', '1.0',token)
}
//2.9.2 专辑评论(查看资源评论)
export function getCommentList(params,token) {
  return myPost(params, 'myyule_get_comment', '1.0',token)
}

//2.12.14 关注用户
export function focusOn(params,token) {
  return myPost(params, 'myyule_put_user_follow', '1.0',token)
}
//2.12.15 取消关注用户
export function deleteFocusOn(params,token) {
  return myPost(params, 'myyule_delete_user_follow', '1.0',token)
}
//3.9.4 点赞 （resId：'',resType：'',mobile：''）
export function putThumb(params,token) {
  return myPost(params, 'myyule_put_thumb', '1.0',token)
}

//3.9.5 取消点赞  （resId：'',resType：'',mobile：''）
export function deleteThumb(params,token) {
  return myPost(params, 'myyule_delete_thumb', '1.0',token)
}

//3.9.6 收藏 （resId：'',resType：'',mobile：''）
export function putCollect(params,token) {
  return myPost(params, 'myyule_put_collection', '1.0',token)
}
//2.9.8 取消收藏（resId：'',resType：'',mobile：''）
export function deleteCollect(params,token) {
  return myPost(params, 'myyule_delete_collection', '1.0',token)
}
