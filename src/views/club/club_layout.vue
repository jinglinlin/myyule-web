<template>
  <div class="club-layout" ref="clubLayout" @viewappear="_mounted">
    <div class="top" :style="{paddingTop:source==='iOS'?62:20+'px'}">
        <image @click="pop()" class="left" :src='imgUrl+"back.png"' ></image>
        <text class="title font-32">部落主页</text>
        <div class="right">
            <image @click="pathMsg()" class="right-icon" :src='imgUrl+"msg.png"' ></image>
            <image @click="share()" class="right-icon" :src='imgUrl+"share.png"' ></image>
        </div>
    </div>
    <scroller class="list"
                @loadmore="fetchPage" loadmoreoffset="60">
      <div class="inroduce" ref="inroduce">
          <image class="inroduce-bg" :style="{height:msgHeight+'px'}" :src='imgUrl+"inroduce-bg.png"' ></image>
          <div class="info">
              <image class="pic msg-img" resize="cover" :src="'http://media2.myyule.cn/' + club.clubLogo"  alt="" width="120" height="120"></image>
              
              <div class="info-content">
                  <text class="info-title font-26">{{club.clubName}}</text>
                  <div class="info-msg" @click="_infoKey()">
                    <text :class="['info-text',!infoKey?'info-active':'']" class="font-22">部落简介：{{club.clubDesc}}</text>
                    
                      <image :src='imgUrl+"down.png"' v-if="!infoKey&&club.clubDesc.length>30"  class="info-img icon-hidden image-view" @click="_infoKey()" ></image>


                      <image v-if="infoKey" :src='imgUrl+"top.png"' class="info-img icon-hidden image-view" @click="_infoKey()" ></image>

                </div>
                  <div class="inroduce-bottom">
                      <!-- 发群公告 -->
                      <!-- <div v-if="club.mobile === mobile" @click="pathRelaseNotice()" class="bottom-left">
                          <div class="talk-img">
                            <image :src='imgUrl+"talk.png"' class="image-view" ></image>
                          </div>
                          <text class="color-pink font-24 bottom-text">发群公告</text>
                      </div> -->
                      <!-- 加入群聊 -->
                      <div @click="joinTalk()" class="signed">
                          <image :src='imgUrl+"talk.png"' class="talk-img" ></image>
                          <text class="font-24 color-pink">群聊</text>
                      </div>
                      <!-- 加入部落 -->
                      <div v-if="club.clubRelation == 0" @click="joinClub()" class="signed">
                        <text class="font-24 color-pink">+ 加入</text>
                      </div>
                      <!-- 签到 -->
                      <div v-if="club.clubRelation == 1" @click="sign()" class="signed">
                        <text class="font-24 color-pink">{{signData.isSign?'已签到':'签到'}}</text>
                      </div>
                      <div @click="pathMember()" class="bottom-right">
                        <text class="bottom-text font-26">成员数{{club.clubMemberNum}}人</text>
                        <image :src='imgUrl+"right.png"' class="right-img" ></image>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <!-- 推荐部落 -->
			<div class="recommend-club">
        <text class="recommend-title font-26">推荐部落:</text>
        <div class="list-wrapper">
          <div @click="toOtherClub(item)" v-for="(item,index) in recommend_club" :key="index" class="item">
            <image class="item-img pic" resize="cover" :src="'http://media2.myyule.cn/' + item.clubLogo" placeholder="http://www.myyule.com/images/club_logo_middle.jpg" alt="" ></image>
            
            <text class="item-text" style="padding-top:20px;">{{item.clubName}}</text>
          </div>
        </div>
      </div>

      <div class="linear"></div>

      <wxc-tab-page ref="wxc-tab-page"
                :tab-titles="tabTitles"
                :tab-styles="tabStyles"
                title-type="text"
                :needSlider="needSlider"
                :is-tab-view="isTabView"
                :tab-page-height="tabPageHeight"
                wrap-bg-color="#fff"
                @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
        <div class="item-container">
          <clubTopic :activityData="topicData"></clubTopic>
        </div>
        <div class="item-container">
          <clubNotice :activityData="resData1" iStyle="club"></clubNotice>
        </div>
        <div class="item-container">
          <clubSign :clubId="clubId" :resData="resData2"></clubSign>
        </div>
        <div class="item-container">
          <clubMusic :resData="resData3"></clubMusic>
        </div>
        <div class="item-container">
          <clubVideo :resData="resData4"></clubVideo>
        </div>
        <div class="item-container">
          <div class="clubPhoto">
              <div @click="openLightBox(item)" v-for="(item,index) in resData5" :key="index" class="item">
                <image class="item-photo" resize="cover" :src="item.path?'http://media2.myyule.cn/' + item.path:''" alt=""></image>
              </div>
          </div>
        </div>
      </wxc-tab-page>
      <!-- 照片 -->
      <wxc-lightbox
        ref="wxc-lightbox"
        height="800"
        :show="show"
        :show-indicator = false
        :image-list="imageList"
        @wxcLightboxOverlayClicked="wxcLightboxOverlayClicked">
      </wxc-lightbox>
      <!-- 空白提示 -->
      <div v-if="empty" class="empty-wrapper">
        <image resize="contain" class="empty" :src="imgUrl+'empty.png'"></image>
      </div>
    </scroller>
    <div v-if="!issKey" class="bg"></div>
    <download-notice></download-notice>
    <!-- 发布 -->
    <div ref="activityEl" @click="push2('/views/release/releaseContent',{club:club})" class="issue-activity"><text class="issue-text">活动</text></div>
    <div ref="topicEl" @click="push2('/views/topic/createTopic',{club:club})" class="issue-pic"><text class="issue-text">话题</text></div>
    <image @click="_issueKey()" ref="issue" class="issue" :src='imgUrl+"issue.png"' ></image>
    <!-- 发布公告 -->
    <!-- <releaseNotice :club="club" ref="releaseNotice"></releaseNotice> -->
    <!-- 加入群聊 -->
    <!-- <myConfirm :mobile='mobile' type="chat" :clubId="clubId" :club="club" title="加入后才可进入群聊哦赶快加入吧" ref="confirm"></myConfirm> -->
    <!-- 签到 -->
    <sign :club="club" :signData="signData" ref="sign"></sign>
    <wxc-loading :show="isShow" :need-mask="true" loading-text="加载中"></wxc-loading>

  </div>
