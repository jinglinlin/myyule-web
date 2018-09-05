<template>
  <div class="myPlaceNormal">
    <scroller class="scroller" :style="{ height: tabPageHeight2- (iMobile !== mobile?120:0) + 'px' }"
                @loadmore="fetchPage" loadmoreoffset="60">
    <div class="wrapper">
      <div class="user-msg">
        <image class="bg" resize="cover" :src="userInfo.icon?('http://media2.myyule.cn/'+userInfo.icon):(imgUrl+'userIconBg.png')" :placeholder="imgUrl+'userIconBg.png'"></image>
        <image class="circle-bg" resize="cover" :src="imgUrl+'circle-bg.png'"></image>
        <div class="user-detail">
          <div class="user-img">
            <image class="img-vip" resize="cover" :src="userInfo.icon?('http://media2.myyule.cn/'+userInfo.icon):(imgUrl+'userIcon.png')" :placeholder="imgUrl+'userIcon.png'"></image>
          </div>
          <text class="user-name font-28">{{userInfo.nickname}}</text>
        </div>
      </div>
      <text class="user-school">{{userInfo.schoolName}}</text>
      <div class="recommend-club">
        <text class="title">兴趣部落</text>
        <div class="list-wrapper">
          <div v-for="(item,index) in followClub" @click="push2('/views/club/club_layout', { clubId: item.clubId })" :key="index" class="item">
            <div class="item-img">
              <image class="pic" resize="cover" :src="(item.clubLogo.substr(0,4)==='http'?'':'http://media2.myyule.cn/')+item.clubLogo" alt="" ></image>
            </div>
            <text class="clubName">{{item.clubName}}</text>
          </div>
        </div>
      </div>
      <wxc-tab-page ref="wxc-tab-page"
            :tab-titles="iMobile === mobile?tabTitles:tabTitles1"
            :tab-styles="tabStyles"
            title-type="text"
            :needSlider="needSlider"
            :is-tab-view="isTabView"
            :tab-page-height="tabPageHeight"
            wrap-bg-color="#fff"
            @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
        <!-- 动态 -->
        <div class="item-container">
          <wxc-tab-page ref="wxc-tab-page2"
                :tab-titles="tabTitles2"
                :tab-styles="tabStyles"
                title-type="text"
                :needSlider="needSlider"
                :is-tab-view="isTabView"
                :tab-page-height="tabPageHeight"
                wrap-bg-color="#fff"
                @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected2">
            <div class="item-container">
              <lottery-notice :activityData="activityData1_1"></lottery-notice>
            </div>
            <div class="item-container">
              <lottery-notice :activityData="activityData1_2"></lottery-notice>
            </div>
          </wxc-tab-page>
        </div>

        <!-- 我发布的 -->
        <div class="item-container">
          <wxc-tab-page ref="wxc-tab-page3"
                :tab-titles="tabTitles3"
                :tab-styles="tabStyles"
                title-type="text"
                :needSlider="needSlider"
                :is-tab-view="isTabView"
                :tab-page-height="tabPageHeight"
                wrap-bg-color="#fff"
                @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected3">
            <div class="item-container">
              <lottery-notice :activityData="activityData2_1" isType="my"></lottery-notice>
            </div>
            <div class="item-container">
              <club-music :resData="activityData2_2"></club-music>
            </div>
            <div class="item-container">
              <lottery-notice :activityData="create_topic" isType="topic"></lottery-notice>
            </div>
          </wxc-tab-page>
        </div>

        <!-- 我参与的 -->
        <div class="item-container">
          <lottery-notice :activityData="activityData3"></lottery-notice>
        </div>

        <!-- 部落 -->
        <div class="item-container">
          <wxc-tab-page ref="wxc-tab-page4"
                :tab-titles="tabTitles4"
                :tab-styles="tabStyles"
                title-type="text"
                :needSlider="needSlider"
                :is-tab-view="isTabView"
                :tab-page-height="tabPageHeight"
                wrap-bg-color="#fff"
                @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected5">
            <div class="item-container">
              <my-club :clubData="activityData5_1"></my-club>
            </div>
            <div class="item-container">
              <my-club :clubData="activityData5_2"></my-club>
            </div>
          </wxc-tab-page>
        </div>

        <!-- 我的收藏 -->
        <div class="item-container">
          <wxc-tab-page ref="wxc-tab-page4"
                :tab-titles="tabTitles3"
                :tab-styles="tabStyles"
                title-type="text"
                :needSlider="needSlider"
                :is-tab-view="isTabView"
                wrap-bg-color="#fff"
                :tab-page-height="tabPageHeight"
                @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected4">
            <div class="item-container">
              <collect-notice :activityData="activityData4_1"></collect-notice>
            </div>
            <div class="item-container">
              <club-music :resData="activityData4_2"></club-music>
            </div>
            <div class="item-container">
              <collect-notice :activityData="collection_topic" isType="topic"></collect-notice>
            </div>
          </wxc-tab-page>
        </div>

        <!-- 卡卷 -->
        <div v-if="iMobile === mobile" class="item-container">
          <lottery-notice :card="true" :activityData="activityData6"></lottery-notice>
        </div>
      </wxc-tab-page>
    </div>
    <div v-if="iMobile !== mobile" class="myPlace-bottom">
      <text @click="follow()" class="color-pink font-30 bottom-item">{{userInfo.userRelation?'已关注':'+ 关注'}}</text>
      <text @click="talk()" class="font-30 bottom-item">私信</text>
    </div>
    </scroller>
    <wxc-loading :show="isShow" :need-mask="true" loading-text="加载中"></wxc-loading>
  </div>
