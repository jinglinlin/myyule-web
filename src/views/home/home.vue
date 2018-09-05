<template>
    <div class="home">
      <div :class="[source==='iOS'?'search':'active']">
          <div @click="toUserInfo()">
              <text class="iconfont icon icon0">&#xe66d;</text>
          </div>
          <div @click="toSearch()" class="searchText">
              <text class="iconfont sec-ico">&#xe6a8;</text>
              <text class="textFt">搜索关键字查找相关内容</text>
          </div>
          <text @click="open()" class="iconfont icon icon1">&#xe700;</text>
      </div>
      <!-- 切换 -->
      <wxc-tab-page ref="wxc-tab-page"
            :tab-titles="tabTitles"
            :tab-styles="tabStyles"
            title-type="text"
            :needSlider="needSlider"
            :is-tab-view="isTabView"
            :tab-page-height="tabPageHeight"
            @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
        <list 
              class="item-container"
              :style="{ height: tabPageHeight - tabStyles.height*2 + 'px' }">
              <!-- :style="{ height: tabPageHeight - tabStyles.height*2 - 120 + 'px' }"> -->
              <refresh class="refresh" @refresh="onrefresh" :display="refreshing ? 'show' : 'hide'">
                <loading-indicator class="indicator"></loading-indicator>
              </refresh>
              <cell>
                <recommend ref="recommend"></recommend>
              </cell>
        </list>         
        <list 
              class="item-container"
              :style="{ height: tabPageHeight - tabStyles.height*2 + 'px' }"
              @loadmore="nextPage" loadmoreoffset="60">
              <refresh class="refresh" @refresh="onrefresh" :display="refreshing ? 'show' : 'hide'">
                <loading-indicator class="indicator"></loading-indicator>
              </refresh>
              <cell class="hotWarp">
                  <div class="hot">
                      <hotBanner :activityList="activityList"></hotBanner>
                      <hotTopicDetail :hotTopic="hotTopic"></hotTopicDetail>
                  </div>
              </cell>
              <cell class="all-club-title">
                  <div @click="toggle()" class="title-wrapper">
                    <text class="title-text iconfont">{{clubTags === ''?'全部':clubTags}}部落 {{seletKey?'&#xe62c;':'&#xe62d;'}}</text>
                  </div>
                  <div v-if="seletKey" class="select-tag">
                    <text v-for="(item,index) in tagList" :class="['tag-item', 'btn-' + item.value]" @click="select(item)" :key="index">{{item.title}}</text>
                  </div>
              </cell>
              <clubList ref="club" v-for="(item,index) in clubData" :key="index" :item="item"></clubList>
              <cell class="paddingB" :style="{height: source==='iOS'?180:220 +'px'}"></cell>
        </list> 
      </wxc-tab-page>
      <!-- 侧栏 -->
      <userInfo ref="userInfo" :userInfo="userInfo"></userInfo>
      <!-- 每日首次登陆签到 -->
      <user-sign ref="sign" :missionData="missionData"></user-sign>
    </div>
</template>
<script>
import { WxcTabPage, WxcPanItem, Utils, WxcLoading } from "weex-ui";
import { getIndex } from "../../api/recommend";
import { openPlayer, toLogin, setMiniPlayerHidden } from "../../api/weex";
import { getClubList } from "../../api/club";
import { getTopic } from "../../api/topic";
import mixins from "../../mixins";
import hotBanner from "./recommend/hot-banner.vue";
import hotTopicDetail from "./recommend/hotTopicDetail.vue";
import clubList from "./tribe/clubList.vue";
import userInfo from "../userInfo/userInfo.vue";
import userSign from "./userSign/userSign.vue";
import recommend from "./recommend/recommend.vue";
import Config from "../../utils/config";
import { putUserSign, getUserInfo } from "../../api/userInfo";
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");

