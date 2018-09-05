<template>
    <div class="featureList" @viewappear="miniShow"  @viewdisappear="miniHidder">
      <!--加载器-->
  	  <wxc-loading :show="isShow"></wxc-loading>

      <!--专辑上部-->
      <div class="feature_top">
          <image class="featrueBg" :src="imgbg"></image>
          <!--专辑头部-->
	      <div class="header row">
		      <text class="iconfont re_icon" v-if="!webVersion" @click="pop()">&#xe625;</text>
		      <text class="h-title">{{album.title}}</text>
		      <div class="option row" v-if="!webVersion">
			      <text class="iconfont add_icon mgRt30"  @click="addAllSong()">&#xe81a;</text>
			      <text class="iconfont msc_icon" @click="share()">&#xe624;</text>
		      </div>
	      </div>
          <div class="featrueInfo row">
           <image class="featrueImg" :src="url+album.logo" @click="push2('/views/myPlace/myPlace', { mobile: album.mobile })"></image>
           <div class="featrueDesc">
             <text class="desc desc1">{{album.title}}</text>
             <text class="desc desc2 mgTp12">{{album.nickName}}></text>
               <div class="info-msg">
                   <scroller class="scroller">
                        <text  class="desc desc3 mgTp12">{{intro}}</text>
                   </scroller>
               </div>
           </div>
          </div>
          <div class="featureOpt row" v-if="!webVersion">
            <div class="center row">
               <text class="iconfont listenIcon">&#xe678;</text>
               <text class="videoNum">{{album.playSum}}</text>
            </div>
            <div class="center row" @click="push2('/views/home/lookMore/featureComment',{resId:album.albumId,resType:'songAlbum',title:album.title,nickName:album.nickName,logo:album.logo,comNum:album.commentSum})">
               <text class="iconfont commentIcon">&#xe631;</text>
               <text class="videoNum">{{album.commentSum}}</text>
            </div>
            <div class="center row">
               <text class="iconfont noCollectIcon" v-if='album.isCollect==0' @click='collect(album)'>&#xe627;</text>
               <text class="iconfont collectIcon" v-if='album.isCollect==1'@click='cancelCollect(album)'>&#xe636;</text>
               <text class="videoNum">{{album.collectSum}}</text>
            </div>
          </div>
        </div>
      <download-notice></download-notice>
      <list class="rankingBox"  @loadmore="fetchPage" loadmoreoffset="600">
        <!--专辑列表-->
		  <header v-if="!webVersion">
			<div class="rankingOpt">
			  <div class="listen row"@click="addSongLstPlay()">
				<text class="iconfont grayIcon">&#xe626;</text>
				<text class="listenNum opt-txt">全部播放</text>
			  </div>
			  <div class="listen row">
				<div class="listen row"  @click="downloadLst()">
				  <text class="iconfont grayIcon">&#xe63c;</text>
				  <text class="listenNum opt-txt" >下载</text>
				</div>
				<div class="listen row" @click="chkbox">
				  <text class="iconfont grayIcon1":class="[active]">&#xe628;</text>
				  <text class="listenNum opt-txt":class="[active]" >多选</text>
				</div>
			  </div>
			</div>
		  </header>
          <cell class="rankings" v-for="(item,index) in rankingList">
            <div class="rankingLists">
              <div class="rankingLi"  @click="singlePlay(item)">
                 <div class="leftLi row">
                   <wxc-checkbox class="checkbox" v-if='showBox' @wxcCheckBoxItemChecked="sel(item)"></wxc-checkbox>
                   <div class="sort">
                     <text class="sortNum">{{index+1}}</text>
                   </div>
                    <div class="pic">
                      <image class="mscPic" :src="url+item.logo"></image>
                    </div>
                    <div class="singInfo">
                      <div class="row">
                        <text class="singTitle">{{item.title}}</text>
                      </div>
                     <text class="singName">{{item.nickName}}</text>
                   </div>
                 </div>
                 <text class="more" v-if='showChkbox'@click="moreOpt(item)">...</text>
              </div>
            </div>
          </cell>
      </list>
      <!--更多操作-->
        <wxc-popup popup-color="#fff"
               :show="isBottomShow"
               @wxcPopupOverlayClicked="popupOverlayBottomClick"
               pos="bottom"
               height="454">
        <div class="demo-content">
          <div class="botMoreOpt col" ref="botMoreOptBg" >
	        <div class="optItems col">
	           <text class="optDesc"@click="addMusicClose">添加歌单</text>
	           <text class="optDesc"@click="downClose">下载</text>
	           <text class="optDesc"@click="shareClose">分享</text>
	        </div>
	        <text class="optDesc" @click="close">取消</text>
	      </div>
        </div>
        </wxc-popup>
    </div>
</template>

