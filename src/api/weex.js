const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");
const myyuleAccount = weex.requireModule('MyyuleAccount')
const myyulePlayer = weex.requireModule('MyyulePlayer')
const myyuleSet = weex.requireModule('MyyuleSet')
const myyuleSurface = weex.requireModule('MyyuleSurface')
const myyuleUtils = weex.requireModule('MyyuleUtils')
const yxLocationModal = weex.requireModule('YXEvent')
const MyyuleUtils = weex.requireModule('MyyuleUtils')
const yxShareModal = weex.requireModule('YXShare') //分享
const yxDeviceModule = weex.requireModule('YXDevice')
const myyulePhoto = weex.requireModule('MyyulePhotoAlbum');//打开相册
const myyuleMap = weex.requireModule('MyyuleLocation');//打开地图
const myyulePlayerModule = weex.requireModule('MyyulePlayer');
const yxAccountModule = weex.requireModule('YXAccount');

// 获取客户端版本信息

export function getAccount() {
  return yxAccountModule?yxAccountModule.getAppInfo():'';
}
// 查询用户信息
export function getUser() {
  return myyuleAccount?myyuleAccount.getUserInfo():''
}
// 跳转url
export function getUrl(url) {
  return myyuleAccount.getUrl(url)
}
// 播放音乐列表
export function playDailySong(songList) {
  let array = []
  songList.forEach(value => {
    let item = {
      createTime: value.createTime,
      logo: value.logo,
      money: value.money,
      nickName: value.nickName ? value.nickName : value.songer,
      resId: value.resId ? value.resId : value.songId,
      resType: value.resType ? value.resType : value.type,
      tag: value.tag ? value.tag : value.style,
      title: value.title,
      descn:value.descn,
      isCollect:value.isCollect,
      userId: value.userId,
      mobile:value.mobile
    };
    array.push(item);
  });
  const res = myyulePlayer.playMusic(array);
}
//播放音乐列表(排行榜)
export function playRangkingSong(songList) {
  let array = []
  songList.forEach(value => {
    let item = {
      createTime: value.rankData.createTime,
      logo: value.rankData.logo,
      money: value.rankData.money,
      nickName: value.rankData.songer,
      resId: value.rankData.songId,
      resType: value.rankData.type,
      tag: value.rankData.style,
      title: value.rankData.title,
      descn:value.rankData.descn,
      userId: value.rankData.userId,
      mobile:value.rankData.mobile,
      isCollect:value.rankData.isCollect
    };
    array.push(item);
  });
  const res = myyulePlayer.playMusic(array);
}
// 单曲播放
export function playSingleSong(value) {
  let array = [];
  let item = {
    createTime: value.createTime,
    logo: value.logo,
    money: value.money,
    nickName: value.songer,
    resId: value.songId,
    resType: value.type,
    tag: value.style,
    title: value.title,
    descn:value.descn,
    userId: value.userId,
    mobile:value.mobile,
    isCollect:value.isCollect
  };
  array.push(item);
  const res = myyulePlayer.playMusic(array);
}
// 加入播放列表
export function addSongLst(value) {
  let array = []
  let item = {
    createTime: value.createTime,
    logo: value.logo,
    money: value.money,
    nickName: value.nickName ? value.nickName : value.songer,
    resId: value.resId ? value.resId : value.songId,
    resType: value.resType ? value.resType : value.type,
    tag: value.tag ? value.tag : value.style,
    title: value.title,
    descn:value.descn,
    userId: value.userId,
    mobile:value.mobile,
    isCollect:value.isCollect
  };
  array.push(item);
  const res = myyulePlayer.addPlayList(array);
}
// 列表下载(加入播放列表）
export function downSongLst(songList) {
  let array = []
  songList.forEach(value => {
    let item = {
      createTime: value.createTime,
      logo: value.logo,
      money: value.money,
      nickName: value.songer,
      resId: value.songId,
      resType: value.type,
      tag: value.style,
      descn:value.descn,
      title: value.title,
      userId: value.userId,
      mobile:value.mobile,
      isCollect:value.isCollect
    };
    array.push(item);
  });
  const res = myyulePlayer.addPlayList(array);
}
export function downAllSongLst(list) {
  let array = []
  list.forEach(value => {
    let item = {
      createTime: value.rankData.createTime,
      logo: value.rankData.logo,
      money: value.rankData.money,
      nickName: value.rankData.songer,
      resId: value.rankData.songId,
      resType: value.rankData.type,
      tag: value.rankData.style,
      title: value.rankData.title,
      userId: value.rankData.userId,
      mobile:value.rankData.mobile,
      isCollect:value.rankData.isCollect
    };
    array.push(item);
  });
  const res = myyulePlayer.addPlayList(array);
}
//添加到播放列表 （提示）
export function addAllSong(array) {
  const status = myyulePlayer.addPlayList(array).status;
  if (status == 1) {
    modal.toast({
      message: '已全部添加到播放列表',
      duration: 1
    });
  } else {
    modal.toast({
      message: '添加失败',
      duration: 1
    });
  }
}
// 单曲下载(加入播放列表）
export function downSingleSong(value) {
  let array = []
  let item = {
    createTime: value.createTime,
    logo: value.logo,
    money: value.money,
    nickName: value.songer,
    resId: value.songId,
    resType: value.type,
    tag: value.style,
    title: value.title,
    descn:value.descn,
    userId: value.userId,
    mobile:value.mobile
  };
  array.push(item);
  const res = myyulePlayer.addPlayList(array);
}
// 暂停音乐
export function stopMusic() {
  myyulePlayer.stopMusic();
}
// 上一曲
export function prevMusic() {
  myyulePlayer.lastMusic();
}
// 下一曲
export function nextMusic() {
  myyulePlayer.nextMusic();
}
// 播放音乐
export function startMusic() {
  myyulePlayer.startMusic();
}

