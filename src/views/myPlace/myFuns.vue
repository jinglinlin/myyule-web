<template>
        <div class="myFuns">
            <wxc-loading :show="isShow" loading-text="加载中" :need-mask="true"></wxc-loading>
            <div class="container">
                <div class="top" :style="{paddingTop:source==='iOS'?62:20+'px'}">
                    <div @click="_back()" class="left">
                        <image class="image-view" :src="imgUrl+'back.png'"></image>
                    </div>
                    <text class="font-32">{{iMobile ==userMobile?'我的好友':'TA的好友'}}</text>
                    <div class="right">
                    </div>
                </div>
                <wxc-tab-page ref="wxc-tab-page"
                              :tab-titles="iMobile === userMobile?tabTitles1:tabTitles2"
                              :tab-styles="tabStyles"
                              title-type="text"
                              wrap-bg-color="#ffffff"
                              :needSlider="needSlider"
                              :is-tab-view="isTabView"
                              :tab-page-height="tabPageHeight"
                              @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
                    <!-- 他的关注 -->
                    <list
                            class="item-container"
                            :style="{height: (tabPageHeight - tabStyles.height-60) + 'px'  }"
                            @loadmore="fetch" loadmoreoffset="60">
                        <cell v-for="(item,index) in membeData1" @click="pathOutPlace(item)" :key="index" :class="[source=='iOS'?'clubMembe-item':'clubMembe-item-android']">
                            <div class="cellstyle">
                                <div class="lefts">
                                    <div class="user-img">
                                        <image class="image-view pic" :src="'http://media2.myyule.cn/' + item.icon" alt="" width="120" height="120" placeholder="http://www.myyule.com/images/head-02.jpg"></image>
                                        <image v-if="item.userLevel>0" class="vip" :src="imgUrl+'vip'+item.userLevel+'.png'" ></image>

                                    </div>
                                    <div class="user-info">
                                        <text class="title">{{item.nickname}}</text>
                                        <text v-if="item.userType==0" class="font-22">{{item.schoolName}}</text>
                                        <div class="musicPic">
                                            <text v-if="item.userType==1" class="font-22">{{item.userTag}}</text>
                                            <image v-for="index in 14" v-if="item.certification==index" class="mark" :src="imgUrl+'song-gray'+index+'.png'" ></image>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="item.userRelation == 0 && item.mobile !== userMobile" @click="follow(item)" class="follow"><text class="font-26 color-pink">+ 关注</text></div>
                                <div v-if="(item.userRelation == 1 ||item.userRelation == 2) && item.mobile !== userMobile" @click="deleteFollow(item)" class="follow active"><text class="activeP font-26">已关注</text></div>
                            </div>
                        </cell>
                    </list>
                    <!-- 他的粉丝 -->
                    <list
                            class="item-container"
                            :style="{ height: (tabPageHeight - tabStyles.height-60) + 'px' }"
                            @loadmore="fetch" loadmoreoffset="60">
                        <cell v-for="(item,index) in membeData2" @click="pathOutPlace(item)" :key="index" class="clubMembe-item">
                            <div class="cellstyle">
                                <div class="lefts">
                                    <div class="user-img">
                                        <image class="image-view pic" :src="'http://media2.myyule.cn/' + item.icon" alt="" width="120" height="120" placeholder="http://www.myyule.com/images/head-02.jpg"></image>
                                        <image v-if="item.userLevel>0" class="vip" :src="imgUrl+'vip'+item.userLevel+'.png'" ></image>

                                    </div>
                                    <div class="user-info">
                                        <text class="title">{{item.nickname}}</text>
                                        <text v-if="item.userType==0" class="font-22 userp">{{item.schoolName}}</text>
                                        <div class="musicPic">
                                            <text v-if="item.userType==1" class="font-22">{{item.userTag}}</text>
                                            <image v-for="index in 14" v-if="item.certification==index" class="mark" :src="imgUrl+'song-gray'+index+'.png'" ></image>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="item.userRelation == 0" @click="follow(item)" class="follow"><text class="font-26 color-pink">+ 关注</text></div>
                                <div v-if="item.userRelation == 1||item.userRelation == 2" @click="deleteFollow(item)" class="follow active" ><text class="activeP font-26">已关注</text></div>
                            </div>
                        </cell>
                    </list>
                </wxc-tab-page>

            </div>
            <wxc-popup popup-color="#fff"
                       :show="isBottomShow"
                       @wxcPopupOverlayClicked="popupOverlayBottomClick"
                       pos="bottom"
                       ref="wxcPopup"
                       height="300"
                       width="750">
                <div class="demo-content">
                    <div class="titleMsg font-32">
                        <text class="font-32">{{confirmTitle}}</text>
                    </div>
                    <div @click="enter()" class="ok "><text class="font-32">确定</text></div>
                    <div class="cancel"  @click="isBottomShow=false">
                        <text class="font-32">取消</text>
                    </div>
                </div>
            </wxc-popup>
        </div>
