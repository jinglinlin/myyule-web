import { myPost } from './index'

// 查询部落数据
export function getClubInfo(params,token) {
  return myPost(params, 'myyule_get_club_info', '1.0',token)
}
// 查询部落列表
export function getClubList(params,token) {
  return myPost(params, 'myyule_get_club', '1.0',token)
}
//退出/删除部落
export function deleteClub(params,token) {
  return myPost(params, 'myyule_delete_club_member', '1.0',token)
}
//关注
export function putUserFollow(params,token) {
  return myPost(params, 'myyule_put_user_follow', '1.0',token)
}
//取消关注
export function deleteUserFollow(params,token) {
  return myPost(params, 'myyule_delete_user_follow', '1.0',token)
}
// 部落成员
export function getClubMember(params,token) {
  return myPost(params, 'myyule_get_club_member', '1.0',token)
}
// 推荐部落
export function getRecommendClub(params,token) {
  return myPost(params, 'myyule_get_club', '1.0',token)
}

// 查询部落资源（话题/活动/签到榜/音乐/视频/相册） 
export function getClub_Res(params,token) {
  return myPost(params, 'myyule_get_club_resource', '1.0',token)
}
// 进入群聊
export function getChat(params,token) {
  return myPost(params, 'myyule_get_chat', '1.0',token)
}
// 2.3.4查询部落签到状态
export function getClubSign(params,token) {
  return myPost(params, 'myyule_get_club_sign', '1.0',token)
}
// 2.3.5部落签到
export function putClubSign(params,token) {
  return myPost(params, 'myyule_put_club_sign', '1.0',token)
}
// 2.3.6加入部落
export function putClubMember(params,token) {
  return myPost(params, 'myyule_put_club_member', '1.0',token)
}
// 2.3.1创建/编辑部落
export function putClub(params,token) {
  return myPost(params, 'myyule_put_club', '1.0',token)
}
// 点赞
export function putThumb(params,token) {
  return myPost(params, 'myyule_put_thumb', '1.0',token)
}
// 取消点赞
export function deleteThumb(params,token) {
  return myPost(params, 'myyule_delete_thumb', '1.0',token)
}
// 2.15.4举报接口
export function putReport(params,token) {
  return myPost(params, 'myyule_put_report', '1.0',token)
}
// 2.3.11创建音乐人官方粉丝部落
export function putMusicianClub(params,token) {
  return myPost(params, 'myyule_put_musician_club', '1.0',token)
}
// 获取视频地址
export function getVideoPlay(params,token) {
  return myPost(params, 'myyule_get_video_play', '1.0',token)
}
