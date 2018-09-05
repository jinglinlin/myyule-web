import { myPost } from './index'

// 2.1.2查询发行首页资源
export function getMusicIndex(params,token) {
    return myPost(params, 'myyule_get_music_index', '1.0',token)
}
// 2.9.7查看用户收藏
export function getCollection(params,token) {
    return myPost(params, 'myyule_get_collection', '1.0',token)
}
// 2.6.1 获取MV列表(查询MV列表)
export function getMVList(params,token) {
  return myPost(params, 'myyule_get_video', '1.0',token)
}