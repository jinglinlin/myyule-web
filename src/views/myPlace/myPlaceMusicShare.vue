<template>
  <div class="myPlaceMusic active">
    <scroller class="scroller"
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
      <div class="user-signature">
        <text class="user-school">{{userInfo.signature}}</text>
      </div>

      <text class="content-title">官方粉丝俱乐部</text>
      <div class="funs-club">
        <div v-for="(item,index) in clubList" :key="index" @click="push2('/views/club/club_layout', { clubId: item.clubId })" class="club-item">
          <div class="item-wrapper">
            <div class="left">
              <image class="user-img-1"  resize="cover" :src="item.clubLogo?'http://media2.myyule.cn/'+item.clubLogo:'http://www.myyule.com/images/music/photo192.jpg'" placeholder="http://www.myyule.com/images/music/photo192.jpg" alt=""></image>
              
              <div class="user-info">
                <text class="color-black info-text font-26 ">{{item.clubName}}</text>
                <text class="font-24 color-pink info-text">{{item.clubDesc}}</text>
                <div style="flex-direction:row;">
                  <text class="info-text color-gray font-22">人气{{item.clubMemberNum}} 话题{{item.topicNum}}</text>
                </div>
              </div>
            </div>
            <div v-if="item.clubRelation"  class="follow"><text class="follow-span">已加入</text></div>
            <div v-if="!item.clubRelation" @click="joinClub(item)"  class="follow2"><text class="follow2-text">加入</text></div>
          </div>
        </div>
        <div v-if="clubList.length==0" @click="toClub()" class="club-item">
          <div class="item-wrapper">
            <div class="left">
              <image class="user-img-1" resize="cover" :src="userInfo.icon?('http://media2.myyule.cn/'+userInfo.icon):(imgUrl+'userIcon.png')" :placeholder="imgUrl+'userIcon.png'"></image>
              
              <div class="user-info">
                <text class="info-text color-black font-26 ">{{userInfo.nickname}}</text>
                <text class="font-24 color-pink info-text">官方认证粉丝俱乐部</text>
                <div style="flex-direction:row;">
                  <text class="info-text font-26">人气 0</text>
                </div>
              </div>
            </div>
            <div @click="createClub()" class="follow"><text class="follow-span">{{text}}</text></div>
          </div>
        </div>
      </div>
      
      <text class="content-title font-30">速发音乐作品</text>
      <musicList v-if="musicList.length!==0" title="数发单曲" :webShare="true" :musicData="musicList"></musicList>
      <!-- <musicList v-if="albumList.length!==0" title="数发专辑" :musicData="albumList"></musicList> -->
      <!-- 暂定 -->
      <!-- <musicList v-if="mvList.length!==0" title="视频" :musicData="mvList"></musicList> -->

      <text v-if="activityData.length!==0" class="content-title font-30">TA的动态</text>
      <!-- 动态 -->
      <lottery-notice :activityData="activityData"></lottery-notice>
    </div>
    </scroller>
    <!-- 底部 -->
    <div v-if="iMobile !== mobile" class="myPlace-bottom">
      <text @click="follow()" class="color-pink font-30 myPlace-item">{{userInfo.userRelation?'已关注':'+ 关注'}}</text>
      <text @click="talk()" class="font-30 myPlace-item">私信</text>
    </div>
  </div>
</template>

<script>
import { getMVList } from "../../api/music";
import mixins from "../../mixins";
import musicList from "../../components/musicList.vue";
import lotteryNotice from "./lotteryNotice.vue";
import { WxcLightbox } from "weex-ui";
import { putClubMember } from "../../api/club";
import { toLogin, openChat,getUser,sharePage } from "../../api/weex";