export default {
  mixins: [mixins],
  data() {
    return {
      hotTopic: [],
      refreshing: false,
      clubData: [],
      activityList: [],
      currentTab: "recommend",
      userInfo: [],
      pageNo: 1,
      show: false,
      seletKey: false,
      clubTags: "全部",
      missionData: [],
      indexData: [],
      tagList: [
        { title: "全部", value: "1" },
        { title: "音乐", value: "0" },
        { title: "公益", value: "0" },
        { title: "校友", value: "0" },
        { title: "同城", value: "0" },
        { title: "老友记", value: "0" },
        { title: "娱乐圈", value: "0" },
        { title: "原创", value: "0" },
        { title: "聚会", value: "0" },
        { title: "旅行", value: "0" },
        { title: "现场", value: "0" },
        { title: "其他", value: "0" }
      ],
      // 切换
      tabTitles: [{ title: "推荐" }, { title: "部落" }],
      tabStyles: Config.tabStyles2,
      tabList: [],
      needSlider: true,
      demoList: [1, 2],
      supportSlide: true,
      isTabView: true,
      tabPageHeight: 1334
    };
  },
  components: {
    WxcTabPage,
    recommend,
    userSign,
    hotBanner,
    userInfo,
    clubList,
    WxcLoading,
    hotTopicDetail
  },
  created() {
    // 用户信息
    // this.getUserInfoFn()
    this.request();
    this.tabPageHeight = Utils.env.getPageHeight();
    // modal.alert({message:this.tabPageHeight})
    this.tabList = [...Array(this.tabTitles.length).keys()].map(i => []);
    // Vue.set(this.tabList, 0, this.demoList);
  },
  mounted() {},
  methods: {
    // 下拉刷新中
    onrefresh(event) {
      this.refreshing = true;
      this.pageNo = 1;
      // 用户信息
      this.getUserInfoFn();
      this.request();
      this.$refs.recommend.request();
      setTimeout(() => {
        this.refreshing = false;
      }, 2000);
    },
    open() {
      openPlayer("player");
    },
    // 打开侧栏
    toUserInfo() {
      if (this.mobile === "") {
        toLogin({ loginOut: "0" });
      } else {
        this.$refs.userInfo.show();
      }
    },
    // 打开搜索
    toSearch() {
      // this.$refs.search.show();
      this.push2("/views/home/search/search", "");
    },
    nextPage() {
      this.pageNo += 1;
      this.fetchPage(this.pageNo);
    },
    // 加载下一页
    fetchPage(index) {
      this.clubList(this.clubTags, index);
      setTimeout(() => {}, 800);
    },
    // 全部部落筛选
    toggle() {
      if (this.seletKey) {
        this.seletKey = false;
      } else {
        this.seletKey = true;
      }
    },
    // 筛选
    select(item) {
      this.pageNo = 1;
      this.clubTags = item.title;
      this.tagList.forEach((value, index, array) => {
        value.value = "0";
      });
      item.value = "1";
      this.clubList(item.title, this.pageNo);
      this.toggle();
    },
    // 点击切换
    wxcTabPageCurrentTabSelected(e) {
      const self = this;
      const index = e.page;
      this.index = index;
      /* Unloaded tab analog data request */
      if (!Utils.isNonEmptyArray(self.tabList[index])) {
        // setTimeout(() => {
        //   Vue.set(self.tabList, index, self.demoList);
        // }, 100);
      }
    },
    // 蒙层
    openOverlay() {
      this.show = true;
    },
    // 初始化渲染
    request() {
      putUserSign({ mobile: this.mobile }, { token: this.mobile })
        .then(res => {
          if (res.status == 0) {
            this.missionData = res;
            // 签到窗口
            this.$refs.sign.show();
            this.show = true;
          } else {
            console.log(res.desc);
          }
        })
        .catch();

      // 获取首页资源
      getIndex({}, { token: this.mobile })
        .then(res => {
          if (res.status == 0) {
            this.indexData = res;
            res.object.forEach(value => {
              if (value.resType == "activity") {
                // 获取热门活动
                this.activityList = value.resData;
              }
            });
          } else {
            console.log(res.desc);
          }
        })
        .catch();
      // 获取热门话题
      getTopic({ pageNo: 1, pageSize: 2, sort: "hot" }, { mobile: this.mobile })
        .then(res => {
          if (res.status == 0) {
            this.hotTopic = res.object;
          } else {
            modal.alert({ message: res.desc });
          }
        })
        .catch();
      this.clubList(this.clubTags, this.pageNo);
    },
    // 获取用户信息
    getUserInfoFn() {
      getUserInfo(
        {
          mobile: this.mobile
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.userInfo = res.object;
            storage.setItem("userData", JSON.stringify(this.userInfo));
            storage.setItem("userIcon", res.object.icon);
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
    },
    // 部落列表
    clubList(tag, pageNo) {
      if (tag) {
        this.clubTags = tag;
      }
      getClubList(
        {
          clubTags: this.clubTags === "全部" ? [] : [this.clubTags],
          pageNo: pageNo,
          pageSize: 10,
          sort: "hot"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.clubData =
              pageNo > 1 ? this.clubData.concat(res.object) : res.object;
          } else {
            modal.toast({
              message: res.desc,
              duartion: 1
            });
          }
        })
        .catch();
    }
  }
};
</script>

<style scoped>
.iconfont {
  font-family: iconfont;
}
.paddingB {
  width: 750px;
  background-color: #fff;
}
.home {
  position: fixed;
  top: 0;
  width: 750px;
  left: 0;
  background-color: #ffffff;
}
.tab-title-list {
  justify-content: space-around;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
}
/* 顶部搜索框 */
.search {
  width: 750px;
  padding-top: 62px;
  flex-direction: row;
  justify-content: space-between;
  background-color: #fff;
}
.active {
  flex-direction: row;
  justify-content: space-between;
  background-color: #fff;
  padding-top: 20px;
}
.icon {
  padding-top: 4px;
  color: #ee1c41;
  font-weight: bold;
}
.icon0 {
  padding-left: 20px;
  padding-right: 25px;
  font-size: 48px;
}
.icon1 {
  padding-left: 25px;
  padding-right: 20px;
  font-size: 54px;
}
.searchText {
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;
  padding-left: 113px;
  padding-right: 113px;
  background-color: #ececec;
  border-radius: 100px;
}
.textFt {
  font-size: 24px;
  color: #ababab;
  padding-bottom: 13px;
  padding-top: 18px;
}
.sec-ico {
  font-size: 30px;
  margin-right: 18px;
  color: #ababab;
  padding-bottom: 10px;
  padding-top: 15px;
}
/*热门*/
.hotWarp {
  background-color: #fff;
}
/* tab切换 */
.tabNav {
  padding-top: 25px;
  padding-bottom: 19px;
  flex-direction: row;
  justify-content: center;
  background-color: #fff;
}
.tab {
  margin-left: 18px;
  font-size: 36px;
  color: #000;
}
/*当前选中转态*/
.tab-color {
  color: #ee1c41;
}
.item-container {
  width: 750px;
  background-color: #fff;
}

/* 标题 */
.all-club-title {
  width: 750px;
  box-shadow: 0 0 10px 10px #f6f6f6;
  margin-bottom: 10px;
  background-color: #fff;
}
.title-wrapper {
  width: 750px;
  height: 72px;
  flex-direction: row;
  align-items: center;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: auto;
  margin-right: auto;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
}
.title-text {
  width: 750px;
  line-height: 72px;
  text-align: center;
  font-size: 28px;
}
.select-tag {
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 45px;
  flex-direction: row;
  background-color: #fff;
  flex-wrap: wrap;
}
.tag-item {
  margin-top: 16px;
  margin-bottom: 16px;
  margin-left: 14px;
  margin-right: 14px;
  padding-left: 26px;
  padding-right: 26px;
  padding-top: 9px;
  padding-bottom: 9px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #ececec;
  font-size: 24px;
}
.btn-1 {
  color: #fff;
  background-color: #ee1c41;
}
.refresh {
  width: 750;
  display: -ms-flex;
  display: -webkit-flex;
  display: flex;
  -ms-flex-align: center;
  -webkit-align-items: center;
  -webkit-box-align: center;
  align-items: center;
}
.indicator {
  margin-top: 16px;
  height: 40px;
  width: 40px;
  color: #000;
}
</style>

