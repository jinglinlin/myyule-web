<template>
  <div class="editorSong" @viewappear="miniShow"  @viewdisappear="miniHidder" :style="{paddingTop:source==='iOS'?50:20+'px'}">
  	<!--加载器-->
  	<wxc-loading :show="isShow"></wxc-loading>
  	<!--头部-->
    <div class="header center">
      <text class="iconfont re_icon"  @click="pop()">&#xe625;</text>
      <text class="h-title">歌单推荐</text>
      <text class="iconfont msc_icon" @click="open()">&#xe700;</text>
    </div>
    <wxc-tab-page ref="wxc-tab-page"
          :tab-titles="tabTits"
          :tab-styles="tabStyles"
          title-type="text"
          :needSlider="needSlider"
          :is-tab-view="isTabView"
          :tab-page-height="tabPageHeight"
          @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
      <scroller @loadmore="fetchPage" loadmoreoffset="600"
          class="item-container musicListBox"
          :style="{ height: (tabPageHeight - tabStyles.height) + 'px' }">
	        <div class="musicList">
	        	   <div class="row">
			          <div class="musicLi" v-for="(music, i) in musicList1" @click="push('/featureList',{resId:music.albumId,resType:'songAlbum'})">
			            <div class="imgPlay">
			              <image class="img" :src="url+music.logo"></image>
			              <div class="ps">
			                <div class="video row">
			                  <text class="iconfont videoImg">&#xe678;</text>
			                  <text class="videoNum">{{music.playSum}}</text>
			                </div>
			                <text class="iconfont play-icon" @click="addSongLstPlay(music)">&#xe61d;</text>
			              </div>
			            </div>
			            <text class="playTitle">{{music.title}}</text>
			          </div>
			        </div>
	        </div>
      </scroller>
      <scroller  @loadmore="fetchPage" loadmoreoffset="600"
          class="item-container musicListBox"
          :style="{ height: (tabPageHeight - tabStyles.height) + 'px' }">
	        <div class="musicList">
	        	   <div class="row">
			          <div class="musicLi" v-for="(music, i) in musicList2"  @click="push('/featureList',{resId:music.albumId,resType:'songAlbum'})">
			            <div class="imgPlay">
			              <image class="img" :src="url+music.logo"></image>
			              <div class="ps">
			                <div class="video row">
			                  <text class="iconfont videoImg">&#xe678;</text>
			                  <text class="videoNum">{{music.playSum}}</text>
			                </div>
			                <text class="iconfont play-icon" @click="addSongLstPlay(music)">&#xe61d;</text>
			              </div>
			            </div>
			            <text class="playTitle">{{music.title}}</text>
			          </div>
			        </div>
	        </div>
      </scroller>
    </wxc-tab-page>
  </div>
</template>