<script>
import {
  getAlbumInfo,
  getAlbumSongs,
  putCollect,
  deleteCollect
} from "../../../api/urlDate";
import downloadNotice from "../../../components/downloadNotice.vue";
import { WxcCheckbox, WxcLoading, WxcPopup, Utils } from "weex-ui";
import mixins from "../../../mixins";
import {
  sharePage,
  playSingleSong,
  playDailySong,
  addSongLst,
  addAllSong,
  openPlayer,
  startMusic,
  stopMusic,
  prevMusic,
  nextMusic,
  playStatus,
  toShare,
  downSingleSong,
  downSongLst,
  setMiniPlayerHidden
} from "../../../api/weex";
import { base64Decode } from "../../../utils/base64Util";
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
    WxcPopup,
    downloadNotice
  },
  data() {
    return {
      shareObj: {},
      checkedList: [],
      itemObj: {},
      showChkbox: true,
      active: "",
      headerShow: true,
      isShow: false,
      showBox: false,
      isBottomShow: false,
      resId: "",
      resType: "",
      url: "http://media2.myyule.cn/",
      imgbg: "http://wap.myyule.teamshub.com/web-icon/music-bg.png",
      album: {},
      intro: "",
      tempIntro: "",
      rankingList: [],
      infoKey: false
    };
  },
  beforeCreate() {
      var domModule = weex.requireModule("dom");
      if (this.versionControl === 'official') {
          domModule.addRule("fontFace", {
              fontFamily: "iconfont",
              src: "url('https://myyule.teamshub.com/web-icon/font/font_580422_62vodh0mkakyb9.ttf')"
          });
      } else {
          domModule.addRule("fontFace", {
              fontFamily: "iconfont",
              src: "url('https://testmyyule.teamshub.com/web-icon/font/font_580422_62vodh0mkakyb9.ttf')"
          });
      }
  },
  created() {
      if(this.webParam()){
          this.resId=this.webParam().resId;
          this.resType=this.webParam().resType;
          this.albumInfo();
          this.albumSongs();
      }else{
          storage.getItem("data", event => {
              this.resId = JSON.parse(event.data).resId;
              this.resType = JSON.parse(event.data).resType;
              // 获取专辑列表和详情
              this.albumInfo();
              this.albumSongs();
          });
      }
  },
  mounted() {
    // 数据埋点
    if (this.webVersion) {
      this.putPageUrlLog(1804);
    } else {
      this.putPageUrlLog(1303);
    }
  },
  methods: {
    //加入播放列表
    addMusicClose() {
      addSongLst(this.itemObj);
      this.isBottomShow = false;
      // 显示min播放器
      this.miniShow();
    },
    //下载单曲
    downClose() {
      downSingleSong(this.itemObj);
      this.openPlayLst();
      this.isBottomShow = false;
      // 显示min播放器
      this.miniShow();
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
    //分享单曲
    shareClose() {
      let _this = this;
      let sObj = {
        title: _this.itemObj.title,
        desc: _this.itemObj.nickName,
        web_url:
          "http://mp.myyule.teamshub.com//song/" +
          _this.itemObj.songId +
          "?from=singlemessage&isappinstalled=0",
        img_url: _this.url + _this.itemObj.logo,
        sourse: "myyule"
      };
      sharePage(sObj);
      _this.isBottomShow = false;
      // 显示min播放器
      this.miniShow();
    },
    //单曲播放
    singlePlay(item) {
      playSingleSong(item);
    },
    // 打开播放器
    open() {
      openPlayer("player");
    },
    // 暂停播放
    stopM() {
      stopMusic();
    },
    //播放歌曲
    startM() {
      startMusic();
    },
    // 上一曲
    prevM() {
      prevMusic();
    },
    // 下一曲
    nextM() {
      nextMusic();
    },
    // 查询播放状态
    /*playSongStatus(){
		playStatus().then(status => {
			  //status: 1：播放中，0：未播放
        if (status == 0) {
        	this.startM() ;
        } else {
          this.stopM() ;
        }
      }).catch();
	},*/
    playSongStatus(num) {
      if (num == 0) {
        this.playStatus = 1;
        this.startM();
      } else {
        this.playStatus = 0;
        this.stopM();
      }
    },
    // 打开播放列表
    openPlayLst() {
      openPlayer("musicList");
    },
    //加入播放列表并播放
    addSongLstPlay() {
      if (this.checkedList.length > 0) {
        playDailySong(this.checkedList);
      } else {
        playDailySong(this.rankingList);
      }
      this.open();
    },
    //下载歌曲列表
    downloadLst() {
      if (this.checkedList.length > 0) {
        downSongLst(this.checkedList);
      } else {
        downSongLst(this.rankingList);
      }
      this.openPlayLst();
    },
    // 获取专辑详情
    albumInfo() {
      this.isShow = true;
      getAlbumInfo(
        {
          resId: this.resId //'746',
          // resId: '746',
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.album = res.object;
            this.intro =
              "专辑简介:" +
              this.album.descn.replace(/<.*?>/gi, "").replace(/\s/gi, "");
            this.tempIntro =
              "专辑简介:" +
              this.album.descn.replace(/<.*?>/gi, "").replace(/\s/gi, "");
            console.log(this.album);
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    //获取专辑下歌曲
    albumSongs() {
      this.isShow = true;
      getAlbumSongs(
        {
          albumStatus: 4,
          resId: this.resId //'746'//
          // resId: '746'//
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
              console.log(this.rankingList);

          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 加载下一页
    fetchPage() {
      if (!this.isShow) {
        this.pageNo += 1;
        this.albumSongs();
      }
    },
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
      this.checkedList = [];
    },
    // 复选框操作
    sel(obj) {
      console.log(this.checkedList.length);
      if (this.checkedList.length > 0) {
        for (var i = 0; i < this.checkedList.length; i++) {
          console.log(
            "array:" + this.checkedList[i].songId + "obj:" + obj.songId
          );
          if (this.checkedList[i].songId == obj.songId) {
            this.checkedList.splice(i, 1);
            break;
          } else {
            if (i == this.checkedList.length - 1) {
              this.checkedList.push(obj);
              break;
            }
          }
        }
      } else {
        this.checkedList.push(obj);
      }
      console.log(this.checkedList);
    },
    moreOpt(obj) {
      if (!this.webVersion) {
        //隐藏min播放器
        this.miniHidder();
        this.itemObj = obj;
        this.isBottomShow = true;
      } else {
        window.location.href = "http://www.myyule.com/app/down";
      }
    },
    popupOverlayBottomClick() {
      // 显示min播放器
      this.miniShow();
      this.isBottomShow = false;
    },
    close() {
      // 显示min播放器
      this.miniShow();
      this.isBottomShow = false;
    },
    share() {
      let _this = this;
      console.log(this.resId);
      let sObj = {
        title: _this.album.title,
        desc: _this.intro,
        web_url: _this.commonUrl+"myyuleWeb/webShare/featureList/index.html?resId="+_this.album.albumId,
        // web_url: "http://www.myyule.com/app/down",
        img_url: _this.url + _this.album.logo,
        sourse: "myyule"
      };
      sharePage(sObj);
    }
  }
};
</script>

<style scoped>
.featureList {
  flex: 1;
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
.mgTp12 {
  margin-top: 10px;
}
.iconfont {
  font-family: iconfont;
}
/*头部 开始*/
.header {
  height: 100px;
  margin-top: 20px;
  margin-bottom: 20px;
  padding-left: 30px;
  padding-right: 30px;
  justify-content: center;
  align-items: center;
}
.h-title {
  line-height: 100px;
  font-weight: bold;
  font-size: 36px;
  color: #fff;
  lines: 1;
  width: 200px;
  text-align: center;
}
.re_icon {
  color: #fff;
  font-size: 40px;
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
  color: #fff;
  font-size: 50px;
}
.msc_icon {
  color: #fff;
  font-size: 45px;
  font-weight: bold;
}
/*头部 结束*/

/*专辑上部 开始*/
.rankingBox {
  width: 750px;
  /*  height: 800px; */
  padding-bottom: 30px;
}
.feature_top {
  position: relative;
  width: 750px;
  height: 440px;
  background-color: #ccc;
}
.featrueBg {
  position: absolute;
  top: 0;
  left: 0;
  width: 750px;
  height: 440px;
}
.featrueImg {
  width: 192px;
  height: 192px;
  margin-left: 40px;
  margin-right: 40px;
}
.featrueDesc {
  width: 440px;
}
.listenIcon {
  margin-right: 10px;
  color: #fff;
  font-size: 55px;
}
.commentIcon {
  margin-right: 10px;
  color: #fff;
  font-size: 55px;
}
.noCollectIcon {
  margin-right: 10px;
  color: #fff;
  font-size: 40px;
}
.collectIcon {
  margin-right: 10px;
  color: #ee1c41;
  font-size: 55px;
}
.desc {
  color: #fff;
}
.desc1 {
  font-size: 28px;
  lines: 1;
}
.desc2 {
  font-size: 28px;
  lines: 1;
}
.desc3 {
  font-size: 24px;
  /*  lines:3; */
  padding-top: -4.5px;
}
.featureOpt {
  margin-top: 20px;
  margin-bottom: 30px;
  justify-content: space-around;
}
.videoImg {
  width: 45px;
  height: 40px;
  margin-right: 10px;
}
.videoNum {
  line-height: 40px;
  font-size: 30px;
  color: #fff;
}
/*专辑上部 结束*/

/*列表操作*/
.rankingOpt {
  width: 750px;
  height: 120px;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #ccc;
  flex-direction: row;
  justify-content: space-between;
  background-color: #fff;
  align-items: center;
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
  /*padding-bottom:120px;*/
}
.rankingLi {
  position: relative;
  height: 169px;
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
  width: 200px;
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
  width: 200px;
  lines: 1;
  font-size: 28px;
  margin-top: 10px;
  color: #666;
}
.more {
  width: 83px;
  line-height: 169px;
  color: #000;
  font-size: 50px;
  padding-right: 34px;
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
/*.singTitle{
    font-size: 28px;
    margin-top: 10px;
  }
  .singName{
    font-size: 28px;
    margin-top: 10px;
    color:#ccc;
  }*/
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
  font-size: 30px;
}
/*弹层*/
.on {
  color: #ee1c41;
}

.scroller {
  height: 110px;
}
.downLoad {
  width: 750px;
  position: fixed;
}
</style>