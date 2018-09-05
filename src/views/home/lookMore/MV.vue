<template>
  <div class="MV" :style="{paddingTop:source==='iOS'?50:20+'px'}">
  	<!--加载器-->
  	<wxc-loading :show="isShow"></wxc-loading>
    <div class="header center">
  	  <text class="iconfont re_icon"  @click="pop()">&#xe625;</text>
      <text class="h-title">MV</text>
    </div>
    <wxc-tab-page ref="wxc-tab-page"
          :tab-titles="tabTitles1"
          :tab-styles="tabStyles1"
          title-type="text"
          :needSlider="needSlider"
          :is-tab-view="isTabView"
          :tab-page-height="tabPageHeight"
          @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
        <scroller class="item-container musicListBox"  @loadmore="fetchPage" loadmoreoffset="600"
            :style="{ height: (tabPageHeight - tabStyles1.height) + 'px' }">
            <div class="tabTit" :style="{top:source==='iOS'?242:212+'px'}">
               <div class="row right">
                 <text class="search-title" :class="[one]"  @click="tabSel(0)">最新</text>
                 <text class="search-title" :class="[two]" @click="tabSel(1)">最热</text>
              </div>
            </div>
            <div class="list-wrapper">
            <div class="musicList">
                <div class="musicLi"  :key="i"  v-for="(video, i) in videosTest1" v-if="i<4" >
                  <mvList :video="video"></mvList>
                </div>
            </div>
            <div class="banner" @click="pushWeb()">
                <image class="banner-image"  :src="url+bannerSrc"/>
            </div>
            <div class="musicList musicList1">
                <div class="musicLi" :key="i" v-for="(video, i) in videosTest1"   v-if="3<i">
                  <mvList :video="video"></mvList>
                </div>
            </div>
            </div>
        </scroller>
        <scroller class="item-container musicListBox"  @loadmore="fetchPage" loadmoreoffset="600"
          :style="{ height: (tabPageHeight - tabStyles1.height) + 'px' }">
          <div class="tabTit">
		         <div class="row right">
		           <text class="search-title" :class="[one]"  @click="tabSel(0)">最新</text>
		           <text class="search-title" :class="[two]" @click="tabSel(1)">最热</text>
		        </div>
		      </div>
          <div class="list-wrapper">
	        <div class="musicList">
		      		<div class="musicLi" v-for="(video, i) in videosTest2" v-if="i<4">
		          	<mvList :video="video"></mvList>
		      		</div>
	        </div>
	        <div class="banner" @click="pushWeb()">
		          <image class="banner-image"  :src="url+bannerSrc"/>
		      </div>
		      <div class="musicList musicList1">
		      		<div class="musicLi" v-for="(video, i) in videosTest2"  v-if="3<i">
		      			<mvList :video="video"></mvList>
		      		</div>
	        </div>
          </div>
      </scroller>
       <scroller class="item-container musicListBox"  @loadmore="fetchPage" loadmoreoffset="600"
          :style="{ height: (tabPageHeight - tabStyles1.height) + 'px' }">
          <div class="tabTit">
		         <div class="row right">
		           <text class="search-title" :class="[one]"  @click="tabSel(0)">最新</text>
		           <text class="search-title" :class="[two]" @click="tabSel(1)">最热</text>
		        </div>
		      </div>
          <div class="list-wrapper">
	        <div class="musicList">
		      		<div class="musicLi" v-for="(video, i) in videosTest3" v-if="i<4">
		          	<mvList :video="video"></mvList>
		      		</div>
	        </div>
	        <div class="banner" @click="pushWeb()">
		          <image class="banner-image"  :src="url+bannerSrc"/>
		      </div>
		      <div class="musicList musicList1">
		      		<div class="musicLi" v-for="(video, i) in videosTest3"  v-if="3<i">
		      			<mvList :video="video"></mvList>
		      		</div>
	        </div>
          </div>
      </scroller>
       <scroller class="item-container musicListBox"  @loadmore="fetchPage" loadmoreoffset="600"
          :style="{ height: (tabPageHeight - tabStyles1.height) + 'px' }">
          <div class="tabTit">
		         <div class="row right">
		           <text class="search-title" :class="[one]"  @click="tabSel(0)">最新</text>
		           <text class="search-title" :class="[two]" @click="tabSel(1)">最热</text>
		        </div>
		      </div>
          <div class="list-wrapper">
	        <div class="musicList">
		      		<div class="musicLi" v-for="(video, i) in videosTest4" v-if="i<4">
		          	<mvList :video="video"></mvList>
		      		</div>
	        </div>
	        <div class="banner" @click="pushWeb()">
		          <image class="banner-image"  :src="url+bannerSrc"/>
		      </div>
		      <div class="musicList musicList1">
		      		<div class="musicLi" v-for="(video, i) in videosTest4"  v-if="3<i">
		      			<mvList :video="video"></mvList>
		      		</div>
	        </div>
          </div>
      </scroller>
      <scroller class="item-container musicListBox"  @loadmore="fetchPage" loadmoreoffset="600"
          :style="{ height: (tabPageHeight - tabStyles1.height) + 'px' }">
          <div class="tabTit">
		         <div class="row right">
		           <text class="search-title" :class="[one]"  @click="tabSel(0)">最新</text>
		           <text class="search-title" :class="[two]" @click="tabSel(1)">最热</text>
		        </div>
		      </div>
          <div class="list-wrapper">
	        <div class="musicList">
		      		<div class="musicLi" v-for="(video, i) in videosTest5" v-if="i<4">
		          	<mvList :video="video"></mvList>
		      		</div>
	        </div>
	        <div class="banner" @click="pushWeb()">
		          <image class="banner-image"  :src="url+bannerSrc"/>
		      </div>
		      <div class="musicList musicList1">
		      		<div class="musicLi" v-for="(video, i) in videosTest5"  v-if="3<i">
		      			<mvList :video="video"></mvList>
		      		</div>
	        </div>
          </div>
      </scroller>
      <scroller class="item-container musicListBox"  @loadmore="fetchPage" loadmoreoffset="600"
          :style="{ height: (tabPageHeight - tabStyles1.height) + 'px' }">
          <div class="tabTit">
		         <div class="row right">
		           <text class="search-title" :class="[one]"  @click="tabSel(0)">最新</text>
		           <text class="search-title" :class="[two]" @click="tabSel(1)">最热</text>
		        </div>
		      </div>
          <div class="list-wrapper">
	        <div class="musicList">
		      		<div class="musicLi" v-for="(video, i) in videosTest6" v-if="i<4">
		          	<mvList :video="video"></mvList>
		      		</div>
	        </div>
	        <div class="banner" @click="pushWeb()">
		          <image class="banner-image"  :src="url+bannerSrc"/>
		      </div>
		      <div class="musicList musicList1">
		      		<div class="musicLi" v-for="(video, i) in videosTest6"  v-if="3<i">
		      			<mvList :video="video"></mvList>
		      		</div>
	        </div>
          </div>
      </scroller>
      <scroller class="item-container musicListBox"  @loadmore="fetchPage" loadmoreoffset="600"
          :style="{ height: (tabPageHeight - tabStyles1.height) + 'px' }">
          <div class="tabTit">
		         <div class="row right">
		           <text class="search-title" :class="[one]"  @click="tabSel(0)">最新</text>
		           <text class="search-title" :class="[two]" @click="tabSel(1)">最热</text>
		        </div>
		      </div>
          <div class="list-wrapper">
	        <div class="musicList">
		      		<div class="musicLi" v-for="(video, i) in videosTest7" v-if="i<4">
		          	<mvList :video="video"></mvList>
		      		</div>
	        </div>
	        <div class="banner" @click="pushWeb()">
		          <image class="banner-image"  :src="url+bannerSrc"/>
		      </div>
		      <div class="musicList musicList1">
		      		<div class="musicLi" v-for="(video, i) in videosTest7"  v-if="3<i">
		      			<mvList :video="video"></mvList>
		      		</div>
	        </div>
          </div>
      </scroller>
    </wxc-tab-page>
  </div>
