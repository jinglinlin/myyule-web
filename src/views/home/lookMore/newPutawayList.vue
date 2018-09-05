<template>
    <div class="putBox" @viewappear="miniShow"  @viewdisappear="miniHidder":style="{paddingTop:source==='iOS'?50:20+'px'}">
      <!--加载器-->
  	  <wxc-loading :show="isShow"></wxc-loading>
      <!--排行榜头部-->
      <div class="header center">
	      <text class="iconfont re_icon" v-if="!webVersion"  @click="pop()">&#xe625;</text>
	      <text class="h-title">最新上架</text>
	      <text class="iconfont msc_icon" @click="open()" v-if="!webVersion">&#xe700;</text>
      </div>
      <!--排行榜菜单-->
      <wxc-tab-page ref="wxc-tab-page"
          :tab-titles="tabTitles"
          :tab-styles="tabStyles"
          title-type="text"
          :needSlider="needSlider"
          :is-tab-view="isTabView"
          :tab-page-height="tabPageHeight"
          @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
        <list  @loadmore="fetchPage" loadmoreoffset="600" 
          class="item-container rankingBox"
          :style="{ height: (tabPageHeight - tabStyles.height-100) + 'px' }">
            <header>
	          <div class="padding"></div>
	        </header>
	        <cell class="rankings rankingLists" :key="index" v-for="(item,index) in upSongList1">
	        	<div class="rankingLi"  @click="singlePlay(item)">
		         <div class="leftLi row">
		          	<wxc-checkbox v-if='showBox' @wxcCheckBoxItemChecked="sel(item)" title="" :config="chkboxConfig"></wxc-checkbox>
		            <div class="pic">
		              <image class="mscPic" :src="url+item.logo"></image>
		            </div>
		            <div class="singInfo">
		              <div class="row">
		                <text class="singTitle">{{item.title}}</text>
		                <text class="sign" v-if='item.status==4'>数发</text>
		              </div>
		             <text class="singName">{{item.nickName}}</text>
		           </div>
		         </div>
		         <text class="more" v-if='showChkbox' @click="moreOpt(item)">...</text>
		        </div>
	        </cell>
        </list>
        <list  @loadmore="fetchPage" loadmoreoffset="600" 
          class="item-container rankingBox"
          :style="{ height: (tabPageHeight - tabStyles.height-100) + 'px' }">
            <header>
	          <div class="padding"></div>
	        </header>
		      <cell class="rankings rankingLists" :key="index"  v-for="(item,index) in upSongList2">
	        	<div class="rankingLi"  @click="singlePlay(item)">
	              <div class="leftLi row">
	                  <wxc-checkbox v-if='showBox' @wxcCheckBoxItemChecked="sel(item)" title="" :config="chkboxConfig"></wxc-checkbox>
	                  <div class="pic">
	                    <image class="mscPic" :src="url+item.logo"></image>
	                  </div>
	                  <div class="singInfo">
	                    <div class="row">
	                      <text class="singTitle">{{item.title}}</text>
	                      <text class="sign" v-if='item.status==4'>数发</text>
	                    </div>
	                  <text class="singName">{{item.nickName}}</text>
	                </div>
	              </div>
	              <text class="more" v-if='showChkbox' @click="moreOpt(item)">...</text>
            	</div>
	       </cell>
        </list>
        <list  @loadmore="fetchPage" loadmoreoffset="600" 
          class="item-container rankingBox"
          :style="{ height: (tabPageHeight - tabStyles.height-100) + 'px' }">
            <header>
	          <div class="padding"></div>
	        </header>
		    <cell class="rankings rankingLists" :key="index"  v-for="(item,index) in upSongList3">
	        	<div class="rankingLi"  @click="singlePlay(item)">
		         <div class="leftLi row">
		          	<wxc-checkbox v-if='showBox' @wxcCheckBoxItemChecked="sel(item)" title="" :config="chkboxConfig"></wxc-checkbox>
		            <div class="pic">
		              <image class="mscPic" :src="url+item.logo"></image>
		            </div>
		            <div class="singInfo">
		              <div class="row">
		                <text class="singTitle">{{item.title}}</text>
		                <text class="sign" v-if='item.status==4'>数发</text>
		              </div>
		             <text class="singName">{{item.nickName}}</text>
		           </div>
		         </div>
		         <text class="more" v-if='showChkbox' @click="moreOpt(item)">...</text>
		      </div>
	        </cell>
        </list>
        <list  @loadmore="fetchPage" loadmoreoffset="600" 
          class="item-container rankingBox"
          :style="{ height: (tabPageHeight - tabStyles.height-100) + 'px' }">
         	<header>
			  	<div class="padding"></div>
		    </header>
		    <cell class="rankings rankingLists" :key="index"  v-for="(item,index) in upSongList4">
	        	<div class="rankingLi"  @click="singlePlay(item)">
		         <div class="leftLi row">
		          	<wxc-checkbox v-if='showBox' @wxcCheckBoxItemChecked="sel(item)" title="" :config="chkboxConfig"></wxc-checkbox>
		            <div class="pic">
		              <image class="mscPic" :src="url+item.logo"></image>
		            </div>
		            <div class="singInfo">
		              <div class="row">
		                <text class="singTitle">{{item.title}}</text>
		                <text class="sign" v-if='item.status==4'>数发</text>
		              </div>
		             <text class="singName">{{item.nickName}}</text>
		           </div>
		         </div>
		         <text class="more" v-if='showChkbox' @click="moreOpt(item)">...</text>
		      </div>
	       </cell>
        </list>
        <list  @loadmore="fetchPage" loadmoreoffset="600" 
          class="item-container rankingBox"
          :style="{ height: (tabPageHeight - tabStyles.height-100) + 'px' }">
            <header>
			  	<div class="padding"></div>
		    </header>
		    <cell class="rankings rankingLists" :key="index"  v-for="(item,index) in upSongList5">
	        	<div class="rankingLi"  @click="singlePlay(item)">
		         <div class="leftLi row">
		          	<wxc-checkbox v-if='showBox' @wxcCheckBoxItemChecked="sel(item)" title="" :config="chkboxConfig"></wxc-checkbox>
		            <div class="pic">
		              <image class="mscPic" :src="url+item.logo"></image>
		            </div>
		            <div class="singInfo">
		              <div class="row">
		                <text class="singTitle">{{item.title}}</text>
		                <text class="sign" v-if='item.status==4'>数发</text>
		              </div>
		             <text class="singName">{{item.nickName}}</text>
		           </div>
		         </div>
		         <text class="more" v-if='showChkbox' @click="moreOpt(item)">...</text>
		      </div>
	       </cell>
        </list>
        <list  @loadmore="fetchPage" loadmoreoffset="600" 
          class="item-container rankingBox"
          :style="{ height: (tabPageHeight - tabStyles.height-100) + 'px' }">
          <header>
			  	<div class="padding"></div>
		    </header>
		    <cell class="rankings rankingLists" :key="index"  v-for="(item,index) in upSongList6">
	        	<div class="rankingLi" @click="singlePlay(item)">
		         <div class="leftLi row">
		          	<wxc-checkbox v-if='showBox' @wxcCheckBoxItemChecked="sel(item)" title="" :config="chkboxConfig"></wxc-checkbox>
		            <div class="pic">
		              <image class="mscPic" :src="url+item.logo"></image>
		            </div>
		            <div class="singInfo">
		              <div class="row">
		                <text class="singTitle">{{item.title}}</text>
		                <text class="sign" v-if='item.status==4'>数发</text>
		              </div>
		             <text class="singName">{{item.nickName}}</text>
		           </div>
		         </div>
		         <text class="more" v-if='showChkbox' @click="moreOpt(item)">...</text>
		      </div>
	        </cell>
        </list>
        <list  @loadmore="fetchPage" loadmoreoffset="600" 
          class="item-container rankingBox"
          :style="{ height: (tabPageHeight - tabStyles.height-100) + 'px' }">
          <header>
			  	<div class="padding"></div>
		    </header>
		    <cell class="rankings rankingLists" :key="index"  v-for="(item,index) in upSongList7">
	        	<div class="rankingLi"  @click="singlePlay(item)">
		         <div class="leftLi row">
		          	<wxc-checkbox v-if='showBox' @wxcCheckBoxItemChecked="sel(item)" title="" :config="chkboxConfig"></wxc-checkbox>
		            <div class="pic">
		              <image class="mscPic" :src="url+item.logo"></image>
		            </div>
		            <div class="singInfo">
		              <div class="row">
		                <text class="singTitle">{{item.title}}</text>
		                <text class="sign" v-if='item.status==4'>数发</text>
		              </div>
		             <text class="singName">{{item.nickName}}</text>
		           </div>
		         </div>
		         <text class="more" v-if='showChkbox' @click="moreOpt(item)">...</text>
		      </div>
	       </cell>
        </list>
        <list  @loadmore="fetchPage" loadmoreoffset="600" 
          class="item-container rankingBox"
          :style="{ height: (tabPageHeight - tabStyles.height-100) + 'px' }">
          <header>
			  	<div class="padding"></div>
		    </header>
		    <cell class="rankings rankingLists" :key="index"  v-for="(item,index) in upSongList8">
	        	<div class="rankingLi"  @click="singlePlay(item)">
		         <div class="leftLi row">
		          	<wxc-checkbox v-if='showBox' @wxcCheckBoxItemChecked="sel(item)" title="" :config="chkboxConfig"></wxc-checkbox>
		            <div class="pic">
		              <image class="mscPic" :src="url+item.logo"></image>
		            </div>
		            <div class="singInfo">
		              <div class="row">
		                <text class="singTitle">{{item.title}}</text>
		                <text class="sign" v-if='item.status==4'>数发</text>
		              </div>
		             <text class="singName">{{item.nickName}}</text>
		           </div>
		         </div>
		         <text class="more" v-if='showChkbox' @click="moreOpt(item)">...</text>
		      </div>
	        </cell>
        </list>
      </wxc-tab-page>
      <!--更多操作-->
      <wxc-popup popup-color="#fff"
               :show="isBottomShow"
               @wxcPopupOverlayClicked="popupOverlayBottomClick"
               pos="bottom"
               height="454">
      <div class="demo-content">
          <div class="botMoreOpt col" ref="botMoreOptBg" >
	        <div class="optItems col">
	           <text class="optDesc" @click="addMusicClose()">添加歌单</text>
	           <text class="optDesc" @click="downClose()">下载</text>
	           <text class="optDesc" @click="shareClose()">分享</text>
	        </div>
	        <text class="optDesc" @click="close()">取消</text>
	      </div>
      </div>
    </wxc-popup>
    <!--悬浮操作-->
    <div class="rankingOpt" :class="[platform==='iOS'?'topIos':'topAndroid']">
      <div class="listen row" @click="addSongLstPlay">
        <text class="iconfont grayIcon">&#xe626;</text>
        <text class="listenNum opt-txt" >全部播放</text>
      </div>
      <div class="listen row">
        <div class="listen row" @click="downloadLst">
            <text class="iconfont grayIcon">&#xe63c;</text>
            <text class="listenNum opt-txt" >下载</text>
        </div>
        <div class="listen row" @click="chkbox">
            <text class="iconfont grayIcon1" :class="[active]">&#xe628;</text>
            <text class="listenNum opt-txt" :class="[active]">多选</text>
        </div>
      </div>
    </div>
    
    </div>