</template>

<script>
import mixins from "../../mixins";
import { getUserFriend } from "../../api/myPlace";
import {
  getClubMember,
  putUserFollow,
  deleteUserFollow,
  getChat,
  deleteClub
} from "../../api/club.js";
import { WxcTabPage, Utils, WxcPopup } from "weex-ui";
import Config from "../../utils/config";
const dom = weex.requireModule("dom");
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");

export default {
  mixins: [mixins],
  components: { WxcTabPage, WxcPopup },
  data: () => ({
    tabTitles1: [{ title: "我的关注" }, { title: "我的粉丝" }],
    tabTitles2: [{ title: "TA的关注" }, { title: "TA的粉丝" }],
    tabStyles: Config.tabStyles4,
    tabList: [],
    needSlider: true,
    demoList: [1, 2],
    supportSlide: true,
    isTabView: true,
    tabPageHeight: 1334,
    tabPageWidth: "",
    iMobile: "",
    membeData1: [],
    membeData2: [],
    pageNo: 1,
    userMobile: "",
    confirmTitle: "", // confirm标题
    confirmType: "",
    tagIndex: 0,
    thisMember: {},
    isBottomShow: false
  }),
  created() {
    this.tabPageHeight = Utils.env.getPageHeight();
      if(this.webParam()){
          this.iMobile = this.webParam().mobile;
          this.userMobile = this.mobile;
          // 获取关注好友
          getUserFriend(
              {
                  mobile: this.iMobile,
                  pageNo: this.pageNo,
                  pageSize: 10,
                  relationType: "follow"
              },
              {token: this.mobile}
          )
              .then(res => {
                  if (res.status == 0) {
                      this.isShow = false;
                      this.membeData1 = this.membeData1.concat(res.object);
                  } else {
                      console.log(res.desc);
                      this.isShow = false;
                  }
              })
              .catch(err => {
              });
      }else {
          storage.getItem("data", event => {
              this.iMobile = JSON.parse(event.data).mobile;
              this.userMobile = this.mobile;
              // 获取关注好友
              getUserFriend(
                  {
                      mobile: this.iMobile,
                      pageNo: this.pageNo,
                      pageSize: 10,
                      relationType: "follow"
                  },
                  {token: this.mobile}
              )
                  .then(res => {
                      if (res.status == 0) {
                          this.isShow = false;
                          this.membeData1 = this.membeData1.concat(res.object);
                      } else {
                          console.log(res.desc);
                          this.isShow = false;
                      }
                  })
                  .catch(err => {
                  });
              console.log(this.membeData1);
          });
      }
  },
  mounted(){
    // 数据埋点
    this.putPageUrlLog(1403);
    },
  methods: {
    _back() {
      this.pop();
    },
    // 关注
    follow(item) {
      if (!this.mobile || this.mobile === "") {
         toLogin({ loginOut: "0" });
         return
      } else if (item.mobile == this.userMobile) {
        modal.toast({
          message: "不能关注自己！",
          duration: 1
        });
        return;
      }
      putUserFollow(
        {
          mobile: this.userMobile,
          toMobile: item.mobile
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            modal.toast({
              message: "已关注",
              duration: 1
            });
            item.userRelation = 1;
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
    },
    // 取消关注
    deleteFollow(item) {
      this.thisMember = item;
      this.confirmTitle = "确认取消关注?";
      this.confirmType = "deleteFollow";
      this.isBottomShow = true;
    },
    getMemberVal(data) {
      if (data === "deleteFollow") {
        this.thisMember.userRelation = 0;
      }
    },
    // 跳转到其他人的地盘
    pathOutPlace(item) {
      this.push2("/views/myPlace/myPlace", { mobile: item.mobile });
    },
    // 加载下一页
    fetch(event) {
        // modal.alert({
        //   message: this.tagIndex
        // });
      if (!this.isShow) {
        this.isShow = true;
        this.pageNo += 1;
        if (this.tagIndex == 0) {
          getUserFriend(
            {
              mobile: this.iMobile,
              pageNo: this.pageNo,
              pageSize: 10,
              relationType: "follow"
            },
            { token: this.mobile }
          )
            .then(res => {
              if (res.status == 0) {
                this.membeData1 = this.membeData1.concat(res.object);
                this.isShow = false;
              } else {
                this.isShow = false;
                modal.alert({ message: res.desc });
              }
            })
            .catch(err => {});
        } else if (this.tagIndex == 1) {
          getUserFriend(
            {
              mobile: this.iMobile,
              pageNo: this.pageNo,
              pageSize: 10,
              relationType: "fan"
            },
            { token: this.mobile }
          )
            .then(res => {
              if (res.status == 0) {
                this.membeData2 = this.membeData2.concat(res.object);
                this.isShow = false;
              } else {
                this.isShow = false;
                modal.alert({ message: res.desc });
              }
            })
            .catch(err => {});
        }
        setTimeout(() => {}, 800);
      }
    },
    wxcTabPageCurrentTabSelected(e) {
      const self = this;
      const index = e.page;
      this.tagIndex = index;
      this.pageNo = 1;
      if (index == 1) {
        if (this.membeData2.length == 0) {
          this.isShow = true;
          getUserFriend(
            {
              mobile: this.iMobile,
              pageNo: this.pageNo,
              pageSize: 10,
              relationType: "fan"
            },
            { token: this.mobile }
          )
            .then(res => {
              if (res.status == 0) {
                this.isShow = false;
                this.membeData2 = this.membeData2.concat(res.object);
              } else {
                this.isShow = false;
                modal.alert({ message: res.desc });
              }
            })
            .catch(err => {});
        }
      }
    },
    wxcPanItemPan(e) {
      if (Utils.env.supportsEBForAndroid()) {
        this.$refs["wxc-tab-page"].bindExp(e.element);
      }
    },
    popupOverlayBottomClick() {
      this.isBottomShow = false;
    },
    show() {
      this.isBottomShow = true;
      getChat(
        {
          mobile: this.mobile,
          resId: this.clubId,
          resType: "club"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            const status = openChat({ chatacct: "2", chattype: res.object })
              .status;
            // const status = openPlayer({ show: "player" }).status;
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    },
    enter() {
      if (this.confirmType === "deleteClub") {
        deleteClub(
          {
            clubId: this.clubId,
            mobile: this.thisMember.mobile
          },
          { token: this.mobile }
        )
          .then(res => {
            if (res.status == 0) {
              this.isBottomShow = false;
              this.getMemberVal(this.confirmType);
            } else {
              console.log(res.desc);
            }
          })
          .catch(err => {});
      } else if (this.confirmType === "deleteFollow") {
        deleteUserFollow(
          {
            mobile: this.mobile,
            toMobile: this.thisMember.mobile
          },
          { token: this.mobile }
        )
          .then(res => {
            if (res.status == 0) {
              this.isBottomShow = false;
              this.getMemberVal(this.confirmType);
            } else {
              console.log(res.desc);
            }
          })
          .catch(err => {});
      } else if (this.confirmType === "chat") {
        this.isBottomShow = false;
        // 进入群聊
        getChat(
          {
            mobile: this.mobile,
            resId: this.clubId,
            resType: "club"
          },
          { token: this.mobile }
        )
          .then(res => {
            if (res.status == 0) {
              openChat({ chatacct: "2", chattype: res.object });
            } else {
              console.log(res.desc);
            }
          })
          .catch();
      }
    }
  }
};
</script>
<style src="../../assets/style/index.scss">
</style>
<style  scoped>
.font-22 {
  font-size: 22px;
}
p {
  font-size: 26px;
}
.image-view {
  width: 61px;
  height: 61px;
}
.myFuns {
  position: absolute;
  top: 0;
  left: 0;
  width: 750px;
  flex: 1;
  /*height: ;*/
  /*z-index: 10;*/
}

.container {
  background-color: #fff;
  flex: 1;
}
.top {
  width: 750px;
  background-color: #fff;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding-right: 40px;
  padding-left: 40px;
  padding-bottom: 22px;
  padding-top: 77px;
}
.title {
  color: #000;
  line-height: 61px;
  lines: 1;
  font-size: 26px;
}
.left {
  width: 61px;
  height: 61px;
}
.right {
  width: 61px;
  height: 61px;
}

.item-container {
  width: 750px;
  background-color: #fff;
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

.clubMembe-item {
  flex-direction: row;
  justify-content: space-between;
  padding-top: 47px;
  padding-bottom: 47px;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 10px 10px #f6f6f6;
  border-radius: 15px;
}
.clubMembe-item-android{
  flex-direction: row;
  justify-content: space-between;
  padding-top: 47px;
  padding-bottom: 47px;
  align-items: center;
  background-color: #fff;
  border-radius: 15px;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: #ececec;
}
.lefts {
  flex-direction: row;
  justify-content: space-between;
}
.range {
  font-size: 60px;
  line-height: 120px;
}
.user-img {
  position: relative;
  width: 164px;
  height: 164px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: white;
}
.range {
  position: absolute;
  right: -5px;
  top: -5px;
  font-size: 24px;
  color: #fff;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  width: 48px;
  height: 48px;
  text-align: center;
  line-height: 48px;
  background-color: #ee1c41;
}

.user-info {
  width: 300px;
}
.userp {
  padding-bottom: 18px;
  padding-top: 20px;
  color: #828282;
}

.follow {
  position: absolute;
  right: 40px;
  top: 0px;
  width: 110px;
  height: 60px;
  border-width: 2px;
  border-style: solid;
  border-color: #ee1c41;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.active {
  background-color: #ee1c41;
  height: 60px;
}
.activeP {
  color: #fff;
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
.pic {
  width: 120px;
  height: 120px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}
.cellstyle {
  width: 750px;
  padding-left: 20px;
  padding-right: 20px;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.titleMsg {
  width: 750px;
  background-color: #fff;
  height: 100px;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  /*@include border-bottm(1px,solid,rgba(206,206,206,1));*/
}
.ok {
  width: 750px;
  background-color: #fff;
  height: 100px;
  margin-bottom: 10px;
  color: #000;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ccc;
}
.cancel {
  width: 750px;
  background-color: #fff;
  height: 100px;
  color: #000;
  justify-content: center;
  flex-direction: row;
  align-items: center;
}
.mark {
  width: 44px;
  height: 44px;
}
.demo-content {
  width: 750px;
}
.vip {
  position: absolute;
  width: 44px;
  height: 44px;
  bottom: 22px;
  right: 22px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  background-color: #ee1c41;
  justify-content: center;
  flex-direction: row;
  align-items: flex-end;
}
.musicPic {
  /* justify-content: center; */
  flex-direction: row;
  align-items: center;
  height: 44px;
}

.mark {
  width: 44px;
  height: 44px;
  margin-left: 10px;
}
/*.vip {*/
/*position: absolute;*/
/*width: 44px;*/
/*height: 44px;*/
/*bottom: 0;*/
/*right: 0;*/
/*border-bottom-left-radius: 90px;*/
/*border-bottom-right-radius: 90px;*/
/*border-top-left-radius: 90px;*/
/*border-top-right-radius: 90px;*/
/*background-color: #ee1c41;*/
/*justify-content: center;*/
/*flex-direction: row;*/
/*align-items: flex-end;*/
/*}*/
</style>
