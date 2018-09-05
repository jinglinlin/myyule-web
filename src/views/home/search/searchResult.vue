<template>
  <div v-if="reslutKey" class="searchResult">
    <wxc-loading :show="isShow"></wxc-loading>
    <wxc-tab-page ref="wxc-tab-page"
          :tab-titles="tabTitles"
          :tab-styles="tabStyles"
          title-type="text"
          :needSlider="needSlider"
          :is-tab-view="isTabView"
          :tab-page-height="tabPageHeight"
          @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
      <!-- 音乐 -->
      <list 
            class="item-container"
            :style="{ height: (tabPageHeight - tabStyles.height) + 'px' }"
            @loadmore="nextPage" loadmoreoffset="600">
            <cell v-for="(item,index) in musicList" :key="index" >
              <music-result :item="item" :keyWord="keyWord"></music-result>
            </cell>
            <!-- 空白提示 -->
            <cell class="empty-wrapper">
              <image v-if="musicList.length==0" resize="contain" class="empty" :src="imgUrl+'empty.png'"></image>
            </cell>
      </list>  
      <!-- 专辑   -->
      <list 
            class="item-container"
            :style="{ height: (tabPageHeight - tabStyles.height) + 'px' }"
            @loadmore="nextPage" loadmoreoffset="600">
            <cell v-for="(item,index) in albumList" :key="index" >
              <music-result :item="item" :keyWord="keyWord"></music-result>
            </cell>
            <!-- 空白提示 -->
            <cell class="empty-wrapper">
              <image v-if="albumList.length==0" resize="contain" class="empty" :src="imgUrl+'empty.png'"></image>
            </cell>
      </list>  
      <!-- 部落 -->
      <list 
            class="item-container"
            :style="{ height: (tabPageHeight - tabStyles.height) + 'px' }"
            @loadmore="nextPage" loadmoreoffset="600">
            <cell v-for="(item,index) in clubList" :key="index" >
              <club-result :item="item" :keyWord="keyWord"></club-result>
            </cell>
            <!-- 空白提示 -->
            <cell class="empty-wrapper">
              <image v-if="clubList.length==0" resize="contain" class="empty" :src="imgUrl+'empty.png'"></image>
            </cell>
      </list>  
      <!-- 用户-->
      <list 
            class="item-container"
            :style="{ height: (tabPageHeight - tabStyles.height) + 'px' }"
            @loadmore="nextPage" loadmoreoffset="600">
            <cell v-for="(item,index) in userList" :key="index" >
              <user-result :item="item" :keyWord="keyWord"></user-result>
            </cell>
            <!-- 空白提示 -->
            <cell class="empty-wrapper">
              <image v-if="userList.length==0" resize="contain" class="empty" :src="imgUrl+'empty.png'"></image>
            </cell>
      </list>  
      <!-- 活动 -->
      <list 
            class="item-container"
            :style="{ height: (tabPageHeight - tabStyles.height) + 'px' }"
            @loadmore="nextPage" loadmoreoffset="600">
            <cell v-for="(item,index) in activityList" :key="index" >
              <activity-result :item="item" :keyWord="keyWord"></activity-result>
            </cell>
            <!-- 空白提示 -->
            <cell class="empty-wrapper">
              <image v-if="activityList.length==0" resize="contain" class="empty" :src="imgUrl+'empty.png'"></image>
            </cell>
      </list>
      <!-- 话题 -->
      <list 
            class="item-container"
            :style="{ height: (tabPageHeight - tabStyles.height) + 'px' }"
            @loadmore="nextPage" loadmoreoffset="600">
            <cell v-for="(item,index) in topicList" :key="index" >
              <topic-result :item="item" :keyWord="keyWord"></topic-result>
            </cell>
            <!-- 空白提示 -->
            <cell class="empty-wrapper">
              <image v-if="topicList.length==0" resize="contain" class="empty" :src="imgUrl+'empty.png'"></image>
            </cell>
      </list>
    </wxc-tab-page>
  </div>
