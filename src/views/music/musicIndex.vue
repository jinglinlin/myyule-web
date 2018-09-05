<template>
  <!-- <div class="musicIndex"> -->
  <div class="musicIndex">
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
      <scroller class="scroller">
        <refresh class="refresh" @refresh="onrefresh" :display="refreshing ? 'show' : 'hide'">
          <loading-indicator class="indicator"></loading-indicator>
        </refresh>
        <!-- banner -->
        <div class="banner">
            <YxSlider :imageList="swiperList" type="banner"></YxSlider>
        </div>
        <div class="btn" @click="applyMusician()"><text class="btn-text">申请发行</text></div>
        <!-- 排行榜 -->
        <rankingList :rankList="rankList" limit="3"></rankingList>
        <div class="content">
          <!-- 音乐上架 -->
          <imgList :musicList="musicList" title="单曲上架"></imgList>
          <!-- 专辑上架 -->
          <authorRecommend :albumList="albumList" title="专辑上架"></authorRecommend>
          <!-- 最新MV -->
          <newMV :mvList="mvList"></newMV>
        </div>
        <!-- 侧栏 -->
        <userInfo ref="userInfo" :userInfo="userInfo"></userInfo>
      </scroller>
  </div>
</template>
<script>
import mixins from "../../mixins";
import YxSlider from "../home/recommend/YXSlider.vue";
import rankingList from "../home/recommend/rankingList.vue";
import authorRecommend from "../home/recommend/authorRecommend.vue";
import imgList from "../home/recommend/imgList.vue";
import newMV from "./newMV.vue";
import { getMusicIndex } from "../../api/music";
import { getBanner } from "../../api/recommend";
import { getIntroduce, getUserInfo } from "../../api/userInfo";
import userInfo from "../userInfo/userInfo.vue";
import { openPlayer, toLogin } from "../../api/weex";
var storage = weex.requireModule("storage");
var modal = weex.requireModule("modal");
export default {
  mixins: [mixins],
  components: {
    userInfo,
    YxSlider,
    rankingList,
    imgList,
    authorRecommend,
    newMV
  },
  data() {
    return {
      refreshing: false,
      swiperList: [],
      rankList: [],
      musicList: [],
      albumList: [],
      userInfo: [],
      mvList: []
    };
  },
  beforeCreate(){
    var domModule = weex.requireModule("dom");
    domModule.addRule("fontFace", {
      fontFamily: "iconfont",
      // src: "url('http://at.alicdn.com/t/font_580422_62vodh0mkakyb9.ttf')"
      src: "url('https://myyule.teamshub.com/web-icon/font/font_580422_62vodh0mkakyb9.ttf')"
    });
  },
  created() {
    this.request();
  },
  mounted(){
    this.putPageUrlLog(1002)
  },
  methods: {
    // 下拉刷新中
    onrefresh (event) {
      this.refreshing = true
      this.request()
      setTimeout(() => {
        this.refreshing = false
      }, 2000)
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
    toSearch() {
      this.push2('/views/home/search/search','')
    },
    request() {
      // 获取首页推荐轮播图资源
      getBanner(
        {
          bannerType: "music"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.swiperList = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch();
      // 用户信息
      getUserInfo(
        {
          mobile: this.mobile
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.userInfo = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
      // 获取首页资源
      getMusicIndex({}, { token: this.mobile })
        .then(res => {
          if (res.status == 0) {
            res.object.forEach(value => {
              if (value.resType == "song") {
                // 获取音乐
                this.musicList = value.resData;
              } else if (value.resType == "songAlbum") {
                // 获取专辑
                this.albumList = value.resData;
              } else if (value.resType == "rank") {
                // 获取音乐排行榜
                this.rankList = value.resData;
              }  else if (value.resType == "video") {
                // 获取MV
                this.mvList = value.resData;
              }
            });
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    applyMusician() {
      if (!this.isShow) {
        this.isShow = true;
        getIntroduce(
          {
            introduceType: "song_publish"
          },
          { token: this.mobile }
        )
          .then(res => {
            this.isShow = false;
            if (res.status == 0) {
              modal.alert({
                message: res.object.content,
                duration: 1
              });
            } else {
              modal.toast({
                message: res.desc,
                duration: 1
              });
              console.log(res.desc);
            }
          })
          .catch(err => {});
      }
    }
  }
};
</script>
<style scoped>
.iconfont {
  font-family: iconfont;
}

.scroller {
  /* height:1219px; */
  flex: 1;
  padding-top: 20px;
}
.musicIndex {
  position: fixed;
  top: 0;
  width: 750px;
  left: 0;
  /* height: 1284px; */
  background-color: #fff;
}
/* 顶部搜索框 */
.search {
  flex-direction: row;
  justify-content: space-between;
  background-color: #fff;
  padding-top: 62px;
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
/* .icon {
  padding-top: 4px;
  color: #ee1c41;
  font-weight: bold;
}
.icon0 {
  padding-left: 20px;
  padding-right: 45px;
  font-size: 48px;
  padding-bottom:12px;
}
.icon1 {
  padding-left: 45px;
  padding-right: 20px;
  font-size: 54px;
  padding-bottom:12px;
} */
.searchText {
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
.btn {
  background-color: #ee1c41;
  width: 220px;
  height: 68px;
  margin-top: 23px;
  margin-bottom: 29px;
  margin-left: 265px;
  margin-right: 265px;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
}
.btn-text {
  width: 220px;
  color: #fff;
  font-size: 26px;
  line-height: 68px;
  text-align: center;
}
.content {
  padding-left: 20px;
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
