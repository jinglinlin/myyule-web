<template>
    <div class="featureList" :style="{paddingTop:source==='iOS'?62:20+'px'}" @viewappear="miniShow"  @viewdisappear="miniHidder">
      <!--加载器-->
  	  <wxc-loading :show="isShow"></wxc-loading>
      <!--专辑头部-->
      <div class="header row">
	      <text class="iconfont re_icon"  @click="pop()">&#xe625;</text>
	      <text v-if="this.type==='collect'" class="h-title">收藏</text>
	      <text v-if="this.type==='down'" class="h-title">下载</text>
	      <text v-if="this.type==='nearly'" class="h-title">最近播放</text>
	      <div class="option row">
		      <!-- <text class="iconfont add_icon mgRt30">&#xe6a9;</text> -->
		      <!-- <text class="iconfont msc_icon">&#xe603;</text> -->
		      <text class="iconfont add_icon mgRt30" @click="addAllSong()">&#xe81a;</text>
		      <!-- <text class="iconfont msc_icon" @click="share()">&#xe624;</text> -->
	      </div>
      </div>
      <scroller class="rankingBox"  @loadmore="fetchPage" loadmoreoffset="600">
        <!--专辑列表-->
        <div>
          <div class="rankingOpt">
            <div @click="playDailySong(rankingList)" class="listen row">
              <text class="iconfont grayIcon">{{playStatus==1?'&#xe629;':'&#xe626;'}}</text>
              <text class="listenNum opt-txt">全部播放</text>
            </div>
            <div class="listen row">
              <!-- <div class="listen row"  @click="addMusicClose()">
                <text class="iconfont grayIcon">&#xe63c;</text>
                <text class="listenNum opt-txt" >下载</text>
              </div>
              <div class="listen row" @click="chkbox">
                <text class="iconfont grayIcon1" :class="[active]">&#xe628;</text>
                <text class="listenNum opt-txt" :class="[active]" >多选</text>
              </div> -->
            </div>
          </div>
        </div>
          <div class="rankings">
            <div class="rankingLists">
              <div class="rankingLi" v-for="(item,index) in rankingList" :key="index">
                 <div class="leftLi row">
                   <wxc-checkbox class="checkbox" v-if='showBox' :checked="item.checked" @wxcCheckBoxItemChecked="wxcCheckBoxItemChecked()" title=""></wxc-checkbox>
                   <div class="sort">
                     <text class="sortNum">{{index+1}}</text>
                   </div>
                    <div class="pic" @click="playDailySong([item.feedData?item.feedData:item])">
                      <image class="mscPic" :src="url+(item.feedData?item.feedData.logo:item.logo)"  placeholder="http://media2.myyule.cn/group1/M00/0D/1C/wKgB2ltYOj-AGj5hAACM-0yh7-U134.jpg"></image>
                    </div>
                    <div class="singInfo">
                      <div class="row">
                        <text class="singTitle">{{item.feedData?item.feedData.title:item.title}}</text>
                      </div>
                     <text class="singName">{{item.feedData?item.feedData.nickName:item.nickName}}</text>
                   </div>
                 </div>
                 <text class="more" v-if='showChkbox' @click="moreOpt(item.feedData?item.feedData:item)">...</text>
              </div>
            </div>
          </div>
      </scroller>
      <!--更多操作-->
        <wxc-popup popup-color="#fff"
               :show="isBottomShow"
               @wxcPopupOverlayClicked="popupOverlayBottomClick"
               pos="bottom"
               height="336">
        <div class="demo-content">
          <div class="botMoreOpt col" ref="botMoreOptBg" >
	        <div class="optItems col">
	           <text class="optDesc" @click="addMusicClose()">添加歌单</text>
	           <!-- <text class="optDesc" @click="addMusicClose(itemObj)">下载</text> -->
	           <text class="optDesc" @click="shareClose">分享</text>
	        </div>
	        <text class="optDesc" @click="close">取消</text>
	      </div>
        </div>
        </wxc-popup>
    </div>
</template>

