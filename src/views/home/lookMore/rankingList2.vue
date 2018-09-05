<template>
	<div class="rankingBox" :class="webVersion?'topMargin':''" @viewappear="miniShow"  @viewdisappear="miniHidder">
		<!--加载器-->
  	    <wxc-loading :show="isShow"></wxc-loading>

		<!--排行榜头部-->
	    <div class="top">
	      	<image class="topBg"  :src="url+rankObj.rankBackImg"></image>
	        <div class="header center">
	          <text v-if="!webVersion" class="iconfont re_icon"  @click="pop()">&#xe625;</text>
	          <text v-if="!webVersion" class="iconfont share_icon" @click="share()">&#xe624;</text>
	        </div>
	        <text class="top-txt1">{{rankObj.rankName}}</text>
	        <div class="all-album-title" v-if="showAlbum">
	            <div @click="showToggle()" class="title-wrapper">
	              <text class="title-text iconfont">第{{albumTags === ''?'1':albumTags}}期 {{chkKey?'&#xe62c;':'&#xe62d;'}}</text>
	            </div>
	        </div>
	        <text class="top-txt2">更新于 {{modifyTime}}</text>
	        <!--统计听的数量和收藏的数量-->
	        <div class="statisticial" v-if="!webVersion">
              <text class="iconfont listenIcon">&#xe61e;</text>
              <text class="listenNum top-txt2"  @click="listenMsc">{{rankObj.viewNum}}</text>

	         </div>
	    </div>

		<list class="rankingListBox" :style="{paddingBottom:source==='iOS'?88:0 + 'px'}">
			<!--排行榜列表-->
			<header v-if="!webVersion">
				<div class="rankingOpt">
					<div class="listen row"  @click="addSongLstPlay()">
					  <text class="iconfont grayIcon">&#xe626;</text>
					  <text class="listenNum opt-txt">全部播放</text>
					</div>
					<div class="listen row">
					  <div class="listen row" @click="downloadLst()">
						  <text class="iconfont grayIcon">&#xe63c;</text>
						  <text class="listenNum opt-txt" >下载</text>
					  </div>
					  <div class="listen row" @click="chkbox">
						  <text class="iconfont grayIcon1":class="[active]">&#xe628;</text>
						  <text class="listenNum opt-txt" :class="[active]">多选</text>
					  </div>
					</div>
				</div>
			</header>
			<cell class="rankings" v-for="(item,index) in rankingList">
			  <div class="rankingLists">
				<div class="rankingLi"  @click="singlePlay(item.rankData)">
					<div class="leftLi row">
					<wxc-checkbox class="checkbox" v-if='showBox' title="" @wxcCheckBoxItemChecked="sel(item.rankData)"></wxc-checkbox>
					 <div class="sort">
					   <text class="sortNum">{{item.currentRank}}</text>
					   <text class="iconfont sortMark" v-if="item.rankingStatus==0"></text>
					   <text class="iconfont sortMark2"v-else-if="item.rankingStatus==1">&#xe648;</text>
					   <text class="iconfont sortMark3"v-else-if="item.rankingStatus==2">&#xe647;</text>
					   <text class="iconfont sortMark" v-else-if="item.rankingStatus==3">new</text>
					 </div>
					 <div class="singInfo">
						 <div class="pic">
							 <image class="mscPic" :src="url+item.rankData.logo"  placeholder="http://media2.myyule.cn/group1/M00/0D/1C/wKgB2ltYOj-AGj5hAACM-0yh7-U134.jpg"></image>
						 </div>
						 <div class="rows">
						  <text class="singTitle" v-if="item.rankData.title.length> 7">{{item.rankDataTitle}}</text>
                           <text class="singTitle" v-else>{{item.rankData.title}}</text>
							<text class="singName">{{item.rankData.nickName}}</text>
						</div>
					</div>
				   </div>
					<text class="sign"v-if="item.rankData.status==4">数发</text>
					<!--<text class="sign">数发</text>-->
					<text class="more" v-if='showChkbox'  @click="moreOpt(item.rankData)">...</text>
				</div>
			  </div>
			</cell>
		</list>
		<download-notice></download-notice>
		<!--更多操作-->
		<wxc-popup popup-color="#fff"
			   :show="isBottomShow"
			   @wxcPopupOverlayClicked="popupOverlayBottomClick"
			   pos="bottom"
			   height="454">
		<div class="demo-content">
		  <div class="botMoreOpt col" ref="botMoreOptBg" >
			<div class="optItems col">
			   <text class="optDesc" @click="addMusicClose">添加歌单</text>
			   <text class="optDesc" @click="downClose">下载</text>
			   <text class="optDesc" @click="shareClose">分享</text>
			</div>
			<text class="optDesc" @click="close">取消</text>
		  </div>
		</div>
		</wxc-popup>
		<list v-if="chkKey" class="select-tag">
      <header>
  		 <div class="selOpt">
  		  <text class='sel-btn' @click="cancel()">取消</text>
  		  <text class='sel-btn red' @click="confirm()">确定</text>
       </div>
		 </header>
		 <cell>
		   <text v-for="(item,index) in tagList" :class="['tag-item', 'btn-' + item.value]" @click="select(item)" :key="index">第{{item.journal}}期</text>
		 </cell>
		</list>
   </div>
