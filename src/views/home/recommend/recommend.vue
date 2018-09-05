<template>
    <div class="recommend">
        <div class="banner">
            <YxSlider :imageList="swiperList" type="banner"></YxSlider>
        </div>
        <!--最新消息展示-->
        <slider v-if="msgList.length>0"  class="msg-wrapper" interval="300000" auto-play="true">
            <div v-for="(item,index) in msgList" @click="path(item)" :key="index" class="msg">
                <text class="iconfont msg-icon">&#xe807;</text>
                <!-- <text v-if="item.user" class="msg-text">Myyule快报：{{item.user.nickName}}最新发表了{{item.resType==='activity'?'新活动':''}}{{item.resType==='song'?'原创音乐':''}}{{item.resType==='songAlbum'?'新专辑':''}}</text> -->
                <text v-if="item.user" class="msg-text">Myyule快报：最新发布了#{{item.topicTags[0]}}#{{item.topicTags[1]?('#'+item.topicTags[1]+'#'):''}}{{item.topicTags[2]?('#'+item.topicTags[2]+'#'):''}}新话题</text>
            </div>
        </slider >
        <!--热门-->
        <div class="hotWarp">
            <div class="pushGift">
                <div @click="playDailySong()" class="push">
                    <text class="pu-text">今日专题歌单</text>
                    <text class="iconfont pu-icon">&#xe626;</text>
                </div>
                <text @click="brith" class="iconfont gift">&#xe618;</text>
                <!--<text @click="push2('/views/userInfo/myPoint','')" class="iconfont gift">&#xe618;</text>-->
            </div>
            <div class="hot">
                <hotBanner :activityList="activityList"></hotBanner>
            </div>
            <!--广告1-->
            <poster :poster="posone"></poster>
        </div>
        <!--原创首发推荐...-->
        <div class="newWarp">
            <!-- <text class="n-original">原创首发推荐</text> -->
            <div class="n-banner">
                <imgList :musicList="musicList"></imgList>
                <authorRecommend :albumList="albumList"></authorRecommend>
            </div>
            <!--广告2-->
            <poster :poster="postwo"></poster>
            <!-- 音乐排行 -->
            <rankingList :rankList="rankList"></rankingList>
        </div>
        <!--音乐人-->
        <div class="music">
            <!-- <div class="h-title">
                <text class="h-txt">幕后音乐英雄</text>
                <div @click="push('/views/home/lookMore/musicianList','')" class="rt-text">
                    <text class="iconfont h-icon m-icon" @click="change('user')">&#xe62e; 换一换</text>
                    <text class="iconfont h-icon">更多&#xe656;</text>
                </div>
            </div> -->
            <musician :musician="musician"></musician>
        </div>
        <div class="topic-wrapper">
            <!--广告3-->
            <poster :poster="posthree"></poster>
            <div class="h-title">
                <text class="h-txt">热门话题榜</text>
                <div @click="push('/views/home/lookMore/topicListMore','')" class="rt-text">
                    <text class="iconfont h-icon m-icon" @click="change('topicTag')">&#xe62e; 换一换</text>
                    <text class="iconfont h-icon">更多&#xe656;</text>
                </div>
            </div>
            <hotTopic :hotTopic="hotTopic"></hotTopic>
        </div>
        <!-- 部落 -->
        <div class="club">
          <div class="h-title">
              <text class="h-txt">部落联盟</text>
              <div @click="push('/views/home/moreClub/moreClub','')" class="rt-text">
                  <text class="iconfont h-icon m-icon" @click="change('club')">&#xe62e; 换一换</text>
                  <text class="iconfont h-icon">更多&#xe656;</text>
              </div>
          </div>
          <clubUnion :clubUnion="popular"></clubUnion>
        </div>
        <!-- 潮看 -->
        <div class="mv-wrapper">
          <div class="h-title">
              <text class="h-txt">潮看</text>
              <div @click="push('/views/home/lookMore/MV','')" class="rt-text">
                  <text class="iconfont h-icon">更多&#xe656;</text>
              </div>
          </div>
          <div class="banner">
              <YxSlider :imageList="MvList" type="mv"></YxSlider>
          </div>
        </div>
        <div class="paddingB" :style="{height: source==='iOS'?180:220 +'px'}"></div>
        <wxc-loading :show="isShow"></wxc-loading>
    </div>
</template>