<script>
import { putCollect, deleteCollect } from "../../../api/urlDate";
import { getCollection } from "../../../api/music";
import { WxcCheckbox, WxcLoading, WxcPopup } from "weex-ui";
import mixins from "../../../mixins";
import {
  addAllSong,
  playSingleSong,
  playDailySong,
  addSongLst,
  openPlayer,
  stopMusic,
  playStatus,
  sharePage,
  downSingleSong,
  downSongLst,
  getDowloadMusicList,
  getHistoryPlayMusicList
} from "../../../api/weex";
var storage = weex.requireModule("storage");
const navigator = weex.requireModule("navigator");
const animation = weex.requireModule("animation");
const modal = weex.requireModule("modal");
var stream = weex.requireModule("stream");
export default {
  mixins: [mixins],
  components: {
    WxcCheckbox,
    WxcLoading,
    WxcPopup
  },
  data() {
    return {
      pageNo: 1,
      itemObj: {},
      showChkbox: true,
      playStatus: 0,
      active: "",
      headerShow: true,
      isShow: false,
      showBox: false,
      isBottomShow: false,
      resId: "",
      type: "",
      url: "http://media2.myyule.cn/",
      imgbg:
        "https://gw.alicdn.com/imgextra/i2/1904229646/TB2dRg4dgoQMeJjy0FpXXcTxpXa_!!1904229646-2-daren.png_250x250.jpg",
      album: {},
      rankingList: []
    };
  },
  beforeCreate() {
    this.fontIcon();
  },
  created() {
      if (this.webParam()) {
          this.type = this.webParam().type;
          if(this.webParam().mobile=== "undefined" ||this.webParam().mobile === ""){
              this.request();
          }else{
              this.mobile = this.webParam().mobile;
              // 获取全部部落
              this.request();
          }
      } else {
          storage.getItem("data", event => {
              this.type = JSON.parse(event.data).type;
          });
          //获取mobile
          storage.getItem("mobile", event => {
              if (event.data === "undefined" || event.data === "") {
                  // 获取专辑列表和详情
                  this.request();
              } else {
                  this.mobile = event.data;
                  // 获取专辑列表和详情
                  this.request();
              }
          });
      }

    var domModule = weex.requireModule("dom");
  },
  mounted(){
    // 数据埋点
    this.putPageUrlLog(1308);
    },
  methods: {
    request() {
      this.albumSongs();
    },
    //加入播放列表
    addMusicClose() {
      addSongLst(this.itemObj);
      this.isBottomShow = false;
      openPlayer("musicList");
    },
    //分享单曲
    shareClose() {
      let sObj = {
        title: "分享歌曲：" + this.itemObj.title,
        desc: "歌曲简介" + this.itemObj.nickName,
        web_url: "http://www.myyule.com/app/down",
        img_url: this.itemObj.logo,
        sourse: "myyule"
      };
      sharePage(sObj);
      this.isBottomShow = false;
    },
    // 打开播放器
    open() {
      openPlayer("player");
    },
    // 暂停播放
    stopM() {
      stopMusic();
    },
    //添加到播放列表
    addAllSong() {
      let array = [];
      this.rankingList.forEach(value => {
        let item = {
          createTime: value.createTime,
          logo: value.logo,
          money: value.money,
          nickName: value.songer,
          resId: value.songId,
          resType: value.type,
          tag: value.style,
          title: value.title,
          userId: value.userId,
          mobile: value.mobile,
          isCollect: value.isCollect
        };
        array.push(item);
      });
      addAllSong(array);
    },
    // 获取播放状态
    getPlayerStatus() {
      this.playStatus = playStatus();
    },
    // 打开播放列表
    openPlayLst() {
      openPlayer("musicList");
    },
    // 播放音乐列表
    playDailySong(list) {
      if (this.playStatus == 0) {
        // this.playStatus = 1;
        playDailySong(list);
      } else {
        this.playStatus = 0;
        stopMusic();
      }
      this.open();
    },
    //获取歌曲
    albumSongs() {
      this.isShow = true;
      if (this.type === "collect") {
        //获取收藏下歌曲
        getCollection(
          {
            pageNo: this.pageNo,
            pageSize: 10,
            mobile: this.mobile,
            resType: "song" //'746'//
          },
          { token: this.mobile }
        )
          .then(res => {
            if (res.status == 0) {
              this.isShow = false;
              this.rankingList =
                this.pageNo > 1
                  ? this.rankingList.concat(res.object)
                  : res.object;
              // modal.alert({message:JSON.stringify(this.rankingList[0])})
              const resData = [];
              this.rankingList.forEach(value => {
                // modal.alert({message:JSON.stringify(value)})
                let arr = value.feedData;
                arr.userId = value.userId;
                arr.resType = value.resType;
                arr.resId = value.resId;
                arr.descn = value.descn;
                arr.createTime = value.createTime;
                arr.isCollect = value.isCollect;
                arr.mobile = value.mobile;
                resData.push(arr);
              });
              this.rankingList = resData;
              // modal.alert({message:JSON.stringify(this.rankingList[0])})
            } else {
              console.log(res.desc);
            }
          })
          .catch();
      } else if (this.type === "down") {
        // 获取下载歌曲
        this.rankingList = getDowloadMusicList();
        this.isShow = false;
      } else if (this.type === "nearly") {
        this.rankingList = getHistoryPlayMusicList();
        this.isShow = false;
      }
    },
    // 加载下一页
    fetchPage() {
      if (!this.isShow) {
        this.pageNo += 1;
        this.albumSongs();
      }
    },
    // 选中
    wxcCheckBoxItemChecked(e) {
      console.log(e.checked);
    },
    /* listScroll(){
    	this.headerShow=false;
    },*/
    //收藏
    collect(item) {
      this.isShow = true;
      putCollect(
        {
          resId: this.resId, //点赞评论的话resId为留言id
          resType: this.resType, //点赞评论的话类型为comment
          mobile: this.mobile
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            item.isCollect = 1;
            item.collectSum += 1;
            console.log("收藏成功!");
          } else {
            this.isShow = false;
            console.log("收藏失败," + res.desc);
          }
        })
        .catch();
    },
    //取消收藏
    cancelCollect(item) {
      this.isShow = true;
      deleteCollect(
        {
          resId: this.resId, //点赞评论的话resId为留言id
          resType: this.resType, //点赞评论的话类型为comment
          mobile: this.mobile
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            item.isCollect = 0;
            item.collectSum -= 1;
            console.log("取消收藏成功!");
          } else {
            this.isShow = false;
            console.log("取消收藏失败," + res.desc);
          }
        })
        .catch();
    },
    chkbox() {
      this.showBox = !this.showBox;
      this.showChkbox = !this.showChkbox;
      //this.$refs.lists1.chkbox();
      if (this.active == "") {
        this.active = "on";
      } else {
        this.active = "";
      }
    },
    moreOpt(obj) {
      this.itemObj = obj;
      this.isBottomShow = true;
    },
    popupOverlayBottomClick() {
      this.isBottomShow = false;
    },
    close() {
      this.isBottomShow = false;
    }
  }
};
</script>