</template>

<script>
import { WxcCheckbox, WxcLoading, WxcPopup, Utils } from "weex-ui";
import { getRankInfo, getRankJournal } from "../../../api/urlDate";
import mixins from "../../../mixins";
import downloadNotice from "../../../components/downloadNotice.vue";

import {
  sharePage,
  setMiniPlayerHidden,
  downSingleSong,
  downSongLst,
  downAllSongLst,
  addSongLst,
  playRangkingSong,
  playDailySong,
  playSingleSong,
  openPlayer,
  startMusic,
  stopMusic,
  prevMusic,
  nextMusic,
  playStatus
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
    WxcPopup,
    downloadNotice
  },
  data() {
    return {
      modifyTime: "",
      checkedList: [],
      playStatus: 0,
      itemObj: {},
      showChkbox: true,
      showAlbum: true,
      chkKey: false,
      albumTags: "",
      albumTagsTemp: "",
      active: "",
      showBox: false,
      isShow: false,
      isBottomShow: false,
      journal: "", //'2',
      journalNum: "",
      rankId: "", //'5a9fd76a5ca2532eed503a2e',
      rankObj: {},
      song: {},
      //mobile:'',
      url: "http://media2.myyule.cn/",
      topBg:
        "https://p.qpic.cn/music_cover/NYAbUf8h9VMn4bicLvia6f13y6h0zsP6xo8kcaiaV5OMrmwdaTRLibz9YQ/300?n=1",
      imgbg:
        "https://gw.alicdn.com/imgextra/i2/1904229646/TB2dRg4dgoQMeJjy0FpXXcTxpXa_!!1904229646-2-daren.png_250x250.jpg",
      rankingList: [],
      tagList: []
    };
  },
  mounted() {
      // 数据埋点
      if (this.webVersion) {
          this.putPageUrlLog(1805);
      } else {
          this.putPageUrlLog(1307);
      }
      if(this.webParam()){
          this.albumTags=this.webParam().journal;
          // this.journal=this.webParam().journal;
          this.rankId=this.webParam().rankId;
          this.rankInfo();
      }else{
          //获取排行榜期刊数和排行id
          storage.getItem("data", event => {
              this.albumTags = JSON.parse(event.data).journal;
              // this.journal = JSON.parse(event.data).journal;
              this.rankId = JSON.parse(event.data).rankId;
              // this.journal='52';
              // this.albumTags = '52';
              // this.rankId = '5a77fd349f64761fd0790dc2';
              this.rankInfo();
          });
          //获取mobile
          storage.getItem("mobile", event => {
              if (event.data === "undefined" || event.data === "") {
              } else {
                  this.mobile = event.data;
              }
          });
	  }
  },
  created() {
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
    //分享单曲
    shareClose() {
      let _this = this;
      // console.log(_this.itemObj)
      let sObj = {
      title: _this.itemObj.title,
      desc: _this.itemObj.nickName,
      web_url:
      "http://mp.myyule.teamshub.com//song/"+
      _this.itemObj.songId +
      "?from=singlemessage&isappinstalled=0",
        // web_url: "http://www.myyule.com/app/down",
        img_url: _this.url+_this.itemObj.logo,
        sourse: "分享"
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
        playRangkingSong(this.rankingList);
      }
      this.open();
    },
    //下载歌曲列表
    downloadLst() {
      if (this.checkedList.length > 0) {
        downSongLst(this.checkedList);
      } else {
        downAllSongLst(this.rankingList);
      }
      this.openPlayLst();
    },
    // 获取排行榜
    rankInfo() {
      this.isShow = true;
      getRankInfo(
        {
          journal: this.journal,
          rankId: this.rankId
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.rankObj = res.object;
            this.modifyTime = res.object.modifyTime.split(" ")[0];
            this.journalNum = res.object.journal;
            this.albumTags = res.object.journal;
            this.albumTagsTemp = res.object.journal;
            this.rankingList = res.object.rankList;

            for (let i = 0; i < this.rankingList.length; i++) {
              this.rankingList[i].rankDataTitle = "";
              if (this.rankingList[i].rankData.title.length > 7) {
                this.rankingList[i].rankDataTitle =
                  this.rankingList[i].rankData.title.substr(0, 6) + "...";
              }
            }
            this.song = this.rankingList[0];
            console.log(this.journalNum);
            this.rankJournal();
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 获取榜单期刊数
    rankJournal() {
      this.isShow = true;
      getRankJournal(
        {
          rankId: this.rankId //'5a9fd76a5ca2532eed503a2e'
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.tagList = res.object;
            this.tagList.forEach(value => {
              value.value = "0";
              if (this.albumTags == value.journal) {
                value.value = "1";
              } else {
                value.value = "0";
              }
            });
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },

    chkbox() {
      this.showBox = !this.showBox;
      this.showChkbox = !this.showChkbox;
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
        this.itemObj = obj;
        this.isBottomShow = true;
        //隐藏min播放器
        this.miniHidder();
      } else {
        window.location.href = "http://www.myyule.com/app/down";
      }
    },
    popupOverlayBottomClick() {
      this.isBottomShow = false;
      // 显示min播放器
      this.miniShow();
    },
    close() {
      this.isBottomShow = false;
      // 显示min播放器
      this.miniShow();
    },
    showToggle() {
      this.albumTagsTemp = this.albumTags;
      this.chkKey = !this.chkKey;

      if (this.chkKey) {
        //隐藏min播放器
        this.miniHidder();
      } else {
        // 显示min播放器
        this.miniShow();
      }
    },
    select(item) {
      this.albumTags = item.journal;
      this.journal = item.journal;
      this.tagList.forEach(value => {
        value.value = "0";
      });
      item.value = "1";
    },
    confirm() {
      this.chkKey = !this.chkKey;
      this.rankInfo();
      // 显示min播放器
      this.miniShow();
    },
    cancel() {
      this.albumTags = this.albumTagsTemp;
      this.chkKey = !this.chkKey;
      // 显示min播放器
      this.miniShow();
    },
    share() {
      let _this = this;
      let sObj = {
        title: "分享排行榜：" + _this.rankObj.rankName,
        desc: "",
        web_url: _this.commonUrl+"myyuleWeb/webShare/rankingList2/index.html?journal="+_this.rankObj.journal+'&rankId='+_this.rankObj.rankId,
        img_url: _this.url + _this.rankObj.rankCover,
        sourse: "myyule"
      };
      sharePage(sObj);
    }
  }
};
</script>

<style scoped>
.iconfont {
  font-family: iconfont;
}
.rankingBox {
  position: relative;
  background-color: #fff;
}
.row {
  flex-direction: row;
  justify-content: space-around;
}
.rows{
	/*flex-direction: row;*/
	/*justify-content: space-around;*/
}
/*头部开始 */
.top {
  width: 750px;
  height: 400px;
  justify-content: center;
  align-items: center;
}
.topMargin{
	padding-top: 108px;
}
.topBg {
  width: 750px;
  height: 400px;
  position: absolute;
  top: 0px;
  left: 0px;
}
.header {
  position: absolute;
  top: 50px;
  left: 0px;
  width: 750px;
  height: 100px;
  padding-left: 20px;
  padding-right: 20px;
  flex-direction: row;
  justify-content: space-between;
}
.re_icon {
  color: #fff;
  font-size: 40px;
  font-weight: bold;
}
.share_icon {
  color: #fff;
  font-size: 45px;
  font-weight: bold;
}
.top-txt1 {
  color: #fff;
  font-size: 34px;
  margin-top: 20px;
  margin-bottom: 34px;
}
.top-txt2 {
  color: #fff;
  font-size: 26px;
}
.statisticial {
  position: absolute;
  bottom: 22px;
  left: 0px;
  width: 750px;
  height: 60px;
  padding-left: 20px;
  padding-right: 20px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
/* .listen{
    align-items: center;
  }*/
.listenIcon {
  margin-right: 10px;
  color: #fff;
  font-size: 55px;
}
.collectIcon {
  margin-right: 10px;
  color: #ee1c41;
  font-size: 55px;
}
.grayIcon {
  color: #666;
  font-size: 55px;
}
.grayIcon1 {
  margin-left: 30px;
  color: #666;
  font-size: 45px;
}
/*头部结束*/
/*列表操作*/
.rankingListBox {
  width: 750px;
  /* height:1000px; */
}
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
.optIcon {
  width: 40px;
  height: 40px;
}
.opt-txt {
  color: #666;
  font-size: 32px;
  margin-left: 18px;
}
.rankingLists {
  padding-left: 20px;
	width: 750px;
  /*padding-bottom:120px;*/
}
.rankingLi {
  height: 169px;
  padding-left: 30px;
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
  margin-right: 15px;
	width:60px;
	justify-content: center;
	align-items: center;
}
.sortNum {
  color: #ee1c41;
  font-weight: bold;
  font-size: 48px;
}
.sortMark {
  color: #ee1c41;
  font-size: 24px;
}
.sortMark2 {
  color: #ee1c41;
  font-size: 24px;
}
.sortMark3 {
  color: #0059ff;
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
  border-radius: 54.5px;
}
.singInfo {
  /*margin-right: 6px;*/
	width: 320px;
	flex-direction: row;
	/*justify-content: c;*/
	align-items: center;
}
.singTitle {
  width: 200px;
  lines: 1;
  font-size: 28px;
  margin-top: 10px;
}
.singName {
  width: 200px;
  lines: 1;
  font-size: 28px;
  margin-top: 10px;
  color: #ccc;
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
.more {
  width: 83px;
  line-height: 169px;
  color: #000;
  font-size: 50px;
  padding-right: 34px;
}
/*底部浮层*/
.bot_play {
  position: absolute;
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
  align-items: center;
}
.mscBg {
  width: 110px;
  height: 110px;
  border-radius: 55px;
  margin-right: 10px;
  border-width: 1px;
  border-color: #ececec;
  border-style: solid;
}
.singTitle1 {
  width: 240px;
  font-size: 28px;
  margin-top: 10px;
  lines: 1;
}
.singName1 {
  width: 240px;
  font-size: 28px;
  margin-top: 10px;
  color: #ccc;
  lines: 1;
}
.playBg {
  border-radius: 40px;
  margin-right: 30px;
  color: #ee1c41;
  font-size: 60px;
}
.mscLstBg {
  color: #ee1c41;
  font-size: 58px;
}
/*底部操作开始*/
.gray {
  position: absolute;
  top: 0;
  left: 0;
  width: 750px;
  height: 1250px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
}
.botMoreOpt {
  width: 750px;
  /*position:absolute;
     bottom:0px;
     left:0;
     opacity:0;*/
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
/*底部操作结束*/
.on {
  color: #ee1c41;
}

/*期刊选项部分*/
.title-wrapper {
  height: 60px;
  margin-bottom: 25px;
  border-width: 1px;
  border-style: solid;
  border-color: #fff;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  /*background-color: #fff;*/
}
.title-text {
  color: #fff;
  width: 160px;
  line-height: 60px;
  text-align: center;
  font-size: 30px;
}
.select-tag {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 750px;
  height: 490px;
  flex-direction: column;
  background-color: #ececec;
}
.selOpt {
  height: 100px;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
  flex-direction: row;
  justify-content: space-between;
  background-color: #ececec;
}
.sel-btn {
  color: #3b3b3b;
  font-size: 32px;
}
.red {
  color: #ee1c41;
}
.tag-item {
  line-height: 80px;
  font-size: 32px;
  text-align: center;
  color: #989898;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #ececec;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
}
.btn-1 {
  color: #3b3b3b;
  background-color: #ececec;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #ccc;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ccc;
}
	.rankings{
		width: 750px;
	}
</style>