</template>

<script>
import mixins from "../../mixins";
import { WxcTabPage, WxcPanItem, Utils } from "weex-ui";
import { getTopic } from "../../api/topic";
import { getClubList, putUserFollow, deleteUserFollow } from "../../api/club";
import {
  putLotteryNotice,
  getSong,
  getCollection,
  getUserActivityCard
} from "../../api/myPlace";
import Config from "../../utils/config2";

import { toLogin, openChat,getUser,sharePage } from "../../api/weex";
import lotteryNotice from "./lotteryNotice.vue";
import collectNotice from "./collectNotice.vue";
import clubMusic from "../../views/club/club_Music.vue";
import myClub from "./myClub.vue";
// nav切换
const dom = weex.requireModule("dom");
const modal = weex.requireModule("modal");
export default {
  name: "myPlaceNormal",
  mixins: [mixins],
  components: { WxcTabPage, WxcPanItem, lotteryNotice, clubMusic, myClub,collectNotice },
  props: {
    iMobile: {},
    userInfo: {}
  },
  // watch: {
  //   iMobile(curVal, oldVal) {
  //     if (curVal !== "" || oldVal!=="") {
  //       modal.alert({message:1})
  //       this.request();
  //     }
  //   }
  // },
  data() {
    return {
      // mobile:getUser().mobile,
      tabPageWidth: "",
      activityData: [],
      pageNo: 1,
      activityData1_1: [],
      activityData1_2: [],
      activityData2_1: [],
      activityData2_2: [],
      create_topic:[],
      collection_topic: [],
      activityData3: [],
      activityData4_1: [],
      activityData4_2: [],
      activityData5_1: [],
      activityData5_2: [],
      activityData6: [],
      followClub: [],
      // 切换
      tabTitles: Config.tabTitles,
      tabTitles1: Config.tabTitles1,
      tabTitles2: [{ title: "好友" }, { title: "关注" }],
      tabTitles3: [{ title: "活动" }, { title: "音乐" }, { title: "话题" }],
      tabTitles4: [{ title: "创建的部落" }, { title: "加入的部落" }],
      tabStyles: Config.tabStyles,
      tabList: [],
      needSlider: false,
      demoList: [1, 2, 3, 4, 5, 6, 7, 8],
      supportSlide: true,
      isTabView: true,
      tabPageHeight2: 1334,
      tabPageHeight: 475,
      inIndex: 0,
      outIndex: 0,
      // 地盘资源高度合集
      friendActivityHeight: 475,
      followActivityHeight: 475,
      publishActivityHeight: 475,
      cardActivityHeight: 475,
      collectionActivityHeight: 475,
      collectionTopicHeight:475,
      joinActivityHeight: 475,
      createTopicHeight:475,
      clubCreateHeight: 475,
      clubJoinHeight: 475,
      songHeight: 475,
      songCollectionHeight: 475
    };
  },
  created() {
    // this.tabPageHeight2 = Utils.env.getPageHeight();
    this.request();
      // 获取动态
      putLotteryNotice(
        {
          mobile: this.iMobile,
          scope: "friend",
          pageNo: this.pageNo,
          pageSize: 5
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
          if (res.object.length !== 0) {
            this.tabPageHeight = this.tabPageHeight + this.adapterHeight(res.object,'')
          }
            this.friendActivityHeight = this.tabPageHeight;
            this.activityData1_1 = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch();
  },
  methods: {
    // 初始化
    request() {
      // 获取关注的部落
      getClubList(
        {
          pageNo: "1",
          pageSize: "4",
          // mobile: this.iMobile,
          sort: "hot"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.followClub = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
    },
    // 分享
    share() {
      let _this = this;
      let sObj = {
        title: "分享用户：" + _this.userInfo.nickname,
        desc:_this.userInfo.signature,
        web_url: "http://www.myyule.com/app/down",
        img_url: _this.userInfo.icon?("http://media2.myyule.cn/" + _this.userInfo.icon):(_this.imgUrl+'userIconBg.png'),
        sourse: "myyule"
      };
      sharePage(sObj);
    },
    // 私信(与客户端交互)
    talk() {
      if(this.webVersion){
         // 站外分享
        startNewWebView({url:this.downUrl,hideTitle:'1'});
        return;
      }
      if (!this.mobile || this.mobile === "") {
         toLogin({ loginOut: "0" });
         return;
      } else if (!this.userInfo.userRelation) {
        modal.toast({
          message: "必须关注后才能私信呦，快关注TA吧~",
          duration: 1
        });
        return;
      } else {
        openChat({ chatacct: this.iMobile, chattype: "1" });
      }
    },
    // 关注
    follow() {
      if(this.webVersion){
         // 站外分享
        startNewWebView({url:this.downUrl,hideTitle:'1'});
        return;
      }
      if (!this.mobile || this.mobile === "") {
         toLogin({ loginOut: "0" });
         return;
      } else if (!this.userInfo.userRelation) {
        this.isShow = true;
        putUserFollow(
          {
            mobile: this.mobile,
            toMobile: this.iMobile
          },
          { token: this.mobile }
        )
          .then(res => {
            if (res.status == 0) {
              this.isShow = false;
              this.userInfo.userRelation = 1;
              this.userInfo.fanNum +=1;
              modal.toast({ message: "关注成功" });
            } else {
              this.isShow = false;
              console.log(res.desc);
            }
          })
          .catch(err => {});
      } else {
        this.unFollow(this.userInfo);
      }
    },
    // 取消关注
    unFollow(item) {
      const _this = this;
      console.log(item);
      modal.confirm(
        {
          message: "确定取消关注么 ?",
          okTitle: "确定",
          cancelTitle: "取消",
          duration: 0.3
        },
        function(value) {
          if (value === "确定") {
            _this.isShow = true;
            deleteUserFollow(
              {
                mobile: _this.mobile,
                toMobile: item.mobile
              },
              { token: _this.mobile }
            )
              .then(res => {
                if (res.status == 0) {
                  _this.isShow = false;
                  item.userRelation = 0;
                  _this.userInfo.fanNum -=1;
                  modal.toast({
                    message: "取消成功!!",
                    duration: 1
                  });
                } else {
                  console.log(res.desc);
                }
              })
              .catch(err => {});
          }
        }
      );
    },
    // 导航
    wxcTabPageCurrentTabSelected(e) {
      this.pageNo = 1;
      this.isShow = true;
      const self = this;
      const index = e.page;
      this.outIndex = index;
      this.inIndex = 0;
      if (index == 0) {
        // 动态
        this.tabPageHeight = this.friendActivityHeight;
        if (this.activityData1_1.length == 0) {
          putLotteryNotice(
            {
              mobile: this.iMobile,
              scope: "friend",
              optType: "",
              pageNo: this.pageNo,
              pageSize: 5
            },
            { token: this.mobile }
          )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                if (res.object.length !== 0) {
            this.tabPageHeight = this.tabPageHeight + this.adapterHeight(res.object,'')
                  this.friendActivityHeight = this.tabPageHeight;
                }
                this.activityData1_1 = res.object
                  ? this.activityData1_1.concat(res.object)
                  : [];
              } else {
                console.log(res.desc);
              }
            })
            .catch();
        } else {
          this.isShow = false;
        }
      } else if (index == 1) {
        // 我发布的
        this.tabPageHeight = this.publishActivityHeight;
        if (this.activityData2_1.length == 0) {
          putLotteryNotice(
            {
              mobile: this.iMobile,
              scope: "my",
              resType: "activity",
              optType: "publish",
              pageNo: this.pageNo,
              pageSize: 5
            },
            { token: this.mobile }
          )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                if (res.object.length !== 0) {
            this.tabPageHeight = this.tabPageHeight + this.adapterHeight(res.object,'')
                  this.publishActivityHeight = this.tabPageHeight;
                }
                this.activityData2_1 = res.object
                  ? this.activityData2_1.concat(res.object)
                  : [];
              } else {
                console.log(res.desc);
              }
            })
            .catch();
        } else {
          this.isShow = false;
        }
      } else if (index == 2) {
        // 我参与的
        this.tabPageHeight = this.joinActivityHeight;
        if (this.activityData3.length == 0) {
          putLotteryNotice(
            {
              mobile: this.iMobile,
              scope: "my",
              resType: "activity",
              optType: "join",
              pageNo: this.pageNo,
              pageSize: 5
            },
            { token: this.mobile }
          )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                if (res.object.length !== 0) {
            this.tabPageHeight = this.tabPageHeight + this.adapterHeight(res.object,'')
                }
                this.joinActivityHeight = this.tabPageHeight;
                this.activityData3 = res.object
                  ? this.activityData3.concat(res.object)
                  : [];
              } else {
                console.log(res.desc);
              }
            })
            .catch();
        } else {
          this.isShow = false;
        }
      } else if (index == 4) {
        // 我的收藏
        this.tabPageHeight = this.collectionActivityHeight;
        if (this.activityData4_1.length == 0) {
          getCollection(
            {
              mobile: this.iMobile,
              pageNo: this.pageNo,
              resType: "activity",
              pageSize: 5
            },
            { token: this.mobile }
          )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                if (res.object.length !== 0) {
                    this.tabPageHeight =
                      this.tabPageHeight+ 475 +760 * (res.object.length-1);
                }
                this.collectionActivityHeight = this.tabPageHeight;
                this.activityData4_1 = res.object;
              } else {
                console.log(res.desc);
              }
            })
            .catch();
        } else {
          this.isShow = false;
        }
      } else if (index == 3) {
        // 部落
        this.tabPageHeight = this.clubCreateHeight;
        if (this.activityData5_1.length == 0) {
          getClubList(
            {
              pageNo: this.pageNo,
              pageSize: 10,
              mobile: this.iMobile,
              userEmp: 1
            },
            { token: this.mobile }
          )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                if (res.object.length !== 0) {
                  // modal.alert({message:res.object.length})
                  this.tabPageHeight = this.tabPageHeight + 400 + (res.object.length-3)*240;
                }
                this.clubCreateHeight = this.tabPageHeight;
                this.activityData5_1 = res.object;
              } else {
                console.log(res.desc);
              }
            })
            .catch(err => {});
        } else {
          this.isShow = false;
        }
      } else if (index == 5) {
        // 卡卷
        this.tabPageHeight = this.cardActivityHeight;
        if (this.activityData6.length == 0) {
          getUserActivityCard(
            {
              pageNo: this.pageNo,
              pageSize: 5,
              mobile: this.iMobile
            },
            { token: this.mobile }
          )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                if (res.object.length !== 0) {
                  this.tabPageHeight = this.tabPageHeight + this.adapterHeight(res.object,'')
                }
                this.cardActivityHeight = this.tabPageHeight;
                this.activityData6 = res.object;
              } else {
                console.log(res.desc);
              }
            })
            .catch(err => {});
        } else {
          this.isShow = false;
        }
      }
      /* Unloaded tab analog data request */
      if (!Utils.isNonEmptyArray(self.tabList[index])) {
        setTimeout(() => {
          Vue.set(self.tabList, index, self.demoList);
        }, 100);
      }
    },
    wxcTabPageCurrentTabSelected2(e) {
      this.pageNo = 1;
      const self = this;
      const index = e.page;
      this.inIndex = index;
      if(index == 0){
        this.tabPageHeight = this.friendActivityHeight;
      }else if (index == 1) {
        this.isShow = true;
        this.tabPageHeight = this.followActivityHeight;
        if (this.activityData1_2.length == 0) {
          putLotteryNotice(
            {
              mobile: this.iMobile,
              scope: "follow",
              optType: "",
              pageNo: this.pageNo,
              pageSize: 5
            },
            { token: this.mobile }
          )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                if (res.object.length !== 0) {
                  this.tabPageHeight = this.tabPageHeight + this.adapterHeight(res.object,'')
                }
                this.followActivityHeight = this.tabPageHeight;
                this.activityData1_2 = res.object
                  ? this.activityData1_2.concat(res.object)
                  : [];
              } else {
                console.log(res.desc);
              }
            })
            .catch();
        } else {
          this.isShow = false;
        }
      }
      /* Unloaded tab analog data request */
      if (!Utils.isNonEmptyArray(self.tabList[index])) {
        setTimeout(() => {
          Vue.set(self.tabList, index, self.demoList);
        }, 100);
      }
    },
    wxcTabPageCurrentTabSelected3(e) {
      this.pageNo = 1;
      const self = this;
      const index = e.page;
      this.inIndex = index;
      if(index == 0){
        this.tabPageHeight = this.publishActivityHeight;
      }else if (index == 1) {
        this.tabPageHeight = this.songHeight;
        this.isShow = true;
        // 我发布的-音乐
        if (this.activityData2_2.length == 0) {
          getSong(
            {
              mobile: this.iMobile,
              pageNo: this.pageNo,
              pageSize: 9
            },
            { token: this.mobile }
          )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                if (res.object.length !== 0) {
                  this.tabPageHeight = this.tabPageHeight + 400;
                }
                this.songHeight = this.tabPageHeight;
                this.activityData2_2 = res.object;
              } else {
                console.log(res.desc);
              }
            })
            .catch();
        } else {
          this.isShow = false;
        }
      } else if (index == 2) {
        this.tabPageHeight = this.createTopicHeight;
        this.isShow = true;
        // 我发布的-话题
        if (this.create_topic.length == 0) {
          putLotteryNotice(
            {
              mobile: this.iMobile,
              scope: "my",
              resType: "topic",
              optType: "publish",
              pageNo: this.pageNo,
              pageSize: 5
            },
            { token: this.mobile }
          )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                if (res.object.length !== 0) {
                  this.tabPageHeight = this.tabPageHeight + this.adapterHeight(res.object,'')
                }
                this.createTopicHeight = this.tabPageHeight;
                this.create_topic = res.object
                  ? this.create_topic.concat(res.object)
                  : [];
              } else {
                console.log(res.desc);
              }
            })
            .catch();
        } else {
          this.isShow = false;
        }
      }
      /* Unloaded tab analog data request */
      if (!Utils.isNonEmptyArray(self.tabList[index])) {
        setTimeout(() => {
          Vue.set(self.tabList, index, self.demoList);
        }, 100);
      }
    },
    wxcTabPageCurrentTabSelected4(e) {
      this.pageNo = 1;
      const self = this;
      const index = e.page;
      this.inIndex = index;
      if(index == 0){
        this.tabPageHeight = this.collectionActivityHeight;
      }else if (index == 1) {
        this.isShow = true;
        // 我收藏的-音乐
        this.tabPageHeight = this.songCollectionHeight;
        if (this.activityData4_2.length == 0) {
          getCollection(
            {
              mobile: this.iMobile,
              pageNo: this.pageNo,
              resType: "song",
              pageSize: 9
            },
            { token: this.mobile }
          )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                if (res.object.length !== 0) {
                  this.tabPageHeight = this.tabPageHeight + 400;
                }
                this.songCollectionHeight = this.tabPageHeight;
                this.activityData4_2 = res.object;
              } else {
                console.log(res.desc);
              }
            })
            .catch();
        } else {
          this.isShow = false;
        }
      } else if (index == 2) {
        this.tabPageHeight = this.collectionTopicHeight;
        this.isShow = true;
        // 我收藏的-话题
        if (this.collection_topic.length == 0) {
            getCollection(
              {
                mobile: this.iMobile,
                pageNo: this.pageNo,
                resType: "topic",
                pageSize: 5
              },
              { token: this.mobile }
            )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                if (res.object.length !== 0) {
                  this.tabPageHeight =
                    this.tabPageHeight + 475 + 610 * (res.object.length - 1);
                }
                this.collectionTopicHeight = this.tabPageHeight;
                this.collection_topic = res.object
                  ? this.collection_topic.concat(res.object)
                  : [];
              } else {
                console.log(res.desc);
              }
            })
            .catch();
        }
      }
      /* Unloaded tab analog data request */
      if (!Utils.isNonEmptyArray(self.tabList[index])) {
        setTimeout(() => {
          Vue.set(self.tabList, index, self.demoList);
        }, 100);
      }
    },
    wxcTabPageCurrentTabSelected5(e) {
      this.pageNo = 1;
      const self = this;
      const index = e.page;
      this.inIndex = index;
      if (index == 1) {
        this.isShow = true;
        // 加入的部落
        this.tabPageHeight = this.clubJoinHeight;
        if (this.activityData5_2.length == 0) {
          getClubList(
            {
              pageNo: this.pageNo,
              pageSize: 10,
              schoolClub:1,
              mobile: this.iMobile
            },
            { token: this.mobile }
          )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                if (res.object.length !== 0) {
                  this.tabPageHeight = this.tabPageHeight + 400 + (res.object.length-3)*240;
                }
                this.clubJoinHeight = this.tabPageHeight;
                this.activityData5_2 = res.object;
              } else {
                console.log(res.desc);
              }
            })
            .catch(err => {});
        } else {
          this.isShow = false;
        }
      }
      /* Unloaded tab analog data request */
      if (!Utils.isNonEmptyArray(self.tabList[index])) {
        setTimeout(() => {
          Vue.set(self.tabList, index, self.demoList);
        }, 100);
      }
    },
    // 加载下一页
    fetchPage(param) {
    }
  }
};
</script>
<style src="../../assets/style/index.scss">
</style>
<style scoped>
.myPlaceNormal {
  width: 750px;
  flex: 1;
}
.wrapper {
  position: relative;
  background: #fff;
}
.bottom-item.color-pink {
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: #ececec;
}
.bottom-item {
  padding-top: 35px;
  padding-bottom: 35px;
  padding-left: 152px;
  padding-right: 152px;
}
.border-cell {
  background-color: #fff;
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
.left,
.right {
  flex-direction: row;
  align-items: center;
}
.item-container {
  width: 750px;
}

.bg {
  position: absolute;
  bottom: 130px;
  left: 0;
  width: 750px;
  height: 560px;
}
.circle-bg{
  position: absolute;
  bottom: 128px;
  left: 0;
  width: 750px;
  height: 512px;
}
.img-vip {
  width: 180px;
  height: 180px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}
.vip {
  position: absolute;
  width: 44px;
  height: 44px;
  bottom: 0;
  right: 0;
}
.user-detail{
  position: absolute;
  justify-content:center;
  align-items:center;
  bottom:0;
  width:750px;
  left: 0;
}
.user-img {
  background-color: #d9d9d9;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  border-width:4px;
  border-style:solid;
  border-color:#fff;
  box-shadow:0 10px 20px #ccc;
}
.user-name {
  position: relative;
  padding-top: 24px;
  text-align: center;
  font-size:32px;
  font-weight:bold;
}
.user-school {
  position: relative;
  padding-top: 11px;
  text-align: center;
  color: #000;
  font-size:24px;
}
.follow {
  text-align: center;
  color: #fff;
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: #fff;
  padding-right: 10px;
}
.funs {
  padding-left: 10px;
  text-align: center;
  color: #fff;
}
.clubName {
  padding-bottom: 0;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 0;
}
.msg-bottom {
  flex-direction: row;
  justify-content: center;
  padding-bottom: 10px;
  padding-left: 0;
  padding-right: 0;
  padding-top: 10px;
}
.user-msg {
  position: relative;
  width: 750px;
  height: 690px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
}
.clubName {
  padding-top: 10px;
  font-size: 24px;
  width: 165px;
  word-wrap: break-word;
  text-align: center;
}
.item-img,
.pic {
  width: 100px;
  height: 100px;
  background: #ccc;
  /* @include group(margin,0,auto); */
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}
.item-img {
  margin-left: 35px;
  margin-right: 35px;
}
.item {
  text-align: center;
}
.img {
  width: 40px;
  height: 40px;
}
.list-wrapper {
  margin-top: 20px;
  flex-direction: row;
  justify-content: space-around;
}
.title {
  padding-bottom: 22px;
  padding-left: 0;
  padding-right: 0;
  padding-top: 22px;
  font-size:26px;
  font-weight:bold;
}
.recommend-club {
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 40px;
  background-color:#fff;
  align-items:center;
}
.myPlace-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750px;
  background-color: #fff;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #ececec;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.top {
  position: absolute;
  width: 750px;
  left: 0;
  top: 0;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 22px;
  padding-left: 40px;
  padding-right: 40px;
}
.left,
.right {
  flex-direction: row;
  align-items: center;
}
.left-image-view {
  width: 61px;
  height: 61px;
}
</style>