</template>

<script>
import mixins from "../../mixins";
import {
  getClubInfo,
  getRecommendClub,
  getClubList,
  getClub_Res,
  putClubSign,
  getClubSign,
  putClubMember,
  getChat
} from "../../api/club.js";
import downloadNotice from "../../components/downloadNotice.vue";
// 部落资源
// import clubTopic from "./club_Topic.vue";
import clubVideo from "./club_Video.vue";
import clubMusic from "./club_Music.vue";
import clubSign from "./club_Sign.vue";
import clubNotice from "../../views/club/club_Notice.vue";
import clubTopic from "../../views/club/club_Topic.vue";

// import releaseNotice from "./release_notice.vue";
import sign from "./sign.vue";
import { WxcTabPage, Utils, WxcLightbox } from "weex-ui";
import Config from "../../utils/config";
import { toLogin, openChat, sharePage } from "../../api/weex";
const dom = weex.requireModule("dom");
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");
const animation = weex.requireModule("animation");
export default {
  mixins: [mixins],
  components: {
    WxcTabPage,
    // releaseNotice,
    sign,
    downloadNotice,
    clubTopic,
    clubVideo,
    clubMusic,
    clubSign,
    clubNotice,
    WxcLightbox
  },
  data() {
    return {
      topicData: [],
      imageList: [],
      show: false,
      empty: false,
      sIndex: "",
      infoKey: false,
      signData: [], // 签到信息
      club: {},
      clubId: "", // 账号id
      recommend_club: [], // 推荐部落

      // 部落资源
      resData: [],
      resData1: [],
      resData2: [],
      resData3: [],
      resData4: [],
      resData5: [],
      pageNo: 1,
      resType: "topic",
      tabTitles: Config.clubTag,
      tabStyles: Config.tabStyles,
      tabList: [],
      needSlider: false,
      demoList: [1, 2, 3, 4],
      supportSlide: true,
      isTabView: true,
      msgHeight: 377,
      tabPageHeight: 482,
      tabPageWidth: "",
      activityHeight: 482,
      toipcHeight: 482,
      photoHeight: 524,
      signHeight: 524,
      videoHeight: 534,
      musicHeight: 594,
      issKey: true
    };
  },
  created() {
    if (this.webParam()) {
      this.clubId = this.webParam().clubId;
      this._mounted();
    } else {
      storage.getItem("data", event => {
        if (JSON.parse(event.data).clubId) {
          this.clubId = JSON.parse(event.data).clubId;
        }
        this._mounted();
      });
    }
  },
  mounted() {
    // 数据埋点
    if (this.webVersion) {
      this.putPageUrlLog(1803);
    } else {
      this.putPageUrlLog(1502);
    }
  },
  methods: {
    // 请求
    _mounted() {
      this.isShow = true;
      // 获取部落数据
      getClubInfo(
        {
          clubId: this.clubId
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isShow = false;
            this.club = res.object;
          } else {
            this.isShow = false;
            modal.toast({ message: res.desc, duration: 1 });
            console.log(res.desc);
          }
        })
        .catch(err => {});
      // 获取推荐部落数据
      getClubList(
        {
          pageNo: "1",
          pageSize: "4",
          notInId: this.clubId
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.recommend_club = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
      // 获取签到状态
      getClubSign(
        {
          clubId: this.clubId,
          mobile: this.mobile
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.signData = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
      // 获取资源
      this.getClubRes();
    },
    // 相册放大
    openLightBox(item) {
      this.show = true;
      this.imageList[0] = { src: "http://media2.myyule.cn/" + item.path };
    },
    wxcLightboxOverlayClicked() {
      // 无状态组件，需要在此次关闭
      this.show = false;
    },
    _infoKey() {
      if (this.infoKey) {
        this.msgHeight = 377;
        this.infoKey = false;
      } else {
        this.msgHeight = 497;
        this.infoKey = true;
      }
    },
    // 获取资源
    getClubRes() {
      this.isShow = true;
      getClub_Res(
        {
          pageNo: this.pageNo,
          pageSize: 5,
          clubId: this.clubId,
          resType: this.resType
        },
        { token: this.mobile }
      )
        .then(res => {
          this.isShow = false;
          if (res.status == 0) {
            if (res.object.length !== 0) {
              this.tabPageHeight =
                this.tabPageHeight + this.adapterHeight(res.object, "topic");
            }
            this.toipcHeight = this.tabPageHeight;
            this.topicData = res.object
              ? this.topicData.concat(res.object)
              : [];
            console.log(this.topicData);
            if (this.topicData.length == 0) {
              this.empty = true;
            } else {
              this.empty = false;
            }
            this.topicData = this.topicData;
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    _issueKey() {
      // 站外分享点击事件处理
      this.shareEvent();
      if (this.mobile === "" || !this.mobile) {
        toLogin({ loginOut: "0" });
        return;
      } else if (!this.club.clubRelation) {
        modal.toast({ message: "加入后才可发布", duration: 1 });
      } else {
        if (!this.issKey) {
          animation.transition(
            this.$refs.activityEl,
            {
              styles: {
                transform: "translate(0, 0) rotate(270deg)",
                transformOrigin: "center center"
              },
              duration: 300, //ms
              // timingFunction: "cubic-bezier(.81,.07,.95,.13)",
            timingFunction: "ease-in-out",
              delay: 0 //ms
            },
            () => {
              this.issKey = !this.issKey;
            }
          );
          animation.transition(this.$refs.topicEl, {
            styles: {
              transform: "translate(0, 0) rotate(270deg)",
              transformOrigin: "center center"
            },
            duration: 300, //ms
            // timingFunction: "cubic-bezier(.81,.07,.95,.13)",
            timingFunction: "ease-in-out",
            delay: 0 //ms
          });
        } else {
          this.issKey = !this.issKey;
          animation.transition(this.$refs.activityEl, {
            styles: {
              transform: "translate(-55px, -160px) rotate(0)",
              transformOrigin: "center center"
            },
            duration: 300, //ms
            timingFunction: "ease-in-out",
            delay: 0 //ms
          });
          animation.transition(this.$refs.topicEl, {
            styles: {
              transform: "translate(-167px, 0px) rotate(0)",
              transformOrigin: "center center"
            },
            duration: 300, //ms
            timingFunction: "ease-in-out",
            delay: 0 //ms
          });
        }
      }
    },
    // 推荐部落
    toOtherClub(item) {
      this.resData = [];
      this.push2("/views/club/club_layout", { clubId: item.clubId });
      this._mounted();
    },
    // 发布群公告
    // pathRelaseNotice() {
    //   this.$refs.releaseNotice.show();
    // },
    // 加入群聊
    joinTalk() {
      // 站外分享点击事件处理
      this.shareEvent();
      if (!this.mobile || this.mobile === "") {
        toLogin({ loginOut: "0" });
        return;
      } else if (!this.club.clubRelation) {
        modal.toast({ message: "加入后才可进入群聊哦，赶快加入吧！" });
      } else {
        this.isShow = true;
        getChat(
          { mobile: this.mobile, resId: this.clubId, resType: "club" },
          { token: this.mobile }
        )
          .then(res => {
            if (res.status == 0) {
              this.isShow = false;
              openChat({ chatacct: res.object, chattype: "2" });
              this.toTalk(res.object);
            } else {
              this.isShow = false;
              console.log(res.desc);
            }
          })
          .catch();
      }
    },
    // 加入部落
    joinClub() {
      // 站外分享点击事件处理
      this.shareEvent();
      if (!this.mobile || this.mobile == "") {
        toLogin({ loginOut: "0" });
        return;
      }
      if (!this.isShow) {
        this.isShow = true;
        putClubMember(
          {
            clubId: this.clubId,
            mobile: this.mobile
          },
          { token: this.mobile }
        )
          .then(res => {
            this.isShow = false;
            if (res.status == 0) {
              modal.alert({ message: "加入成功" });
              this.club.clubRelation = 1;
            } else {
              modal.alert({ message: res.desc });
              console.log(res.desc);
            }
          })
          .catch();
      }
    },
    // 签到
    sign() {
      if (!this.signData.isSign) {
        if (!this.isShow) {
          this.isShow = true;
          putClubSign(
            {
              clubId: this.clubId,
              mobile: this.mobile
            },
            { token: this.mobile }
          )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                this.signData = res.object;
              } else {
                console.log(res.desc);
              }
            })
            .catch();
        }
      }
      this.$refs.sign.openMask();
    },
    // 打开部落资料
    pathMsg() {
      console.log(this.mobile);
      if (this.mobile === "" || !this.mobile) {
        modal.alert({
          message: "请重新登入"
        });
        toLogin({ loginOut: "0" });
        return;
      } else {
        this.push2("/views/club/club_Msg", { club: this.club });
      }
    },
    // 打开部落成员
    pathMember() {
      this.push2("/views/club/club_member", {
        clubId: this.clubId,
        mobile: this.club.mobile
      });
    },
    // 加载下一页
    fetchPage(event) {
      if (!this.isShow && !this.webVersion) {
        this.pageNo += 1;
        this.turnPage("slider");
      }
    },
    // 菜单切换
    wxcTabPageCurrentTabSelected(e) {
      const self = this;
      const index = e.page;
      this.sIndex = index;
      this.resData = [];
      this.pageNo = 1;
      this.empty = false;
      // if (index == 0) {
      //   this.resType = "topic";
      //   this.getClubRes();
      // } else
      this.turnPage("tab");
    },
    // 切换下拉请求
    turnPage(type) {
      if (this.sIndex == 0) {
        this.resType = "topic";
        this.tabPageHeight = this.toipcHeight;
        if (type === "tab" && this.topicData.length !== 0) {
          return;
        }
        this.isShow = true;
        getClub_Res(
          {
            pageNo: this.pageNo,
            pageSize: 5,
            clubId: this.clubId,
            resType: this.resType
          },
          { token: this.mobile }
        )
          .then(res => {
            this.isShow = false;
            if (res.status == 0) {
              this.topicData = res.object
                ? this.topicData.concat(res.object)
                : this.topicData;
              // 切换
              if (type === "tab") {
                if (this.topicData.length == 0) {
                  this.empty = true;
                } else {
                  this.tabPageHeight =
                    this.tabPageHeight +
                    this.adapterHeight(res.object, "topic");
                  this.empty = false;
                }
              } else if (type === "slider" && res.object.length !== 0) {
                this.tabPageHeight =
                  this.tabPageHeight + 610 * res.object.length;
              }
              this.toipcHeight = this.tabPageHeight;
              // modal.alert({message:'s'+this.tabPageHeight})
              this.topicData = this.topicData;
            } else {
              console.log(res.desc);
            }
          })
          .catch();
      } else if (this.sIndex == 1) {
        this.resType = "activity";
        this.tabPageHeight = this.activityHeight;
        if (type === "tab" && this.resData1.length !== 0) {
          return;
        }
        this.isShow = true;
        getClub_Res(
          {
            pageNo: this.pageNo,
            pageSize: 5,
            clubId: this.clubId,
            resType: this.resType
          },
          { token: this.mobile }
        )
          .then(res => {
            this.isShow = false;
            if (res.status == 0) {
              this.resData1 = res.object
                ? this.resData1.concat(res.object)
                : this.resData1;
              // modal.alert({message:JSON.stringify(this.resData)+','+JSON.stringify(this.resData1)})
              // 切换
              if (type === "tab") {
                if (this.resData1.length == 0) {
                  this.empty = true;
                } else {
                  this.tabPageHeight =
                    this.tabPageHeight +
                    this.adapterHeight(res.object, "activity");
                  this.empty = false;
                }
              } else if (type === "slider" && res.object.length !== 0) {
                this.tabPageHeight =
                  this.tabPageHeight + 880 * res.object.length;
              }
              this.activityHeight = this.tabPageHeight;
            } else {
              console.log(res.desc);
            }
          })
          .catch();
      } else if (this.sIndex == 2) {
        this.resType = "signList";
        this.tabPageHeight = this.signHeight;
        if (type === "tab" && this.resData2.length !== 0) {
          return;
        }
        this.isShow = true;
        getClub_Res(
          {
            pageNo: this.pageNo,
            pageSize: 10,
            clubId: this.clubId,
            resType: this.resType
          },
          { token: this.mobile }
        )
          .then(res => {
            this.isShow = false;
            if (res.status == 0) {
              this.resData2 = res.object
                ? this.resData2.concat(res.object)
                : this.resData2;
              // 切换
              if (type === "tab") {
                if (this.resData2.length == 0) {
                  this.empty = true;
                } else {
                  this.tabPageHeight =
                    this.tabPageHeight + 240 * (res.object.length - 2);
                  this.empty = false;
                }
              } else if (type === "slider" && res.object.length !== 0) {
                this.tabPageHeight =
                  this.tabPageHeight + 220 * res.object.length;
              }
              this.signHeight = this.tabPageHeight;
            } else {
              console.log(res.desc);
            }
          })
          .catch();
      } else if (this.sIndex == 3) {
        this.resType = "song";
        this.tabPageHeight = this.musicHeight;
        if (type === "tab" && this.resData3.length !== 0) {
          return;
        }
        this.isShow = true;
        getClub_Res(
          {
            pageNo: this.pageNo,
            pageSize: 15,
            clubId: this.clubId,
            resType: this.resType
          },
          { token: this.mobile }
        )
          .then(res => {
            this.isShow = false;
            if (res.status == 0) {
              this.resData3 = res.object
                ? this.resData3.concat(res.object)
                : this.resData3;
              // 切换
              if (type === "tab") {
                if (this.resData3.length == 0) {
                  this.empty = true;
                } else {
                  this.tabPageHeight =
                    this.tabPageHeight +
                    146 +
                    340 *
                      ((res.object.length % 3 > 0 ? 1 : 0) +
                        res.object.length / 3 -
                        2);
                  this.empty = false;
                }
              } else if (type === "slider" && res.object.length !== 0) {
                this.tabPageHeight =
                  this.tabPageHeight +
                  340 *
                    ((res.object.length % 3 > 0 ? 1 : 0) +
                      res.object.length / 3);
                // modal.alert({message:this.tabPageHeight})
              }
              this.musicHeight = this.tabPageHeight;
            } else {
              console.log(res.desc);
            }
          })
          .catch();
      } else if (this.sIndex == 4) {
        this.tabPageHeight = this.videoHeight;
        if (type === "tab" && this.resData4.length !== 0) {
          return;
        }
        this.resType = "video";
        this.isShow = true;
        getClub_Res(
          {
            pageNo: this.pageNo,
            pageSize: 10,
            clubId: this.clubId,
            resType: this.resType
          },
          { token: this.mobile }
        )
          .then(res => {
            this.isShow = false;
            if (res.status == 0) {
              this.resData4 = res.object
                ? this.resData4.concat(res.object)
                : this.resData4;
              // 切换
              if (type === "tab") {
                if (this.resData4.length == 0) {
                  this.empty = true;
                } else {
                  this.tabPageHeight =
                    this.tabPageHeight + 470 * (res.object.length - 1);
                  this.empty = false;
                }
              } else if (type === "slider" && res.object.length !== 0) {
                this.tabPageHeight =
                  this.tabPageHeight + 470 * res.object.length;
              }
              this.videoHeight = this.tabPageHeight;
            } else {
              console.log(res.desc);
            }
          })
          .catch();
      } else if (this.sIndex == 5) {
        this.tabPageHeight = this.photoHeight;
        if (type === "tab" && this.resData5.length !== 0) {
          return;
        }
        this.isShow = true;
        this.resType = "photo";
        getClub_Res(
          {
            pageNo: this.pageNo,
            pageSize: 15,
            clubId: this.clubId,
            resType: this.resType
          },
          { token: this.mobile }
        )
          .then(res => {
            this.isShow = false;
            if (res.status == 0) {
              this.resData5 = res.object
                ? this.resData5.concat(res.object)
                : this.resData5;
              // 切换
              if (type === "tab") {
                if (this.resData5.length == 0) {
                  this.empty = true;
                } else {
                  this.tabPageHeight =
                    this.tabPageHeight +
                    146 +
                    270 *
                      ((res.object.length % 3 > 0 ? 1 : 0) +
                        res.object.length / 3 -
                        2);
                  this.empty = false;
                }
              } else if (type === "slider" && res.object.length !== 0) {
                this.tabPageHeight =
                  this.tabPageHeight +
                  270 *
                    ((res.object.length % 3 > 0 ? 1 : 0) +
                      res.object.length / 3);
              }
              this.photoHeight = this.tabPageHeight;
            } else {
              console.log(res.desc);
            }
          })
          .catch();
      }
    },
    //分享图标
    share() {
      // 站外分享点击事件处理
      this.shareEvent();
      const _this = this;
      let sObj = {
        title: "分享部落：" + _this.club.clubName,
        desc: _this.club.clubDesc,
        web_url:
          _this.commonUrl +
          "myyuleWeb/webShare/club/index.html?clubId=" +
          _this.clubId,
        img_url: "http://media2.myyule.cn/" + _this.club.clubLogo,
        sourse: "myyule"
      };
      sharePage(sObj);
    }
  }
};
</script>

<style src="../../assets/style/index.scss">
</style>
<style scoped>
.item-text {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.club-layout {
  width: 750px;
  flex: 1;
  background-color: #ffffff;
}
.top {
  width: 750px;
  background-color: #fff;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 22px;
  padding-left: 40px;
  padding-right: 40px;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: #e0e0e0;
}
.title {
  color: #000;
  line-height: 61px;
}
.img {
  width: 61px;
  height: 61px;
}
.left {
  width: 61px;
  height: 61px;
  margin-right: 100px;
}
.right {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.right-icon {
  width: 61px;
  height: 61px;
  margin-left: 20px;
}
.inroduce {
  position: relative;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 20px;
  padding-bottom: 40px;
  height: 377px;
}
.info {
  flex-direction: row;
  justify-content: space-between;
  align-items: bottom;
  padding-top: 70px;
}
.msg-img {
  background: #d9d9d9;
  width: 120px;
  height: 120px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  border-width: 4px;
  border-style: solid;
  border-color: #fff;
}
.info-content {
  position: relative;
  width: 558px;
  padding-left: 20px;
  padding-top: 10px;
  padding-right: 25px;
}
.info-title {
  line-height: 60px;
  color: #fff;
}
.info-img {
  position: absolute;
  right: -20px;
  bottom: 0;
  width: 40px;
  height: 40px;
}
.info-msg {
  position: relative;
  transition: all 0.3s;
}
.info-text {
  color: #fff;
  lines: 5;
  overflow: hidden;
  text-overflow: ellipsis;
}
.info-active {
  lines: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
.icon-hidden {
  position: absolute;
  display: inline-block;
  bottom: -38px;
  right: 25px;
}

.inroduce-bottom {
  flex-direction: row;
  justify-content: space-between;
  margin-top: 50px;
  align-items: center;
}
.bottom-left,
.bottom-right {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.talk-img {
  width: 44px;
  height: 44px;
  margin-left: 3px;
  margin-right: 3px;
  margin-top: 3px;
  margin-bottom: 3px;
}
.right-img {
  width: 22px;
  height: 22px;
  margin-left: 16px;
  margin-right: 16px;
}
.bottom-left {
  border-width: 2px;
  border-style: solid;
  border-color: #ee1c41;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding-right: 20px;
  height: 55px;
}
.bottom-text {
  color: #fff;
  line-height: 55px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.signed {
  justify-content: center;
  align-items: center;
  flex-direction: row;
  border-width: 2px;
  border-style: solid;
  border-color: #ee1c41;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  width: 137px;
  height: 55px;
}
.inroduce-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 750px;
}
.recommend-club {
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  background-color: #fff;
}
.recommend-title {
  padding-top: 20px;
  padding-bottom: 20px;
}
.list-wrapper {
  width: 750px;
  margin-top: 20px;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-around;
}
.item {
  width: 185px;
  justify-content: center;
  align-items: center;
}
.item-img {
  width: 100px;
  height: 100px;
  background: #ccc;
  justify-content: center;
  align-items: center;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}
.item-text {
  padding-top: 10px;
  font-size: 24px;
  width: 165px;
  word-wrap: break-word;
  text-align: center;
}
.linear {
  width: 750px;
  height: 10px;
  background-color: #ececec;
}
.issue {
  position: fixed;
  bottom: 0px;
  right: 0px;
  width: 150px;
  height: 150px;
}
.issue-item {
}
.issue-activity {
  position: fixed;
  width: 100px;
  height: 100px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  background-color: #fff;
  right: 20px;
  bottom: 20px;
  transform: rotate(270deg);
  justify-content: center;
  align-items: center;
}
.issue-item.topic {
  right: 20px;
  bottom: 20px;
}
.issue-pic {
  position: fixed;
  width: 100px;
  height: 100px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  transform: rotate(270deg);
  background-color: #fff;
  right: 20px;
  bottom: 20px;
  justify-content: center;
  align-items: center;
}
.issue-text {
  font-size: 30px;
}

.item-container {
  width: 750px;
  background-color: #fff;
  /* height: 1179px; */
}
.issue-item0 {
  position: fixed;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  width: 750px;
  height: 1000px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}
.issue-item0.activity {
  right: 0px;
  bottom: 10px;
}
.background {
  width: 750px;
  position: fixed;
  left: 0px;
  top: 50px;
  bottom: 0px;
  right: 0px;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 1;
}
.row {
  flex-wrap: wrap;
  flex-direction: row;
}
.share-box {
  width: 180px;
  height: 140px;
  text-align: center;
}
.share-img {
  width: 180px;
  height: 60px;
  display: inline-block;
  position: relative;
  margin-top: 33px;
}
.share-title {
  width: 180px;
  text-align: center;
  margin-top: 20px;
}
.share-foot {
  width: 750px;
  margin-top: 30px;
  border-top-width: 16px;
  border-top-style: solid;
  border-top-color: #848484;
}
.clubPhoto {
  width: 750px;
  position: relative;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}

.music-cover {
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 46px;
  margin-top: 20px;
  border-bottom-width: 7px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
}
.item-photo {
  width: 230px;
  height: 230px;
  background-color: #d9d9d9;
}
.item {
  margin-bottom: 28px;
  text-align: center;
}
.empty {
  width: 300px;
  height: 213px;
}
.empty-wrapper {
  position: absolute;
  top: 863px;
  width: 750px;
  height: 371px;
  align-items: center;
}
.bg {
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  width: 750px;
  background-color: #6d6d6d;
  opacity: 0.5;
}
</style>