import {
  putUserFollow,
  getClubList,
  deleteUserFollow,
  putMusicianClub
} from "../../api/club";
import {
  getSong,
  getAlbum,
  putLotteryNotice,
  getUserPhoto
} from "../../api/myPlace";
const modal = weex.requireModule("modal");
export default {
  mixins: [mixins],
  components: { musicList, lotteryNotice, WxcLightbox },
  props: {
    iMobile: {},
    userInfo: {}
  },
  watch: {
    iMobile(curVal, oldVal) {
      if (curVal !== ""||oldVal !== "") {
        this.request();
      }
    }
  },
  data() {
    return {
      // myMobile:getUser().mobile,
      mvList: [],
      imageList: [],
      activityData: [],
      photoList: [],
      cover: [],
      infoKey: false,
      clubList: [],
      musicList: [],
      albumList: [],
      tabPageHeight2: 1234,
      pageNo: 1,
      show: false,
      text: "申请",
      creatClubId: ""
    };
  },
  mounted() {
    if(this.webVersion){
      this.request();
    }
  },
  created(){
    // 适配
    // this.tabPageHeight2 = weex.config.env.deviceHeight - 160

  },
  computed: {
    filteredCover() {
      return this.cover.slice(0, 4);
    }
  },
  methods: {
    // 初始化
    request() {
      // modal.alert({message:this.iMobile})
      // 获取官方粉丝俱乐部
      getClubList(
        {
          mobile: this.iMobile,
          userEmp: 1,
          clubType: 3,
          pageNo: 1,
          pageSize: 1
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.clubList = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
      // 获取音乐作品
      getSong(
        {
          mobile: this.iMobile,
          songStatus: 4,
          pageNo: 1,
          pageSize: 20
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.musicList = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
      // 获取相册
      getUserPhoto(
        {
          mobile: this.iMobile,
          pageNo: 1,
          pageSize: 4
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.cover = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
      // 获取专辑
      getAlbum(
        {
          mobile: this.iMobile,
          albumStatus: 4,
          pageNo: 1,
          pageSize: 20
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.albumList = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
      // 获取视频mv
      getMVList(
        {
          mobile: this.iMobile,
          pageNo: 1,
          pageSize: 20
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.mvList = res.object;
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
      // 获取动态
      this.getNotice();
    },
    toClub() {
      // 站外分享点击事件处理
      this.shareEvent();
      if (this.text === "已创建") {
        this.push2("/views/club/club_layout", { clubId: this.creatClubId });
      }
    },
    // 创建粉丝俱乐部
    createClub() {
      // 站外分享点击事件处理
      this.shareEvent();
      if(this.iMobile === this.mobile){
        if (!this.mobile || this.mobile === "") {
           toLogin({ loginOut: "0" });
        } else {
          putMusicianClub({ mobile: this.iMobile }, { token: this.mobile })
            .then(res => {
              if (res.status == 0) {
                modal.toast({ message: "创建成功" });
                this.creatClubId = res.object;
                this.text = "已加入";
              } else {
                modal.toast({ message: res.desc });
              }
            })
            .catch();
        }
      }else{
        modal.toast({message:'非本人无法申请创建粉丝俱乐部',duration:1})
      }
    },
    // 相册放大
    openLightBox(item) {
      this.imageList[0] = { src: "http://media2.myyule.cn/" + item.path };
      this.show = true;
    },
    wxcLightboxOverlayClicked() {
      // 无状态组件，需要在此次关闭
      this.show = false;
    },
    _infoKey() {
      if (this.infoKey) {
        this.infoKey = false;
      } else {
        this.infoKey = true;
      }
    },
    // 获取动态
    getNotice() {
      putLotteryNotice(
        {
          mobile: this.iMobile,
          scope: "my",
          pageNo: this.pageNo,
          pageSize: 4
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.activityData = this.activityData.concat(res.object);
          } else {
            console.log(res.desc);
          }
        })
        .catch(err => {});
    },
    // 创建部落
    // pathCreateClub() {
    //   this.push("/createClub");
    // },
    // 私信(与客户端交互)
    talk() {
      // 站外分享点击事件处理
      this.shareEvent();
      if (!this.mobile || this.mobile === "") {
         toLogin({ loginOut: "0" });
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
      // 站外分享点击事件处理
      this.shareEvent();
      if (!this.mobile || this.mobile === "") {
         toLogin({ loginOut: "0" });
         return
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
              modal.toast({ message: "关注成功" });
              this.userInfo.followNum +=1;
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
    // 加入部落
    joinClub(item) {
      // 站外分享点击事件处理
      this.shareEvent();
      if (this.mobile !== "") {
        if (!this.isShow) {
          this.isShow = true;
          putClubMember(
            {
              clubId: item.clubId,
              mobile: this.mobile
            },
            { token: this.mobile })
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                item.clubRelation = 1;
                modal.alert({
                  message: "加入部落成功!",
                  duration: 1
                });
              } else {
                modal.toast({
                  message: res.desc,
                  duartion: 1
                });
                console.log(res.desc);
              }
            })
            .catch(err => {});
        }
      } else {
        modal.toast({
          message: "请登录!",
          duration: 1
        });
        toLogin({ loginOut: "0" });
      }
    },
    // 加载下一页
    fetchPage(event) {
      // if (!this.isShow) {
      //   this.pageNo += 1;
      //   this.getNotice();
      // }
    },
    
    // 分享
    share() {
      let _this = this;
      let sObj = {
        title: "分享用户：" + _this.userInfo.nickname,
        desc:  _this.userInfo.signature,
        web_url: "http://www.myyule.com/app/down",
        img_url: _this.userInfo.icon?("http://media2.myyule.cn/" + _this.userInfo.icon):(_this.imgUrl+'userIconBg.png'),
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
.myPlaceMusic {
  width: 750px;
  background: #fff;
  flex:1;
}
.scroller,.wrapper {
  position: relative;
  background: #fff;
}
.content-title {
  padding-bottom: 34px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 34px;
  font-size: 26px;
  width:750px;
  text-align:center;
  font-weight:bold;
}
.club-item {
  margin-bottom: 20px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
  border-radius:20px;
  box-shadow: 0px 6px 20px 5px #ececee;
  background-color: #fff;
  border-right-width: 2px;
  border-right-style: solid;
  border-right-color: rgba(236, 236, 236, 1);
}
.item-wrapper {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
  padding-left: 23px;
  padding-right: 23px;
  padding-top: 24px;
}
.left {
  flex-direction: row;
  justify-content: space-around;
}
.range {
  font-size: 60px;
  line-height: 120px;
}
.user-img-1 {
  position: relative;
  margin-left: 20px;
  margin-right: 20px;
  width: 120px;
  height: 120px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  background-color: #d9d9d9;
  justify-content: center;
  align-items: center;
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
.title {
  color: #000;
}
.user-info{
  width:300px;
}
.info-text {
  padding-bottom: 15px;
  padding-top: 3px;
  lines:1;
}
.follow {
  width: 110px;
  height: 60px;
  border-width: 2px;
  border-style: solid;
  border-color: #ee1c41;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.follow-span {
  text-align: center;
  line-height: 60px;
  color: #ee1c41;
  font-size: 26px;
}

.follow2-text {
  font-size: 26px;
  color: #fff;
}
.follow2 {
  width: 110px;
  height: 50px;
  background-color: #ee1c41;
  border-width: 2px;
  border-style: solid;
  border-color: #ee1c41;
  border-radius: 30px;
  justify-content:center;
  align-items:center;
}
.user-introduce {
  position: relative;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
  box-shadow: 0px 0px 20px 8px #ececee;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background-color: #fff;
}
.introduce-span {
  line-height: 60px;
  font-size: 26px;
}
.img {
  position: absolute;
  right: 0px;
  bottom: 10px;
  width: 40px;
  height: 40px;
}
.introduce-wrapper {
  position: relative;
  width: 650px;
  padding-bottom: 20px;
  padding-top: 10px;
}
.introduce-span {
  line-height: 40px;
}
.introduce-span.active {
  lines: 2;
}
.introduce-span.icon-hidden {
  position: absolute;
  bottom: -38px;
  right: 25px;
}

.item-container {
  width: 750px;
  background-color: #fff;
  padding-bottom: 115px;
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
.title {
  color: #000;
  line-height: 61px;
}
.left,
.right {
  flex-direction: row;
  align-items: center;
}
.image-view {
  width: 61px;
  height: 61px;
}

.user-msg {
  position: relative;
  width: 750px;
  height: 690px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
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
.my-bills {
  position: absolute;
  right: 0;
  top: 165px;
  width: 179px;
  height: 80px;
  padding-left: 10px;
  border-bottom-left-radius: 90px;
  border-top-left-radius: 90px;
  background-color: #ee1c41;
}
.bills-text {
  text-align: center;
  line-height: 80px;
  font-size: 26px;
}
.user-img {
  position: relative;
  align-items: center;
  justify-content: center;
}
.img-vip {
  width: 170px;
  height: 170px;
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
  left: 0;
  width:750px;
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
.user-signature{
  margin-left:65px;
  margin-right:65px;
  width:620px
}
.user-school {
  lines:2;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  padding-top: 11px;
  text-indent:2em;
  color: #000;
  font-size:24px;
}
.font-20 {
  color: #fff;
}
.school-img {
  width: 44px;
  height: 44px;
}
.msg-bottom {
  flex-direction: row;
  justify-content: center;
  padding-top: 22px;
}
.bottom-span {
  padding-left: 10px;
  padding-right: 10px;
}
.bottom-follow {
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: #fff;
}
.music-cover {
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 20px;
  padding-bottom: 46px;
  border-bottom-width: 7px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
}
.list-wrapper {
  margin-top: 20px;
  flex-direction: row;
  justify-content: space-around;
}
.item {
  text-align: center;
}
.item-img {
  width: 150px;
  height: 150px;
  background: #ececec;
}
.img-more {
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  margin-top: 53px;
  margin-bottom: 53px;
}
.img {
  width: 40px;
  height: 40px;
}
.myPlace-bottom {
  width: 750px;
  background-color: #fff;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #ececec;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.myPlace-item {
  padding-top: 35px;
  padding-bottom: 35px;
  padding-left: 152px;
  padding-right: 152px;
}
.myPlace-item.color-pink {
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: #ececec;
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