</template>

<script>
import {
  WxcPopup,
  WxcCheckbox,
  WxcTabPage,
  Utils,
  WxcLoading,
  WxcSlideNav
} from "weex-ui";
import Config from "../../../api/iconConfig";
import chkboxConfig from "../../../api/iconConfig";
import { getUpList } from "../../../api/urlDate";
import mixins from "../../../mixins";
import {
  sharePage,
  playDailySong,
  openPlayer,
  startMusic,
  stopMusic,
  prevMusic,
  nextMusic,
  playStatus,
  playSingleSong,
  addSongLst,
  toShare,
  downSingleSong,
  downSongLst
} from "../../../api/weex";
var storage = weex.requireModule("storage");
const navigator = weex.requireModule("navigator");
const animation = weex.requireModule("animation");
const modal = weex.requireModule("modal");
var stream = weex.requireModule("stream");
export default {
  mixins: [mixins],
  data() {
    return {
      platform: "",
      isMask: true,
      checkedList: [],
      itemObj: {},
      isBottomShow: false,
      height: 448,
      chkboxConfig: chkboxConfig,
      playshow: false,
      showBox: false,
      showChkbox: true,
      url: "http://media2.myyule.cn/",
      playStatus: 0,
      playshow: true,
      showOpt: true,
      isShow: false,
      pageNo: 1,
      //mobile: "",
      downList: [],
      song: {},
      indexPage: 0,
      active: "",
      active1: "",
      active2: "",
      active3: "",
      active4: "",
      active5: "",
      active6: "",
      active7: "",
      active8: "",
      url: "http://media2.myyule.cn/",
      imgbg:
        "https://gw.alicdn.com/imgextra/i2/1904229646/TB2dRg4dgoQMeJjy0FpXXcTxpXa_!!1904229646-2-daren.png_250x250.jpg",
      upSongList1: [],
      upSongList2: [],
      upSongList3: [],
      upSongList4: [],
      upSongList5: [],
      upSongList6: [],
      upSongList7: [],
      upSongList8: [],
      tabs: ["全部", "流行", "校园", "摇滚", "网络", "R&B", "电子", "英伦"],
      // 切换
      tabTitles: Config.tabTitles,
      tabStyles: Config.tabStyles,
      tabList: [],
      needSlider: true,
      demoList: [1, 2, 3, 4, 5, 6, 7, 8],
      supportSlide: true,
      isTabView: true,
      tabPageHeight: 1334
    };
  },
  components: {
    WxcTabPage,
    WxcCheckbox,
    WxcLoading,
    WxcSlideNav,
    WxcPopup
  },
  beforeCreate() {
    this.fontIcon();
  },
  created() {
    // 显示min播放器
    // this.miniShow();
    //获取平台信息
    console.log(weex.config.env.platform);
    this.platform = weex.config.env.platform;
      if (this.webParam()){
          if(this.webParam().mobile=== "undefined" ||this.webParam().mobile === ""){
              this.uplist1();
          }else{
              this.mobile = this.webParam().mobile;
              // 获取全部部落
              this.uplist1();
          }
      }else {
          //获取mobile
          storage.getItem("mobile", event => {
              if (event.data === "undefined" || event.data === "") {
                  // 获取全部部落
                  this.uplist1();
              } else {
                  this.mobile = event.data;
                  // 获取全部部落
                  this.uplist1();
              }
          });
	  }


    this.tabPageHeight = Utils.env.getPageHeight();
    this.tabList = [...Array(this.tabTitles.length).keys()].map(i => []);
    //Vue.set(this.tabList, 0, this.demoList);
  },
  mounted(){
    // 数据埋点
    this.putPageUrlLog(1306);
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
      if (this.indexPage == 0 && !this.upSongList1.length == 0) {
        if (this.checkedList.length > 0) {
          playDailySong(this.checkedList);
        } else {
          playDailySong(this.upSongList1);
        }
      } else if (this.indexPage == 1 && !this.upSongList2.length == 0) {
        if (this.checkedList.length > 0) {
          playDailySong(this.checkedList);
        } else {
          playDailySong(this.upSongList2);
        }
      } else if (this.indexPage == 2 && !this.upSongList3.length == 0) {
        if (this.checkedList.length > 0) {
          playDailySong(this.checkedList);
        } else {
          playDailySong(this.upSongList3);
        }
      } else if (this.indexPage == 3 && !this.upSongList4.length == 0) {
        if (this.checkedList.length > 0) {
          playDailySong(this.checkedList);
        } else {
          playDailySong(this.upSongList4);
        }
      } else if (this.indexPage == 4 && !this.upSongList5.length == 0) {
        if (this.checkedList.length > 0) {
          playDailySong(this.checkedList);
        } else {
          playDailySong(this.upSongList5);
        }
      } else if (this.indexPage == 5 && !this.upSongList6.length == 0) {
        if (this.checkedList.length > 0) {
          playDailySong(this.checkedList);
        } else {
          playDailySong(this.upSongList6);
        }
      } else if (this.indexPage == 6 && !this.upSongList7.length == 0) {
        if (this.checkedList.length > 0) {
          playDailySong(this.checkedList);
        } else {
          playDailySong(this.upSongList7);
        }
      } else if (this.indexPage == 7 && !this.upSongList8.length == 0) {
        if (this.checkedList.length > 0) {
          playDailySong(this.checkedList);
        } else {
          playDailySong(this.upSongList8);
        }
      }
      this.open();
    },
    //下载歌曲列表
    downloadLst() {
      if (this.indexPage == 0 && !this.upSongList1.length == 0) {
        if (this.checkedList.length > 0) {
          downSongLst(this.checkedList);
        } else {
          downSongLst(this.upSongList1);
        }
      } else if (this.indexPage == 1 && !this.upSongList2.length == 0) {
        if (this.checkedList.length > 0) {
          downSongLst(this.checkedList);
        } else {
          downSongLst(this.upSongList2);
        }
      } else if (this.indexPage == 2 && !this.upSongList3.length == 0) {
        if (this.checkedList.length > 0) {
          downSongLst(this.checkedList);
        } else {
          downSongLst(this.upSongList3);
        }
      } else if (this.indexPage == 3 && !this.upSongList4.length == 0) {
        if (this.checkedList.length > 0) {
          downSongLst(this.checkedList);
        } else {
          downSongLst(this.upSongList4);
        }
      } else if (this.indexPage == 4 && !this.upSongList5.length == 0) {
        if (this.checkedList.length > 0) {
          downSongLst(this.checkedList);
        } else {
          downSongLst(this.upSongList5);
        }
      } else if (this.indexPage == 5 && !this.upSongList6.length == 0) {
        if (this.checkedList.length > 0) {
          downSongLst(this.checkedList);
        } else {
          downSongLst(this.upSongList6);
        }
      } else if (this.indexPage == 6 && !this.upSongList7.length == 0) {
        if (this.checkedList.length > 0) {
          downSongLst(this.checkedList);
        } else {
          downSongLst(this.upSongList7);
        }
      } else if (this.indexPage == 7 && !this.upSongList8.length == 0) {
        if (this.checkedList.length > 0) {
          downSongLst(this.checkedList);
        } else {
          downSongLst(this.upSongList8);
        }
      }

      this.openPlayLst();
    },
    // 获取最新上架
    uplist1() {
      //加载器
      this.isShow = true;
      getUpList(
        {
          songStatus: 4,
          songStyle: [""], //this.tabs[0],
          //	    	mobile':'',
          pageNo: this.pageNo,
          //	    	pageSize: '10',
          //	    	lastIndexId:'',
          sort: "new"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.obj = res.object;
            this.upSongList1 =
              this.pageNo > 1
                ? this.upSongList1.concat(res.object)
                : res.object;
            this.song = this.upSongList1[0];
          } else {
            this.isShow = false;
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 获取最新上架
    uplist2() {
      //加载器
      this.isShow = true;
      getUpList(
        {
          songStatus: 4,
          songStyle: ["流行"], //this.tabs[0],
          //	    	mobile':'',
          pageNo: this.pageNo,
          //	    	pageSize: '10',
          //	    	lastIndexId:'',
          sort: "new"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.obj = res.object;
            this.upSongList2 =
              this.pageNo > 1
                ? this.upSongList2.concat(res.object)
                : res.object;
            this.song = this.upSongList2[0];
          } else {
            this.isShow = false;
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 获取最新上架
    uplist3() {
      //加载器
      this.isShow = true;
      getUpList(
        {
          songStatus: 4,
          songStyle: ["校园"], //this.tabs[0],
          //	    	mobile':'',
          pageNo: this.pageNo,
          //	    	pageSize: '10',
          //	    	lastIndexId:'',
          sort: "new"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.obj = res.object;
            this.upSongList3 =
              this.pageNo > 1
                ? this.upSongList3.concat(res.object)
                : res.object;
            this.song = this.upSongList3[0];
          } else {
            this.isShow = false;
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 获取最新上架
    uplist4() {
      //加载器
      this.isShow = true;
      getUpList(
        {
          songStatus: 4,
          songStyle: ["摇滚"], //this.tabs[0],
          //	    	mobile':'',
          pageNo: this.pageNo,
          //	    	pageSize: '10',
          //	    	lastIndexId:'',
          sort: "new"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.obj = res.object;
            this.upSongList4 =
              this.pageNo > 1
                ? this.upSongList4.concat(res.object)
                : res.object;
            this.song = this.upSongList4[0];
          } else {
            this.isShow = false;
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 获取最新上架
    uplist5() {
      //加载器
      this.isShow = true;
      getUpList(
        {
          songStatus: 4,
          songStyle: ["网络"], //this.tabs[0],
          //	    	mobile':'',
          pageNo: this.pageNo,
          //	    	pageSize: '10',
          //	    	lastIndexId:'',
          sort: "new"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.obj = res.object;
            this.upSongList5 =
              this.pageNo > 1
                ? this.upSongList5.concat(res.object)
                : res.object;
            this.song = this.upSongList5[0];
          } else {
            this.isShow = false;
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 获取最新上架
    uplist6() {
      //加载器
      this.isShow = true;
      getUpList(
        {
          songStatus: 4,
          songStyle: ["R&B"], //this.tabs[0],
          //	    	mobile':'',
          pageNo: this.pageNo,
          //	    	pageSize: '10',
          //	    	lastIndexId:'',
          sort: "new"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.obj = res.object;
            this.upSongList6 =
              this.pageNo > 1
                ? this.upSongList6.concat(res.object)
                : res.object;
            this.song = this.upSongList6[0];
          } else {
            this.isShow = false;
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 获取最新上架
    uplist7() {
      //加载器
      this.isShow = true;
      getUpList(
        {
          songStatus: 4,
          songStyle: ["电子"], //this.tabs[0],
          //	    	mobile':'',
          pageNo: this.pageNo,
          //	    	pageSize: '10',
          //	    	lastIndexId:'',
          sort: "new"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.obj = res.object;
            this.upSongList7 =
              this.pageNo > 1
                ? this.upSongList7.concat(res.object)
                : res.object;
            this.song = this.upSongList7[0];
          } else {
            this.isShow = false;
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 获取最新上架
    uplist8() {
      //加载器
      this.isShow = true;
      getUpList(
        {
          songStatus: 4,
          songStyle: ["英伦"], //this.tabs[0],
          //	    	mobile':'',
          pageNo: this.pageNo,
          //	    	pageSize: '10',
          //	    	lastIndexId:'',
          sort: "new"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.obj = res.object;
            this.upSongList8 =
              this.pageNo > 1
                ? this.upSongList8.concat(res.object)
                : res.object;
            this.song = this.upSongList8[0];
          } else {
            this.isShow = false;
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 加载下一页
    fetchPage() {
      if (!this.isShow) {
        this.pageNo += 1;
        this.showList();
        //this.uplist(this.pageNo);
        setTimeout(() => {}, 800);
      }
    },
    showList() {
      if (this.indexPage == 0) {
        this.uplist1();
      } else if (this.indexPage == 1) {
        this.uplist2();
      } else if (this.indexPage == 2) {
        this.uplist3();
      } else if (this.indexPage == 3) {
        this.uplist4();
      } else if (this.indexPage == 4) {
        this.uplist5();
      } else if (this.indexPage == 5) {
        this.uplist6();
      } else if (this.indexPage == 6) {
        this.uplist7();
      } else if (this.indexPage == 7) {
        this.uplist8();
      }
    },
    wxcTabPageCurrentTabSelected(e) {
      this.active = "";
      this.showBox = false;
      const self = this;
      const index = e.page;
      this.pageNo = 1;
      this.indexPage = index;
      if (index == 0 && this.upSongList1.length == 0) {
        this.uplist1();
      } else if (index == 1 && this.upSongList2.length == 0) {
        this.uplist2();
      } else if (index == 2 && this.upSongList3.length == 0) {
        this.uplist3();
      } else if (index == 3 && this.upSongList4.length == 0) {
        this.uplist4();
      } else if (index == 4 && this.upSongList5.length == 0) {
        this.uplist5();
      } else if (index == 5 && this.upSongList6.length == 0) {
        this.uplist6();
      } else if (index == 6 && this.upSongList7.length == 0) {
        this.uplist7();
      } else if (index == 7 && this.upSongList8.length == 0) {
        this.uplist8();
      }
      /* 未加载tab模拟数据请求 */
      if (!Utils.isNonEmptyArray(self.tabList[index])) {
        setTimeout(() => {
          // Vue.set(self.tabList, index, self.demoList);
        }, 100);
      }
    },
    addClassOn(obj) {
      if (this.obj == "") {
        this.obj = "on";
      } else {
        this.obj = "";
      }
    },
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
    //分享歌曲
    shareClose() {
      let _this = this;
      let sObj = {
        title: _this.itemObj.title,
        desc: _this.itemObj.nickName,
        web_url:"http://mp.myyule.teamshub.com//song/"+_this.itemObj.songId +"?from=singlemessage&isappinstalled=0",
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
    // 多选操作
    chkbox() {
      this.showBox = !this.showBox;
      this.showChkbox = !this.showChkbox;
      this.checkedList = [];
      if (this.active == "") {
        this.active = "on";
      } else {
        this.active = "";
      }
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
    // 更多操作
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
    //非状态组件，需要在这里关闭
    popupOverlayBottomClick() {
      // 显示min播放器
      this.miniShow();
      this.isBottomShow = false;
    },
    close() {
      // 显示min播放器
      this.miniShow();
      this.itemObj = {};
      this.isBottomShow = false;
    }
  }
};
</script>

<style scoped>
.padding {
  width: 750px;
  height: 120px;
  background-color: #fff;
}
.nav {
  position: fixed;
  left: 0;
  top: 292px;
  width: 750px;
  flex-direction: row;
  align-items: center;
}
.nav-top {
  top: 292px;
}
.nav-bottom {
  bottom: 0;
}
.nav-cell {
  flex: 1;
  height: 80px;
  background-color: #ffc300;
  align-items: center;
  justify-content: center;
}
.nav-text {
  font-size: 32px;
}

.putBox {
  position: relative;
  background-color: #fff;
  /*  padding-top:50px; */
}
.iconfont {
  font-family: iconfont;
}
/*头部 开始*/
.header {
  height: 100px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ccc;
  position: relative;
}
.h-title {
  font-weight: bold;
  line-height: 100px;
  font-size: 36px;
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
.col {
  flex-direction: column;
  justify-content: center;
}
.row {
  flex-direction: row;
  justify-content: space-between;
}
.center {
  justify-content: center;
  align-items: center;
}
/*列表操作*/
.rankingBox {
  width: 750px;
  background-color: #fff;
}
.topIos {
  top: 248px;
}
.topAndroid {
  top: 222px;
}
.rankingOpt {
  position: fixed;
  left: 0;
  top: 292px;
  width: 750px;
  height: 120px;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #ccc;
  flex-direction: row;
  justify-content: space-between;
  background-color: #ffffff;
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
  color: #666;
  font-size: 55px;
}
.grayIcon1 {
  margin-left: 30px;
  color: #666;
  font-size: 45px;
}
.opt-txt {
  color: #666;
  font-size: 32px;
  margin-left: 18px;
}
.rankingLists {
  padding-left: 20px;
}
.rankingLi {
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
  margin-right: 15px;
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
.leftLi {
  align-items: center;
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
}
.singInfo {
  margin-right: 6px;
}
.singTitle {
  width: 200px;
  color: #666;
  font-size: 28px;
  margin-top: 10px;
  lines: 1;
	text-overflow:ellipsis;
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
  color: #ccc;
  lines: 1;
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
  /*position:fixed;
  	bottom:0px;*/
  position: absolute;
  bottom: -20px;
  left: 0;
  width: 750px;
  height: 140px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-top-width: 2px;
  border-top-style: solid;
  border-top-color: #ececec;
  background-color: #fff;
  align-items: center;
  /*flex-direction: row;
    justify-content: space-between;*/
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
.playBox {
  align-items: center;
}
/*  .playBg{
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
.tit_act {
  color: #ee1c41;
  border-bottom-width: 5px;
  border-bottom-style: solid;
  border-bottom-color: #ee1c41;
}
/*菜单结束*/
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
  /* position:absolute;
     bottom:0px;
     left:0;
     opacity:0;*/
}
.optItems {
  margin-bottom: 10px;
}
.optDesc {
  color: #000;
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
</style>

