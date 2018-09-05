import { myPost } from './index'

// 查询小动态资源
export function getActive_List(params,token) {
    return myPost(params, 'myyule_get_message_dynamics', '1.0',token)
}
// 2.15.4举报接口
export function putReport(params,token) {
    return myPost(params, 'myyule_put_report', '1.0',token)
}
