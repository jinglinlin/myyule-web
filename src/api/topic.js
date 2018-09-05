import { myPost } from './index'
// 2.11.5查询历史话题标签
export function getTopicHistoryTag(params,token) {
    return myPost(params, 'myyule_get_topic_historyTag', '1.0',token)
}
// 查询话题列表
export function getTopic(params,token) {
    return myPost(params, 'myyule_get_topic', '1.0',token)
}
// 2.11.2发布话题
export function putTopic(params,token) {
    return myPost(params, 'myyule_put_topic', '1.0',token)
}
// 2.11.1修改话题
export function updateTopic(params,token) {
    return myPost(params, 'myyule_update_topic', '1.0',token)
}
// 查询话题标签列表
export function getTopicTag(params,token) {
    return myPost(params, 'myyule_get_topic_tag', '1.0',token)
}
// 查询话题详情
export function topicDetail(params,token) {
    return myPost(params, 'myyule_get_topic_info', '1.0',token)
}

//查看话题评论列表
export function getComment(params,token) {
    return myPost(params, 'myyule_get_comment', '1.0',token)
}
// 2.15.4举报接口
export function putReport(params,token) {
    return myPost(params, 'myyule_put_report', '1.0',token)
}
//2.9.1 评论
export function getPutComment(params,token) {
    return myPost(params, 'myyule_put_comment', '1.0',token)
}
//3.9.4 点赞 （resId：'',resType：'',mobile：''）
export function putThumb(params,token) {
    return myPost(params, 'myyule_put_thumb', '1.0',token)
}

//3.9.5 取消点赞  （resId：'',resType：'',mobile：''）
export function deleteThumb(params,token) {
    return myPost(params, 'myyule_delete_thumb', '1.0',token)
}
// 2.11.62.11.7删除话题
export function deleteTopic(params,token) {
    return myPost(params, 'myyule_delete_topic', '1.0',token)
}