<style scoped>
.featureList {
  background-color: #fff;
}
.row {
  flex-direction: row;
}
.center {
  justify-content: center;
  align-items: center;
}
.mgRt30 {
  margin-right: 30px;
}
.mgTp25 {
  margin-top: 25px;
}
.iconfont {
  font-family: iconfont;
}
/*头部 开始*/
.header {
  height: 100px;
  padding-left: 30px;
  padding-right: 30px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ccc;
  justify-content: center;
  align-items: center;
}
.h-title {
  font-weight: bold;
  line-height: 100px;
  font-size: 36px;
}
.re_icon {
  color: #ee1c41;
  font-size: 45px;
  font-weight: bold;
  position: absolute;
  left: 20px;
  top: 25px;
}
.option {
  position: absolute;
  right: 20px;
  top: 25px;
}
.add_icon {
  color: #ee1c41;
  font-size: 54px;
  font-weight: bold;
}
.msc_icon {
  color: #ee1c41;
  font-size: 48px;
  font-weight: bold;
}
/*头部 结束*/

/*专辑上部 开始*/
.rankingBox {
  width: 750px;
  height: 1200px;
}
.desc {
  color: #000;
}
/*专辑上部 结束*/

/*列表操作*/
.rankingOpt {
  width: 750px;
  height: 120px;
  padding-top: 32px;
  padding-left: 20px;
  padding-right: 10px;
  padding-bottom: 32px;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #ccc;
  flex-direction: row;
  justify-content: space-between;
  background-color: #fff;
  align-items: center;
}
.sing-wrapper {
  width: 200px;
}
.listen {
  align-items: center;
}
.optIcon {
  width: 40px;
  height: 40px;
}
.grayIcon {
  margin-right: 10px;
  color: #666;
  font-size: 55px;
}
.grayIcon1 {
  margin-right: 10px;
  color: #666;
  font-size: 45px;
}
.opt-txt {
  color: #666;
  font-size: 26px;
  margin-left: 18px;
  margin-right: 25px;
}
.rankingLists {
  padding-bottom: 120px;
}
.rankingLi {
  position: relative;
  height: 169px;
  /* margin-left:90px;*/
  padding-right: 34px;
  padding-top: 30px;
  padding-bottom: 30px;
  background-color: #fff;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #ccc;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.sort {
  align-items: center;
}
.sortNum {
  /*position:absolute;
    top:-30px;
    left:-90px;*/
  color: #666;
  font-weight: bold;
  font-size: 48px;
  margin-left: 15px;
  margin-right: 15px;
  width: 100px;
  text-align: center;
}
.sortMark {
  color: #ee1c41;
  font-size: 24px;
}
.leftLi {
  align-items: center;
}
.checkbox {
  border-bottom-width: 0px;
}
.pic {
  position: relative;
  width: 109px;
  height: 109px;
  margin-right: 10px;
}
.mscPic {
  width: 109px;
  height: 109px;
  border-radius: 55px;
  border-width: 1px;
  border-color: #ececec;
  border-style: solid;
}
.singInfo {
  margin-right: 6px;
}
.singTitle {
    width: 300px;
  lines: 1;
  text-overflow: ellipsis;
  font-size: 28px;
  margin-top: 10px;
  color: #3b3b3b;
}
.sign {
  width: 76px;
  height: 42px;
  line-height: 42px;
  background-color: #fff;
  color: #ee1c41;
  font-size: 22px;
  border-style: solid;
  border-width: 1px;
  border-color: #ee1c41;
  border-radius: 10px;
  text-align: center;
  margin-left: 54px;
}
.singName {
  font-size: 28px;
  margin-top: 10px;
  color: #666;
}
.more {
  color: #000;
  font-size: 50px;
  padding-top: 12px;
}
/*底部浮层开始*/
.bot_play {
  position: fixed;
  bottom: 0px;
  left: 0;
  width: 750px;
  height: 120px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-top-width: 2px;
  border-top-style: solid;
  border-top-color: #ccc;
  background-color: #fff;
}
.mscBg {
  width: 110px;
  height: 110px;
  border-radius: 55px;
  margin-right: 10px;
  border-width: 1px;
  border-style: solid;
  border-color: #ececec;
}
.singTitle {
  font-size: 28px;
  margin-top: 10px;
}
.singName {
  font-size: 28px;
  margin-top: 10px;
  color: #ccc;
}
.playBg {
  width: 80px;
  height: 80px;
  border-radius: 40px;
  margin-right: 10px;
}
/*底部浮层结束*/
/*菜单开始*/
.tabbar {
  flex-direction: row;
  background-color: #fff;
}
.tab {
  height: 120px;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  border-bottom-width: 5px;
  border-bottom-style: solid;
  border-bottom-color: #fff;
}
.flex2 {
  display: flex;
  flex: 2;
}
.title {
  font-size: 30px;
  margin-top: 10px;
  padding-bottom: 5px;
}
/*菜单结束*/
/*弹层*/
.botMoreOpt {
  width: 750px;
}
.optItems {
  margin-bottom: 10px;
}
.optDesc {
  text-align: center;
  line-height: 112px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ccc;
  background-color: #fff;
}
/*弹层*/
.on {
  color: #ee1c41;
}
</style>