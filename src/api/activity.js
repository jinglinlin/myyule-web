 import { myPost } from './index'

// 发布活动
export function putActivity(params,token) {
  return myPost(params, 'myyule_put_activity', '1.0',token)
}
// 查看活动详情
export function putActivityInfo(params,token) {
  return myPost(params, 'myyule_put_activity_info', '1.0',token)
}
// 参加活动
export function putActivityMember(params,token) {
  return myPost(params, 'myyule_put_activity_member', '1.0',token)
}
// 退出活动
export function deleteActivityMember(params,token) {
  return myPost(params, 'myyule_delete_activity_member', '1.0',token)
}
// 查询活动成员
export function getActivityMember(params,token) {
  return myPost(params, 'myyule_get_activity_member', '1.0',token)
}
//活动签到
export function putActivitySign(params,token) {
  return myPost(params, 'myyule_put_activity_sign', '1.0',token)
}
//抽奖查询
export function putActivityLottery(params,token) {
  return myPost(params, 'myyule_put_activity_lottery', '1.0',token)
}
//查询签到用户
export function getActivitySignMember(params,token) {
  return myPost(params, 'myyule_get_activity_signMember', '1.0',token)
}
//查询活动列表
export function getActivity(params,token) {
  return myPost(params, 'myyule_get_activity', '1.0',token)
}
//删除活动
export function deleteActivity(params,token) {
  return myPost(params, 'myyule_delete_activity', '1.0',token)
}
//查看评论
export function getComment(params,token) {
  return myPost(params, 'myyule_get_comment', '1.0',token)
}
//发表评论
export function putComment(params,token) {
  return myPost(params, 'myyule_put_comment', '1.0',token)
}
//举报
export function putReport(params,token) {
  return myPost(params, 'myyule_put_report', '1.0',token)
}
//点赞
export function putThumb(params,token) {
  return myPost(params, 'myyule_put_thumb', '1.0',token)
}
//取消点赞
export function deleteThumb(params,token) {
  return myPost(params, 'myyule_delete_thumb', '1.0',token)
}
//删除评论
export function deleteComment(params,token) {
  return myPost(params, 'myyule_delete_comment', '1.0',token)
}
//进入群聊
export function getChat(params,token) {
  return myPost(params, 'myyule_get_chat', '1.0',token)
}
//2.12.17查询两用户之间的关系
export function getUserRelation(params,token) {
  return myPost(params, 'myyule_get_user_relation', '1.0',token)
}
//2.12.14关注用户
export function putUserFollow(params,token) {
  return myPost(params, 'myyule_put_user_follow', '1.0',token)
}
//2.12.15取消关注
export function deleteUserFollow(params,token) {
  return myPost(params, 'myyule_delete_user_follow', '1.0',token)
}
//2.12.1查看用户信息
export function getUserInfo(params,token) {
  return myPost(params, 'myyule_get_user_info', '1.0',token)
}
//2.15.2上传文件
export function putFile(params,token) {
  return myPost(params, 'myyule_put_file', '1.0',token)
  //myPost1请求的是ip
}
//2.9.6收藏
export function putCollect(params,token) {
  return myPost(params, 'myyule_put_collection', '1.0',token)
}
//2.9.8取消收藏
export function deleteCollect(params,token) {
  return myPost(params, 'myyule_delete_collection', '1.0',token)
}
//2.12.4 查看用户学校信息
export function getUserClassclub(params,token) {
  return myPost(params, 'myyule_get_user_classclub', '1.0',token)
}
//2.10.6 查询用户与活动关系（是否参与活动）
export function getActivityUser(params,token) {
  return myPost(params, 'myyule_get_activity_user', '1.0',token)
}