<script>
import {
  getBanner,
  getIndexNotice,
  getIndex,
  getAdv,
  getRankInfo,
  getIndexChange,
  getDailySong,
  getUserRelation,
  getSongInfo
} from "../../../api/recommend";
import { getClubList,getClub_Res } from "../../../api/club";
import {
  playDailySong,
  playStatus,
  stopMusic,
  openPlayer,
    toLogin
} from "../../../api/weex";
import { WxcLoading } from "weex-ui";
import YxSlider from "./YXSlider.vue";
import hotBanner from "./hot-banner.vue";
import imgList from "./imgList.vue";
import authorRecommend from "./authorRecommend.vue";
import poster from "./poster.vue";
import rankingList from "./rankingList.vue";
import musician from "./musician.vue";
import clubUnion from "./clubUnion.vue";
import hotTopic from './hotTopic.vue';
import mixins from "../../../mixins";
import { startNewWebView, startNewWEeexView } from "../../../api/weex";
const navigator = weex.requireModule("navigator");
const stream = weex.requireModule("stream");
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");

export default {
  mixins: [mixins],
  name: "recommend",
  components: {
    WxcLoading,
    YxSlider,
    hotBanner,
    imgList,
    authorRecommend,
    poster,
    rankingList,
    musician,
    clubUnion,
    hotTopic
  },
  data() {
    return {
      playStatus: 0,
      isShow: false,
      commonUrl: "",
      songList: [],
      swiperList: [],
      msgList: [],
      activityList: [],
      musicList: [],
      musicianAll:[],
      musicianUser:[],
      musicianSchool:[],
      musicianCommunity:[],
      albumList: [],
      rankList: [],
      musician: [],
      MvList: [],
      popular: [],
      posone: [],
      postwo: [],
      posthree:[],
      hotTopic: []
    };
  },
  mounted() {
    this.request();
    this.getPlayerStatus();
  },
  watch() {
    modal.toast({ message: 1 });
    storage.getItem("reflesh", event => {
      if (event.data === "undefined" || event.data === "") {
      } else {
        this.request();
        storage.removeItem("reflesh");
      }
    });
  },
  methods: {
    // 资源请求
    request() {
      // 获取首页推荐轮播图资源
      getBanner({ bannerType: "index" }, { token: this.mobile })
        .then(res => {
          if (res.status == 0) {
            this.swiperList = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch();
      // 获取快报动态公告
      // getIndexNotice({}, { token: this.mobile })
      //   .then(res => {
      //     if (res.status == 0) {
      //       this.msgList = res.object;
      //     } else {
      //       console.log(res.desc);
      //     }
      //   })
      //   .catch();
      getClub_Res({resType:'topic',pageSize:5,pageNo:1,clubId:'1742148'}).then(res=>{
        if(res.status==0){
          this.msgList = res.object;
        }else{
          modal.alert({message:res.desc})
        }
      }).catch()
      // 获取首页资源
      getIndex({}, { token: this.mobile })
        .then(res => {
          if (res.status == 0) {
            console.log(res.object)
            res.object.forEach(value => {
              if (value.resType == "activity") {
                // 获取热门活动
                this.activityList = value.resData;
              } else if (value.resType == "song") {
                // 获取音乐
                this.musicList = value.resData;
              } else if (value.resType == "songAlbum") {
                // 获取专辑
                this.albumList = value.resData;
              } else if (value.resType == "rank") {
                // 获取音乐排行榜
                this.rankList = value.resData;
              } else if (value.resType == "user") {
                // 获取音乐人
                this.musicianUser = value.resData;
                console.log(this.musicianUser)
              } else if (value.resType == "musician_all") {
                // 获取幕后音乐英雄
                this.musicianAll = value.resData;
              } else if (value.resType == "musician_school") {
                // 获取校园里音乐人
                this.musicianSchool = value.resData;
              } else if (value.resType == "musician_community") {
                // 获取校园外音乐人
                this.musicianCommunity = value.resData;
              } else if (value.resType == "club") {
                // 获取人气粉丝团
                this.popular = value.resData;
              } else if (value.resType == "video") {
                // 获取MV
                this.MvList = value.resData;
              }else if (value.resType == "topicTag") {
                // 获取话题
                this.hotTopic = value.resData;
              }
              // this.musician=[this.musicianAll,this.musicianSchool,this.musicianCommunity]
            });
            this.musician = [this.musicianUser.splice(0,4),this.musicianUser.splice(0,4),this.musicianUser.splice(0,4)]
            console.log(this.musician)
          } else {
            console.log(res.desc);
          }
        })
        .catch();
      // 获取广告1
      getAdv({ adType: "index1" }, { token: this.mobile })
        .then(res => {
          if (res.status == 0) {
            this.posone = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch();
      // 获取广告2
      getAdv({ adType: "index2" }, { token: this.mobile })
        .then(res => {
          if (res.status == 0) {
            this.postwo = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch();
      // 获取广告3
      getAdv({ adType: "index3" }, { token: this.mobile })
        .then(res => {
          if (res.status == 0) {
            this.posthree = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch();
      // 获取推荐歌曲id
      getDailySong({}, { token: this.mobile })
        .then(res => {
          if (res.status == 0) {
            this.songList = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    // 换一换
    change(resType) {
      if (!this.isShow) {
        this.isShow = true;
        getIndexChange(
          {
            resType: resType
          },
          { token: this.mobile }
        )
          .then(res => {
            if (res.status == 0) {
              this.isShow = false;
              if (resType === "user") {
                this.musician = res.object[0].resData;
              } else if (resType === "club") {
                this.popular = res.object[0].resData;
                console.log(this.popular);
              }else if (resType === "topicTag") {
                this.hotTopic = res.object[0].resData;
                console.log(this.hotTopic);
              }
            } else {
              console.log(res.desc);
            }
          })
          .catch();
      }
    },
    // 获取播放状态
    getPlayerStatus() {
      this.playStatus = playStatus();
    },
    // 播放音乐列表
    playDailySong() {
      if (this.playStatus == 0) {
        // this.playStatus = 1;
        playDailySong(this.songList);
      } else {
        this.playStatus = 0;
        stopMusic();
      }
    },
    // 通知
    path(item) {
      this.push2('/views/topic/topic_detail',{resId:item.resId})
      // if (item.resType === "activity") {
      //   this.push2("/views/activity/active_layout/active_detail", {
      //     resId: item.resId
      //   });
      // } else if (item.resType === "song") {
      //   getSongInfo({ resId: item.resId }, { token: this.mobile })
      //     .then(res => {
      //       if (res.status == 0) {
      //         console.log("Ok");
      //         playDailySong(res.object);
      //         openPlayer("player");
      //       } else {
      //         console.log(res.desc);
      //       }
      //     })
      //     .catch();
      // } else if (item.resType === "songAlbum") {
      //   this.push2("/views/home/lookMore/featureList", {
      //     resId: item.resId,
      //     resType: "songAlbum"
      //   });
      // }
    },
      //跳转乐比积分页面
      brith() {
          if (!this.mobile || this.mobile == "") {
              toLogin({ loginOut: "0" });
              return;
          }
          this.push2("/views/userInfo/myPoint");
      },
  }
};
</script>

<style scoped>
.paddingB{
  width:750px;
  background-color:#fff;
}
.iconfont {
  font-family: iconfont;
}
.recommend {
  width: 750px;
  background-color: #ececec;
}
/*轮播*/
/*最新消息*/
.msg-wrapper {
  width: 750px;
  height: 81px;
  margin-bottom: 12px;
  overflow: hidden;
}
.msg {
  width: 750px;
  background-color: #fff;
  flex-direction: row;
}
.msg-icon {
  width: 22px;
  height: 22px;
  margin-top: 29px;
  margin-bottom: 24px;
  margin-right: 15px;
  margin-left: 20px;
  font-size: 24px;
  color: #000;
}
.msg-text {
  font-size: 26px;
  color: #000;
  margin-top: 26px;
  margin-bottom: 20px;
  margin-right: 20px;
  lines:1;
  width:685px;
  text-overflow: ellipsis;
}
/*热门*/
.hotWarp {
  background-color: #fff;
}
.pushGift {
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
}
.push {
  width: 267px;
  height: 80px;
  margin-top: 25px;
  margin-bottom: 18px;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;
  background-color: #ee1c41;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.pu-text {
  font-size: 26px;
  color: #fff;
  margin-right: 10px;
}
.pu-icon {
  font-size: 45px;
  color: #fff;
  margin-top: 8px;
}
.gift {
  font-size: 60px;
  margin-right: 60px;
  color: #ee1c41;
}
/*最新上架*/
.newWarp {
  background-color: #fff;
  padding-top: 12px;
}
.n-original {
  font-size: 32px;
  color: #000;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 40px;
  margin-bottom: 30px;
}
.n-banner {
  margin-left: 20px;
}
/*音乐人*/
.music {
  margin-top: 12px;
  background-color: #fff;
}
.topic-wrapper {
  margin-bottom: 12px;
  background-color: #fff;
}
.mv-wrapper,.club{
  background-color: #fff;
}
/*标题与更多*/
.h-title {
  flex-direction: row;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 15px;
  padding-top: 34px;
  padding-bottom: 34px;
}
.h-txt {
  color: #000;
  font-size: 32px;
}
.h-icon {
  font-size: 28px;
  color: #666;
  margin-right: 20px;
}
.rt-text {
  flex-direction: row;
}
</style>