</template>
<script>
import { WxcTabPage, WxcPanItem, Utils, WxcLoading } from "weex-ui";
import { getSearch } from "../../../api/recommend";
import Config from "../../../utils/config";
import musicResult from "./musicResult.vue";
import clubResult from "./clubResult.vue";
import userResult from "./userResult.vue";
import activityResult from "./activityResult.vue";
import topicResult from "./topicResult.vue";
import mixins from "../../../mixins";
var storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");

export default {
  mixins: [mixins],
  components: {
    WxcTabPage,
    musicResult,
    clubResult,
    userResult,
    WxcLoading,
    activityResult,
    topicResult
  },
  props: {
    value: {}
  },
  data() {
    return {
      isShow: false,
      indexPage: 0,
      keyWord: "",
      pageNo: 1,
      reslutKey: true, // 搜索二级展示
      musicList: [],
      albumList: [],
      clubList: [],
      userList: [],
      activityList: [],
      topicList:[],
      // 切换
      tabTitles: Config.tabTitles,
      tabStyles: Config.tabStyles5,
      tabList: [],
      needSlider: true,
      demoList: [1, 2, 3, 4, 5],
      supportSlide: true,
      isTabView: true,
      tabPageHeight: 1334,
      oldVal:'',
      curVal:''
    };
  },
  watch: {
    value(curVal, oldVal) {
      this.curVal = curVal
      this.oldVal = oldVal
    }
  },
  created() {
    this.tabPageHeight = Utils.env.getPageHeight();
    this.tabList = [...Array(this.tabTitles.length).keys()].map(i => []);
    // Vue.set(this.tabList, 0, this.demoList);
    // 获取音乐
  },
  methods: {
    show() {
      this.reslutKey = true;
      if (this.indexPage == 0) {
        this.searchMusic();
      } else if (this.indexPage == 1) {
        this.searchAlbum();
      } else if (this.indexPage == 2) {
        this.searchClub();
      } else if (this.indexPage == 3) {
        this.searchUser();
      } else if (this.indexPage == 4) {
        this.searchActivity();
      }else if (this.indexPage == 5) {
        this.searchTopic();
      }
    },
    wxcTabPageCurrentTabSelected(e) {
      const self = this;
      const index = e.page;
      this.pageNo = 1;
      this.indexPage = index;
      if (
        index == 0 &&
        (this.musicList.length == 0 || this.oldVal !== this.curVal)
      ) {
        this.searchMusic();
      }else if (
        index == 1 &&
        (this.albumList.length == 0 || this.oldVal !== this.curVal)
      ) {
        this.searchAlbum();
      } else if (
        index == 2 &&
        (this.clubList.length == 0 || this.oldVal !== this.curVal)
      ) {
        this.searchClub();
      } else if (
        index == 3 &&
        (this.userList.length == 0 || this.oldVal !== this.curVal)
      ) {
        this.searchUser();
      } else if (
        index == 4 &&
        (this.activityList.length == 0 || this.oldVal !== this.curVal)
      ) {
        this.searchActivity();
      }else if (
        index == 5 &&
        (this.topicList.length == 0 || this.oldVal !== this.curVal)
      ) {
        this.searchTopic();
      }
      /* Unloaded tab analog data request */
      if (!Utils.isNonEmptyArray(self.tabList[index])) {
        setTimeout(() => {
          // Vue.set(self.tabList, index, self.demoList);
        }, 100);
      }
    },
    // 下一页
    nextPage(event) {
      if (!this.isShow) {
        this.pageNo += 1;
        this.show();
      }
    },
    // 搜索音乐
    searchMusic() {
      if(this.curVal!==''){
      this.isShow = true;
      if(this.oldVal !== this.curVal){
        this.pageNo==1
      }
      getSearch(
        {
          key: this.curVal,
          resType: "song",
          pageNo: this.pageNo,
          pageSize: 10
        },
        { token: this.mobile }
      )
        .then(res => {
          this.isShow = false;
          if (res.status == 0) {
            if(this.pageNo==1){
              this.musicList = []
            }
            this.musicList =
              this.pageNo > 1 ? this.musicList.concat(res.object) : res.object;
              this.keyWord = this.curVal;
          } else {
            modal.toast({
              message: res.desc,
              duartion: 1
            });
            this.isShow = false
            console.log(res.desc);
          }
        })
        .catch();
        }
    },
    // 搜索专辑
    searchAlbum() {
      if(this.curVal!==''){
      this.isShow = true;
      if(this.oldVal !== this.curVal){
        this.pageNo==1
      }
      getSearch(
        {
          key: this.curVal,
          resType: "songAlbum",
          pageNo: this.pageNo,
          pageSize: 10
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            if(this.pageNo==1){
              this.albumList = []
            }
            this.albumList =
              this.pageNo > 1 ? this.albumList.concat(res.object) : res.object;
            this.keyWord = this.curVal;
          } else {
            this.isShow = false
            console.log(res.desc);
          }
        })
        .catch();
      }
    },
    // 搜索部落
    searchClub() {
      if(this.curVal!==''){
      this.isShow = true;
      if(this.oldVal !== this.curVal){
        this.pageNo==1
      }
      getSearch(
        {
          key: this.curVal,
          resType: "club",
          pageNo: this.pageNo,
          pageSize: 10
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            if(this.pageNo==1){
              this.clubList = []
            }
            this.clubList =
              this.pageNo > 1 ? this.clubList.concat(res.object) : res.object;
            this.keyWord = this.curVal;
          } else {
            this.isShow = false
            console.log(res.desc);
          }
        })
        .catch();
      }
    },
    // 搜索用户
    searchUser() {
      if(this.curVal!==''){
      this.isShow = true;
      if(this.oldVal !== this.curVal){
        this.pageNo==1
      }
      getSearch(
        {
          key: this.curVal,
          resType: "user",
          pageNo: this.pageNo,
          pageSize: 10
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            if(this.pageNo==1){
              this.userList = []
            }
            this.userList =
              this.pageNo > 1 ? this.userList.concat(res.object) : res.object;
            this.keyWord = this.curVal;
          } else {
            this.isShow = false;
            console.log(res.desc);
          }
        })
        .catch();
      }
    },
    // 搜索用户
    searchActivity() {
      if(this.curVal!==''){
      this.isShow = true;
      if(this.oldVal !== this.curVal){
        this.pageNo==1
      }
      getSearch(
        {
          key: this.curVal,
          resType: "activity",
          pageNo: this.pageNo,
          pageSize: 10
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            if(this.pageNo==1){
              this.activityList = []
            }
            this.activityList =
              this.pageNo > 1
                ? this.activityList.concat(res.object)
                : res.object;
            this.keyWord = this.curVal;
          } else {
            this.isShow = false
            console.log(res.desc);
          }
        })
        .catch();
      }
    },
    // 搜索用户
    searchTopic() {
      if(this.curVal!==''){
      this.isShow = true;
      if(this.oldVal !== this.curVal){
        this.pageNo==1
      }
      getSearch(
        {
          key: this.curVal,
          resType: "topicTag",
          pageNo: this.pageNo,
          pageSize: 10
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            if(this.pageNo==1){
              this.topicList = []
            }
            this.topicList =
              this.pageNo > 1
                ? this.topicList.concat(res.object)
                : res.object;
            this.keyWord = this.curVal;
          } else {
            this.isShow = false
            console.log(res.desc);
          }
        })
        .catch();
      }
    }
  }
};
</script>
<style src="../../../assets/style/index.scss">
</style>
<style scoped>
.searchResult {
  width: 750px;
  background-color: #fff;
}
/* 公共样式 */
.color-pink {
  color: #ee1c41;
}
.color-gray {
  columns: #666666;
}
.font-26 {
  font-size: 26px;
  line-height: 26px;
}
.font-28 {
  font-size: 28px;
  line-height: 28px;
  padding-top: 10px;
  padding-bottom: 13px;
}
/* 切换样式 */
.item-container {
  position: relative;
  width: 750px;
  background-color: #fff;
  justify-content: center;
  align-items: center;
}
.border-cell {
  background-color: #f2f3f4;
  width: 750px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: #e0e0e0;
}
.cell {
  background-color: #ffffff;
}
.content {
  width: 750px;
  height: 300px;
  border-bottom-width: 1px;
  align-items: center;
  justify-content: center;
}
.empty {
  width: 300px;
  height: 213px;
  margin-top:300px;
}
.empty-wrapper{
  width: 750px;
  height: 1140px;
  align-items: center;
}
</style>