<script>
import { getRecommendSong, getAlbumSongs } from "../../../api/urlDate";
import Config from "../../../api/iconConfig";
import { WxcTabPage, WxcPanItem, Utils, WxcLoading } from "weex-ui";
import mixins from '../../../mixins'
import {
  playDailySong,
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
  mixins:[mixins],
  components: {
    WxcTabPage,
    WxcLoading
  },
  data() {
    return {
      playStatus: 0,
      isShow: false,
      pageNo: 1,
      indexPage: 0,
      url: "http://media2.myyule.cn/",
      imgbg:
        "https://gw.alicdn.com/imgextra/i2/1904229646/TB2dRg4dgoQMeJjy0FpXXcTxpXa_!!1904229646-2-daren.png_250x250.jpg",
      musicList1: [],
      musicList2: [],
      albumSongLst: {}, //专辑列表
      song: {},
      tabTits: [{ title: "最新" }, { title: "最热" }],
      // 切换
      tabStyles: Config.tabStyles1,
      tabList: [],
      needSlider: true,
      demoList: [1, 2, 3],
      supportSlide: true,
      isTabView: true,
      tabPageHeight: 1334,
      checkedList: [2]
    };
  },
  beforeCreate(){
    this.fontIcon();
  },
  created() {
     // 显示min播放器
      // this.miniShow();
    //获取mobile
      if (this.webParam()) {
          this.mobile = this.webParam().mobile;
          this.recommendSong1();
      } else {
          storage.getItem("mobile", event => {
              if (event.data === "undefined" || event.data === "") {
                  // 获取全部部落
                  this.recommendSong1();
              } else {
                  this.mobile = event.data;
                  // 获取全部部落
                  this.recommendSong1();
              }
          });
	  }

    this.tabPageHeight = Utils.env.getPageHeight()-100;
    this.tabList = [...Array(this.tabTits.length).keys()].map(i => []);
    //Vue.set(this.tabList, 0, this.demoList);
  },
  mounted() {
    this.putPageUrlLog(1301)
  },
  methods: {
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
    /*	playSongStatus(){
				playStatus().then(status => {
					  //status: 1：播放中，0：未播放
		        if (status == 0) {
		        	this.playStatus=1;
		        	this.startM() ;
		        } else {
		        	this.playStatus=0;
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
    addSongLstPlay(item) {
      this.getAlbumSongsLst(item);
    },
    //查询专辑下歌曲列表
    getAlbumSongsLst(item) {
      getAlbumSongs(
        {
          resId: item.albumId
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.albumSongLst = res.object;
            if(this.albumSongLst.length>0){
            	 playDailySong(this.albumSongLst);
            }else{
            	modal.toast({
			          message: "专辑列表为空!",
			          duration: 1
			        });
            }
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 获取小编推荐歌曲（最新）
    recommendSong1() {
      this.isShow = true;
      getRecommendSong(
        {
          /*albumStatus: '',
		    	albumStyle: '',*/
          pageNo: this.pageNo,
          pageSize: "10",
          /*lastIndexId:'',*/
          sort: "new"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.musicList1 =
              this.pageNo > 1 ? this.musicList1.concat(res.object) : res.object;
            this.song = this.musicList1[0];
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 获取小编推荐歌曲（最热）
    recommendSong2() {
      this.isShow = true;
      getRecommendSong(
        {
          /*albumStatus: '',
		    	albumStyle: '',*/
          pageNo: this.pageNo,
          pageSize: "10",
          /*lastIndexId:'',*/
          sort: "hot"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.musicList2 =
              this.pageNo > 1 ? this.musicList2.concat(res.object) : res.object;
            this.song = this.musicList2[0];
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
        this.show();
      }
    },
    show() {
      if (this.indexPage == 0) {
        this.recommendSong1();
      } else if (this.indexPage == 1) {
        this.recommendSong2();
      }
    },
    //tab切换
    wxcTabPageCurrentTabSelected(e) {
      const self = this;
      const index = e.page;
      this.pageNo = 1;
      this.indexPage = index;

      if (index == 1 && this.musicList2.length == 0) {
        this.recommendSong2();
      }
      /* 未加载tab模拟数据请求 */
      if (!Utils.isNonEmptyArray(self.tabList[index])) {
        setTimeout(() => {
          // Vue.set(self.tabList, index, self.demoList);
        }, 100);
      }
    }
  }
};
</script>

<style scoped>
.editorSong {
  position: relative;
  background-color: #fff;
  /* padding-top:50px; */
}
.iconfont {
  font-family: iconfont;
}
/*头部*/
.header {
  height: 100px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ccc;
  position: relative;
}
.re_icon {
  position: absolute;
  top: 30px;
  left: 30px;
  color: #ee1c41;
  font-size: 40px;
  font-weight: bold;
}
.msc_icon {
  position: absolute;
  right: 20px;
  top: 25px;
  color: #ee1c41;
  font-size: 48px;
  font-weight: bold;
}
/*头部 结束*/
.h-title {
  font-weight: bold;
  line-height: 100px;
  font-size: 30px;
}
.row {
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  -moz-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  -o-flex-wrap: wrap;
}
.space-b {
  justify-content: space-between;
}
.searchBar {
  height: 60px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 15px;
  margin-bottom: 15px;
}
.on {
  color: #ff4563;
}
.left {
  justify-content: flex-start;
}
.right {
  justify-content: flex-end;
}
.center {
  justify-content: center;
  align-items: center;
}
.search-title {
  margin-right: 10px;
}
.e-title {
  margin-left: 17px;
  margin-right: 17px;
}
/*列表开始*/
.musicListBox {
  width: 750px;
  height: 1060px;
  background-color: #fff;
}
.musicList {
  padding-right: 20px;
  padding-bottom: 20px;
}
.imgPlay {
  width: 327px;
  height: 326px;
  border-width: 1px;
  border-style: solid;
  border-color: #ccc;
  position:relative;
}
.img {
  width: 327px;
  height: 326px;
}
.musicLi {
  width: 327px;
  margin-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
.playTitle {
  margin-top: 10px;
  font-weight: bold;
  font-size: 28px;
  color: #666;
  lines: 1;
}
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
.active {
  color: #ff4563;
  position: absolute;
  top: 0;
  left: 0;
}
.pu-icon {
  position: absolute;
  right: 10px;
  bottom: 10px;
  color: #fff;
  font-size: 48px;
}
.icon {
  position: absolute;
  width: 45px;
  height: 45px;
  right: 10px;
  bottom: 10px;
  border-radius: 22.5px;
}
.msc {
  position: absolute;
  width: 45px;
  height: 45px;
  right: 20px;
  top: 25px;
  border-radius: 22.5px;
}
.title {
  font-size: 28px;
  margin-top: 10px;
  height: 120px;
}
.banner {
  width: 750px;
  height: 205px;
  border-width: 1px;
  border-style: solid;
  border-color: #ccc;
  margin-top: 30px;
  margin-bottom: 30px;
}
.ps {
  width: 327px;
  position: absolute;
  left: 0px;
  bottom: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
}
.video {
  align-items: center;
}
.videoImg {
  margin-right: 10px;
  color: #fff;
  font-size: 50px;
}
.videoNum {
  line-height: 40px;
  font-size: 30px;
  color: #fff;
}
.play-icon {
  color: #fff;
  font-size: 48px;
}
/*列表结束 */
.bot_play {
  position: absolute;
  bottom: -20px;
  left: 0;
  width: 750px;
  height: 140px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #fff;
  border-top-width: 2px;
  border-top-style: solid;
  border-top-color: #ececec;
  align-items: center;
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
.playBox {
  align-items: center;
}
/* .playBg{
    border-radius: 40px;
    margin-right:30px;
    color:#ee1c41;
    font-size: 60px;
  }
  .mscLstBg{
    color:#ee1c41;
    font-size: 58px;
  }*/
.playBg {
  border-radius: 40px;
  margin-right: 60px;
  color: #ee1c41;
  font-size: 80px;
}
.mscLstBg {
  color: #ee1c41;
  font-size: 68px;
}
</style>