//查询播放状态  status: 1：播放中，0：未播放
export function playStatus() {
  return myyulePlayer.getPlayerStatus().status
}
// 打开播放器
export function openPlayer(param) {
  // modal.alert({
  //   message: param,
  //   duration: 1
  // })
  const res = myyulePlayer.openPlayer({
    show: param
  });
}
// 2.1.1.10播放视频
export function playVideo(path) {
  myyulePlayer.playVideoForUrl('http://media2.myyule.cn/' + path);
}
// 清除缓存
export function cleanAppCacheCallBack() {
  myyuleSet.cleanAppCacheCallBack(function (ret) {
    if (ret.status == 1) {
      modal.alert({
        message: '清除成功',
        duration: 1
      });
    } else {
      modal.alert({
        message: '清除失败',
        duration: 1
      });
    }
  })
}
// 2.1.4.3通知开关状态(是否开启勿扰模式)
export function setNotice(params) {
  const status = myyuleSet.setNotice({
    model: params
  });
  // modal.toast({message:status.model})
  return status.model
}
// 2.1.5.1打开应用中心
export function openAppCenter() {
  const status = myyuleSurface.openAppCenter();
}
// 2.1.5.3打开登陆界面
export function toLogin(param) {
  const status = myyuleSurface.toLogin(param);
}
// 2.1.5.2打开聊天界面
export function openChat(params) {
  const status = myyuleSurface.openChat(params);
}
//2.1.3.1 分享
export function toShare(value) {
  /*let item = {
      title: value.title,
      desc:value.desc,
      url:value.url,
    };
  const res =myyuleUtils.share(item);*/
}
//2.1.3.2 输入表情 
export function openEmjoy() {
  const res = myyuleUtils.openEmjoy();
}
// 跳转webView
export function startNewWebView(obj) {
  // modal.alert({
  //   message: url,
  //   duration: 1
  // })
  yxLocationModal.openWebUrl(obj)
}
// 跳转weex
export function startNewWEeexView(url) {
  // modal.alert({
  //   message: url,
  //   duration: 1
  // })
  MyyuleUtils.openWeexUrl({url:url},function(ret) {})
  // yxLocationModal.openWeexUrl(url)
}
// 获取下载歌曲列表
export function getDowloadMusicList() {
  const data = myyulePlayer.queryDowloadMusicList()
  // modal.alert({
  //   message: JSON.stringify(data),
  //   duration: 1
  // })
  return data
}
// 获取最近播放歌曲列表
export function getHistoryPlayMusicList() {
  const data = myyulePlayer.queryHistoryPlayMusicList()
  // modal.alert({
  //   message: JSON.stringify(data[0]),
  //   duration: 1
  // })
  return data
}
//分享操作
export function sharePage(obj) {
  const data = yxShareModal.showShareMenu(obj)
  return data;
}
//2.1.6.1打开相册
export function openPhoto(maxNum) {
  const data = myyulePhoto.showAlbumViewByMaxNum(maxNum,function(ret) {})
}
//2.1.7.1打开地图
export function  openMap(obj) {
  const data = myyuleMap.openMap(obj,function(ret) {})
}
//扫一扫
export function scan() {
  yxDeviceModule.openScan(function (ret) {
      //modal.alert({message:ret.content})
      if (ret.status == "1") {
         yxLocationModal.openWebUrl({"url":ret.content,"hideTitle":"1"})
         //startNewWebView({url:ret.content});
      } 
  })
   
}
// 2.1.1.12显示/隐藏迷你播放器
export function setMiniPlayerHidden(params) {
 const res = myyulePlayerModule.setMiniPlayerHidden ({hidden:params},function(ret) {})

}