</template>

<script>
import { WxcTabPage, WxcPanItem, Utils, WxcLoading } from "weex-ui";
import { getMVList, getAdver } from "../../../api/urlDate";
import mvList from "./mvList.vue";
import Config from "../../../api/iconConfig";
import mixins from "../../../mixins";
import { startNewWebView } from "../../../api/weex";
var storage = weex.requireModule("storage");
const navigator = weex.requireModule("navigator");
const animation = weex.requireModule("animation");
const modal = weex.requireModule("modal");
var stream = weex.requireModule("stream");
export default {
  mixins: [mixins],
  components: {
    WxcTabPage,
    WxcLoading,
    mvList
  },
  data() {
    return {
      isShow: false,
      indexPage: 0,
      pageNo: 1,
      sort: "new",
      videoTag: "",
      one: "on",
      two: "",
      url: "http://media2.myyule.cn/",
      bannerSrc:
        "https://gw.alicdn.com/imgextra/TB2O_AKctHO8KJjSZFtXXchfXXa_!!53-0-lubanu.jpg_q50.jpg",
      bannerUrl: "http://www.myyule.com/video/base/detail/2501864",
      videosTest1: [],
      videosTest2: [],
      videosTest3: [],
      videosTest4: [],
      videosTest5: [],
      videosTest6: [],
      videosTest7: [],
      tabTitles1: [
        { title: "全部" },
        { title: "短片" },
        { title: "微电影" },
        { title: "音乐" },
        { title: "剪辑" },
        { title: "花絮" },
        { title: "生活片段" }
      ],
      tabStyles1: Config.tabStyles2,
      needSlider: true,
      demoList: [1, 2, 3, 4, 5, 6, 7],
      supportSlide: true,
      isTabView: true,
      tabPageHeight: 1334
    };
  },
  beforeCreate() {
    this.fontIcon();
  },
  created() {
  },
  mounted() {
    // 数据埋点
    this.putPageUrlLog(1305);
    this.MVList1();
    this.tabPageHeight = Utils.env.getPageHeight();
    this.tabList = [...Array(this.tabTitles1.length).keys()].map(i => []);
    /*mv页面广告图查询*/
    getAdver({
      adType: "mv"
    })
      .then(res => {
        if (res.status == 0) {
          this.bannerSrc = res.object[0].logo;
        } else {
          console.log(res.desc);
        }
      })
      .catch();
  },
  methods: {
    // 获取MV列表
    MVList1() {
      this.isShow = true;
      getMVList(
        {
          videoTag: [""], //标签分类名称
          pageNo: this.pageNo,
          //pageSize: 10,
          sort: this.sort
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.videosTest1 =
              this.pageNo > 1
                ? this.videosTest1.concat(res.object)
                : res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    MVList2() {
      this.isShow = true;
      getMVList(
        {
          videoTag: ["短片"], //标签分类名称
          pageNo: this.pageNo,
          pageSize: "10",
          sort: this.sort
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.videosTest2 =
              this.pageNo > 1
                ? this.videosTest2.concat(res.object)
                : res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    MVList3() {
      this.isShow = true;
      getMVList(
        {
          videoTag: ["微电影"], //标签分类名称
          pageNo: this.pageNo,
          pageSize: "10",
          sort: this.sort
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.videosTest3 =
              this.pageNo > 1
                ? this.videosTest3.concat(res.object)
                : res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    MVList4() {
      this.isShow = true;
      getMVList(
        {
          videoTag: ["音乐"], //标签分类名称
          pageNo: this.pageNo,
          pageSize: "10",
          sort: this.sort
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.videosTest4 =
              this.pageNo > 1
                ? this.videosTest4.concat(res.object)
                : res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    MVList5() {
      this.isShow = true;
      getMVList(
        {
          videoTag: ["剪辑"], //标签分类名称
          pageNo: this.pageNo,
          pageSize: "10",
          sort: this.sort
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.videosTest5 =
              this.pageNo > 1
                ? this.videosTest5.concat(res.object)
                : res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    MVList6() {
      this.isShow = true;
      getMVList(
        {
          videoTag: ["花絮"], //标签分类名称
          pageNo: this.pageNo,
          pageSize: "10",
          sort: this.sort
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.videosTest6 =
              this.pageNo > 1
                ? this.videosTest6.concat(res.object)
                : res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    MVList7() {
      this.isShow = true;
      getMVList(
        {
          videoTag: ["生活片段"], //标签分类名称
          pageNo: this.pageNo,
          pageSize: "10",
          sort: this.sort
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.videosTest7 =
              this.pageNo > 1
                ? this.videosTest7.concat(res.object)
                : res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 加载下一页
    fetchPage() {
      if (!this.isShow) {
        this.pageNo++;
        this.showList();
      }
    },
    showList() {
      if (this.indexPage == 0) {
        this.MVList1();
      } else if (this.indexPage == 1) {
        this.MVList2();
      } else if (this.indexPage == 2) {
        this.MVList3();
      } else if (this.indexPage == 3) {
        this.MVList4();
      } else if (this.indexPage == 4) {
        this.MVList5();
      } else if (this.indexPage == 5) {
        this.MVList6();
      } else if (this.indexPage == 6) {
        this.MVList7();
      }
    },
    wxcTabPageCurrentTabSelected(e) {
      const self = this;
      const index = e.page;
      this.pageNo = 1;
      this.indexPage = index;
      if (index == 0 && this.videosTest1.length == 0) {
        this.MVList1();
      } else if (index == 1 && this.videosTest2.length == 0) {
        this.MVList2();
      } else if (index == 2 && this.videosTest3.length == 0) {
        this.MVList3();
      } else if (index == 3 && this.videosTest4.length == 0) {
        this.MVList4();
      } else if (index == 4 && this.videosTest5.length == 0) {
        this.MVList5();
      } else if (index == 5 && this.videosTest6.length == 0) {
        this.MVList6();
      } else if (index == 6 && this.videosTest7.length == 0) {
        this.MVList7();
      }
      /* 未加载tab模拟数据请求 */
      if (!Utils.isNonEmptyArray(self.tabList[index])) {
        setTimeout(() => {}, 100);
      }
    },
    tabSel(num) {
      if (num == 0) {
        this.one = "on";
        this.two = "";
        this.sort = "new";
      } else {
        this.one = "";
        this.two = "on";
        this.sort = "hot";
      }
      this.pageNo = 1;
      this.showList();
    },
    //mv广告位跳转
    pushWeb() {
      startNewWebView({ url: this.bannerUrl, hideTitle: "1" });
    }
  }
};
</script>

<style scoped>
.loading {
  width: 750;
  display: -ms-flex;
  display: -webkit-flex;
  display: flex;
  -ms-flex-align: center;
  -webkit-align-items: center;
  -webkit-box-align: center;
  align-items: center;
}
.MV {
  width: 750px;
  flex: 1;
  background-color: #fff;
  /*  padding-top:50px; */
}
.iconfont {
  font-family: iconfont;
}
.list-wrapper{
  padding-top:100px;
}
/*头部 开始*/
.header {
  height: 100px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
  position: relative;
}
.re_icon {
  color: #ee1c41;
  font-size: 45px;
  position: absolute;
  top: 30px;
  left: 30px;
}
.h-title {
  font-weight: bold;
  line-height: 100px;
  font-size: 36px;
}
/*头部 结束*/
.row {
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
}

.right {
  justify-content: flex-end;
}
.center {
  justify-content: center;
  align-items: center;
}
.on {
  color: #ff4563;
}
.tabTit {
  width: 750px;
  position: fixed;
  /*  top: 212px; */
  left: 0;
  height: 100px;
  background-color: #fff;
}
.search-title {
  font-size: 30px;
  margin-right: 20px;
  line-height: 100px;
}
.musicListBox {
  width: 750px;
  /*  height: 400px; */
  background-color: #fff;
}
.musicList {
  padding-left: 20px;
  padding-right: 5px;
  margin-top: 30px;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.musicList1 {
  padding-bottom: 120px;
}
.imgPlay {
  width: 335px;
  height: 189px;
  border-width: 1px;
  border-style: solid;
  border-color: #ccc;
}
.imgbg {
  position: absolute;
  top: 0;
  left: 0px;
  width: 335px;
  height: 189px;
}
.musicLi {
  margin-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
.playTitle {
  width: 335px;
  margin-top: 10px;
  font-size: 28px;
  lines: 1;
}
.icon {
  color: #fff;
  font-size: 80px;
}
.mark {
  position: absolute;
  left: 0px;
  top: 10px;
  width: 72px;
  height: 34px;
}
.markBg {
  position: absolute;
  width: 72px;
  height: 34px;
  background-color: #f51438;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}
.markTxt {
  line-height: 34px;
  font-size: 22px;
  color: #fff;
  lines: 1;
}
.video {
  position: absolute;
  left: 10px;
  bottom: 0px;
  align-items: center;
}
.videoImg {
  font-size: 50px;
  color: #fff;
  margin-right: 10px;
}
.videoNum {
  line-height: 40px;
  font-size: 30px;
  color: #fff;
}
.banner {
  width: 750px;
  /*height: 205px;*/
}
.banner-image {
  width: 750px;
  height: 205px;
  margin-top: 60px;
  margin-bottom: 30px;
  border-width: 1px;
  border-style: solid;
  border-color: #ccc;
}
</style>
