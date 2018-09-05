<template>
  <div class="second-container" @viewappear="viewappear">
  	<div class="top" :style="{paddingTop:source==='iOS'?62:20+'px'}">
  	  <image class="image-view" :src='imgUrl+"back.png"' @click="pop()"></image>
      <text class="title font-32">活动详情</text>
      <div class="left-collect row">
      	<image v-if="object.isCollect==0" @click="toPutCollect(object)" class="image-view" :src='imgUrl+"unstyle_1.png"' ></image>
        <image v-if="object.isCollect==1" @click="toDeleteCollect(object)" class="image-view" :src='imgUrl+"style.png"' ></image>
        <image class="image-view"  @click="share()" :src='imgUrl+"share.png"'></image>
      </div>
  	</div>
  	<scroller class="now-box">
      <div class="clubActivity-item1">
        <div class="activity-banner" >
          <div class="img-show">
	          <image class="image-view1" resize="cover" :src="object.logo"></image>
	        </div>
	        <div class="activity-static" v-if="light">
            <text class="banner-text">{{stateText}}</text>
          </div>
        </div>
        <div class="activity-content">
          <text class="act-tit1">{{object.title}}</text>
	        <div class="activity-title1">
	        	<div class="asd">
              <text class="asd-text1" v-for="(tag,index) in tags" :key="index">#{{tag}}#</text>
	        	</div>
            <text class="content-span" @click="toScene(object)">{{object.actType}}</text>
	        </div>
	        <div class="activity-title">
        		<div class="activity-row1">
			      	<image class="actImg2-view" :src='imgUrl+"see.png"'></image>
			      	<text class="act-text1">{{object.seeNum}}</text>
		    	  </div>
        		<text class="act-text2">想参加{{object.joinNum}}人</text>
	        </div>
	        <div class="activity-title">
        		<div class="activity-row1">
			      	<image class="actImg2-view" :src='imgUrl+"adress.png"'></image>
			      	<text class="font-26 act-text1">{{object.address}}</text>
		    	  </div>
			      <image class="img1-view2" :src='imgUrl+"right-gray.png"' @click="openMap(object)"></image>
	        </div>
	        <div class="activity-title">
        		<div class="activity-row1">
			      	<image class="actImg2-view" :src='imgUrl+"time.png"'></image>
			      	<text class="font-26 act-text3">{{object.starttime}}-{{object.endtime}}</text>
		    	  </div>
	        </div>
	        <div class="activity-title">
	        	<div class="activity-row1">
		      	   <image class="actImg2-view" :src='imgUrl+"feeType.png"'></image>
		      	   <text class="font-24 act-text2" v-if="object.feeType==0">免费</text>
            	 <text class="font-24 act-text2" v-if="object.feeType!=0">{{object.fee}}.00</text>
	    	    </div>
  		    	<!-- <div class="activity-row2">
  			      <text class="font-24 act-text2 colbaf " @click="openMask">查看二维码</text>
  			      <image class="actImg2-view" :src='imgUrl+"right-gray.png"'></image>
  		    	</div> -->
	        </div>
	        <div class="detail-user" @click="toMyplace(object)">
	        	<div class="activity-row1">
              		<image class="img1-view1" resize="cover" :src="userData.icon"></image>
			    	<div class="user-data">
  			    		<text class="font-32 font-w data-span1">{{userData.nickname}}</text>
  			    		<text class="data-span2">{{userData.schoolName}}</text>
  			    	</div>
	        	</div>
	        	<div class="activity-row2">
			      	<div class="user-follower">
  			    		<text v-if="userRelation == 0" @click="followUser" class="follow-btn1">+关注</text>
  			    		<text v-if="userRelation == 1" @click="notFollowUser" class="follow-btn1">已关注</text>
  			    		<text v-if="userRelation == 2" @click="notFollowUser" class="follow-btn1">互相关注</text>
  			    		<text class="userRelationNum">{{userData.fanNum}}人已关注</text>
  			    	</div>
  			      <image class="img1-view2" :src='imgUrl+"right-gray.png"'></image>
  		    	</div>
	        </div>
	        <div class="detail-text">
	        	<div class="detail-box">
	        		 <text class="font-32 font-w color-EF1842">|</text>
	        		 <text class="font-32 font-w margin-10">活动详情</text>
	        	</div>
            <div class="clubList">
              <div class="clubTag" v-for="(item,index) in clubli" @click="toClub(item)" :key="index">
                <text class="follow-btn2">{{item.title}}</text>
              </div>
            </div>
		    		<text class="tit-text" lines="5">{{object.content}}</text>
	        </div>
	        <div class="detail-img" >
	        	<div class="img2" v-for="(img,index) in images"  :key="index" @click="openLightBox(images,index)">
			      	<image class="img2-view2" resize="cover" :key="index" :src='img'></image>
			    	</div>
	        </div>
	        <div class="detail-tips" v-if="light">
	        	<div class="tip-line"></div>
	        	<text class="tip-text font-32 font-w600">精彩评论</text>
	        </div>
	        <div class="detail-tips-area" >
	        	<text class="tip-text1 font-32" v-if="num == 0">随便留下点痕迹吧~</text>
	        	<div class="detail-comment" v-if="num != 0">
	        		<div class="tip-title">
	        			<text class="comtip-text">{{num}}条</text>
	        		</div>
		        	<div class="tip-comment-detial" v-for="(item,index) in comment" :key="index">
					      <image class="img3-view" :src="item.icon"></image>
		        		<div class="tip-content" v-if="item.parentComment != null">
                  <text class="img3-span">{{item.nickname}}</text>
		        			<text class="tip-contSpan1">{{item.content}}</text>
		        			<text class="tip-contSpan1">回复@{{item.toNickname}}:{{item.parentComment.content}}</text>
		        			<div class="tip-content-sort">
		        				<text class="tip-timeSpan">{{item.createtime}}</text>
		        				<div class="img6">
							      	<image class="img6-view" :src='imgUrl+"comment.png"'  @click="toReplay(object,item)"></image>
							    	</div>
		        				<div class="imgSpanRow">
							      	<image class="img6-view" @click="toThumb(object,item)" v-if="item.isThumb == 0" :src='imgUrl+"thumbNum.png"'></image>
							      	<image class="img6-view" @click="toDeleteThumb(object,item)" v-if="item.isThumb == 1" :src='imgUrl+"thumbNumActive.png"'></image>
                      <text class="tip-contSpan">{{item.thumbNum}}</text>
							    	</div>
							    	<text class="tip-contSpan" v-if="item.mobile == mobile" @click="toDeletecomment(object,item)">删除</text>
		        			</div>
		        		</div>
                <div class="tip-content" v-if="item.parentComment == null">
                  <text class="img3-span">{{item.nickname}}</text>
                  <text class="tip-contSpan1">{{item.content}}</text>
                  <div class="tip-content-sort" >
                    <text class="tip-timeSpan">{{item.createtime}}</text>
                    <div class="img6">
                      <image class="img6-view" :src='imgUrl+"comment.png"'  @click="toReplay(object,item)"></image>
                    </div>
                    <div class="imgSpanRow">
                      <image class="img6-view" @click="toThumb(object,item)" v-if="item.isThumb == 0" :src='imgUrl+"thumbNum.png"'></image>
                      <image class="img6-view" @click="toDeleteThumb(object,item)" v-if="item.isThumb == 1" :src='imgUrl+"thumbNumActive.png"'></image>
                      <text class="tip-contSpan">{{item.thumbNum}}</text>
                    </div>
                    <text class="tip-contSpan"  v-if="item.mobile == mobile"  @click="toDeletecomment(object,item)">删除</text>
                  </div>
                </div>
		        	</div>
	        	</div>
	        </div>
	      </div>
      </div>
   </scroller>
   <!-- 底部悬浮操作 -->
      <div class="detail-fun">
        <div class="detail-btn" @click="toComment(object)">
          <div class="img4">
            <image class="img4-view1" :src='imgUrl+"comment.png"'></image>
          </div>
          <text class="img4-span">留言</text>
        </div>
        <div class="detail-btn-db" @click="enterGroup()">
          <div class="img5">
            <image class="img5-view1" :src='imgUrl+"chat.png"'></image>
          </div>
          <text class="img5-span">群聊</text>
        </div>
        <div class="detail-btn1" v-if="object.mobile!=mobile" @click="toTicket(object)">
          <text class="btn1-span">{{joinText}}</text>
        </div>
        <div class="detail-btn2" v-if="object.mobile==mobile" @click="toTicket1(object)">
          <text  class="btn2-span">查看参与人</text>
        </div>
     </div>
     <wxc-loading :show="isLoading"
                   :type="type"
                   :loading-text="loadingText"
                   :interval="interval"
                   :need-mask="isBool"></wxc-loading>
      <transition name="move">
    	<div class="issue-item activity"  v-if="modalKey">
    		<div class="background"></div>
    		<div class="share-view">
	    	<div class="row">
	    		<div v-for="(item,index) in gam" :key="index" class="share-box">
		  			<div class="share-img">
			      	<image class="share-view-img" :src='imgUrl+item.src'></image>
			    	</div>
		  			<text class="share-title">
		  				{{item.text}}
		  			</text>
		  		</div>
	    	</div>
	    	<div class="sbox"></div>
	    	<div class="row">
	    		<div v-for="(item,index) in funUrl" class="share-box">
		  			<div class="share-img">
			      	<image class="share-view-img" :src='imgUrl+item.src'></image>
			    	</div>
		  			<text class="share-title">
		  				{{item.text}}
		  			</text>
		  		</div>
	    	</div>
	  		<div class="share-foot">
		  		<text class="remove font-32" @click="close">取消</text>
		  	</div>
		  	</div>
    	</div>
    </transition>
    <wxc-lightbox
      ref="wxc-lightbox"
      height="800"
      :show="lightBoxShow"
      :image-list="imageList"
      :show-indicator = false
      @wxcLightboxOverlayClicked="wxcLightboxOverlayClicked">
    </wxc-lightbox>
    <!-- 下载提示 -->
    <download-notice></download-notice>
    
		<div v-if="isShow" @click="isShow = !isShow" class="background"></div>
		<div class="code" v-if="isShow" @click="isShow = !isShow">
			<image class="codeImg" :src="codeSrc"></image>
		</div>
  </div>
</template>
<script>
import mixins from "../../../mixins";
import downloadNotice from "../../../components/downloadNotice.vue";
import { WxcLoading, WxcMask, WxcLightbox } from "weex-ui";
import { sharePage, openChat, toLogin } from "../../../api/weex";
const myyuleMap = weex.requireModule("MyyuleLocation"); //打开地图
import {
  putActivityInfo,
  putActivityMember,
  putComment,
  getComment,
  putThumb,
  deleteThumb,
  deleteComment,
  getChat,
  getUserRelation,
  putUserFollow,
  deleteUserFollow,
  getUserInfo,
  putCollect,
  deleteCollect,
  getActivityUser
} from "../../../api/activity.js";
import { getClubList } from "../../../api/club.js";
import { getCookie } from "../../../utils/cookie.js";
import qrcode from "../../../utils/qrcode";
var storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
export default {
  components: {
    WxcLightbox,
    WxcLoading,
    downloadNotice,
    WxcMask
  },
  mixins: [mixins],
  name: "share-success",
  data() {
    return {
      isLottery: "", //是否有抽奖 0否 1是
      hasLottery: "", //是否抽奖 0否 1是
      codeSrc: "", // 二维码地址
      title: "活动分类",
      type: "类型",
      stateText: "",
      heart: "http://172.21.10.23:30111/style.png",
      object: {},
      images: [],
      tags: [],
      clubli: [],
      active: 1,
      userData: {},
      resId: "", //this.$route.query.resId,
      judge: "", // this.$route.query.judge,
      comment: [],
      num: "",
      groupId: "",
      isBackground: "true",
      isShow: false,
      toMobile: "",
      userRelation: "",
      //    分享
      modalKey: false,
      gam: [
        { name: "in", text: "站内好友", src: "in.png" },
        { name: "schoolFellow", text: "校友圈", src: "schoolFellow.png" },
        { name: "weChat", text: "微信好友", src: "weChat.png" },
        { name: "moments", text: "微信朋友圈", src: "moments.png" },
        { name: "weibo", text: "新浪微博", src: "weibo.png" },
        { name: "qq", text: "腾讯QQ", src: "qq.png" }
      ],
      funUrl: [
        { name: "copy", text: "复制链接", src: "copy.png" },
        { name: "report", text: "举报", src: "report.png" }
      ],
      piclist: [],
      light: true,
      isLoading: false,
      isBool: true,
      interval: 0,
      type: "default",
      loadingText: "",
      mapUrl: "http://testmyyule.teamshub.com/weexMyl/map.html?isLocal=&lng=",
      loadTime: true,
      joinStatus: "", //1表示已参加，空表示未参加
      joinText: "我 想 参 加",
      stop: false,
      activityIsSign: "", //判断用户是否签到活动
      userEmp: "", //用户职位
      signCode: "", //签到码
      imageList: [],
      lightBoxShow: false
    };
  },
  created() {
    if (this.webParam()) {
      this.resId = this.webParam().resId;
      this.judge = this.webParam().judge;
      // 获取活动详情
      this.init();
      this.comDetail();
    } else {
      storage.getItem("data", event => {
        this.resId = JSON.parse(event.data).resId;
        this.judge = JSON.parse(event.data).judge;
        // 获取活动详情
        this.init();
        this.comDetail();
      });
    }
  },
  mounted() {
    // 数据埋点
    if (this.webVersion) {
      this.putPageUrlLog(1801);
    } else {
      this.putPageUrlLog(1604);
    }
  },
  methods: {
    // 获取活动详情
    init() {
      this.isLoading = true;
      putActivityInfo(
        {
          appid: this.appid,
          resId: this.resId,
          mobile: this.mobile
        },
        { token: this.mobile }
      )
        .then(res => {
          this.isLoading = false;
          this.userData = {};
          if (res.status == 0) {
            this.object = res.object;
            var nowTime = res.object.currentTime,
              lastTime = nowTime.substr(0, 16);
            var startDate = res.object.starttime;
            var endDate = res.object.endtime;
            if (lastTime < startDate) {
              this.stateText = "即将开始";
              this.judge = 0;
            } else if (lastTime >= startDate && lastTime <= endDate) {
              this.stateText = "进行中";
              this.judge = 1;
            } else if (lastTime > endDate) {
              this.stateText = "已结束";
              this.judge = 2;
            } else {
              this.stateText = "...";
            }
            if (this.object.logo.substr(0, 4) != "http") {
              this.object.logo = "http://media2.myyule.cn/" + this.object.logo;
            }
            this.images = res.object.images;
            for (let i = 0; i < this.images.length; i++) {
              if (this.images[i].substr(0, 4) != "http") {
                this.images[i] = "http://media2.myyule.cn/" + this.images[i];
              }
              this.piclist.push({
                picurl: this.images[i]
              });
            }
            this.toMobile = res.object.mobile;
            this.tags = res.object.actTag;
            this.clubli = res.object.clubli.splice(0, 3);
            this.getCommentman();
            //判断活动是否需要签到isSign 0否 1是默认0
            if (this.mobile != "") {
              if (res.object.isSign == 1) {
                //查看当前用户是否参与活动和是否签到
                getActivityUser(
                  {
                    resId: this.resId,
                    mobile: this.mobile
                  },
                  { token: this.mobile }
                )
                  .then(res => {
                    if (res.status == 0) {
                      this.joinStatus = "1";
                      this.activityIsSign = res.object.isSign;
                      this.userEmp = res.object.userEmp;
                      if (this.activityIsSign == 0) {
                        this.joinText = "查看签到码";
                      } else {
                        this.joinText = "已 签 到";
                        this.signCode = res.object.signCode;
                      }
                    }
                  })
                  .catch(err => {});
              } else {
                //如果活动不需要签到
                //查看当前用户是否签到
                getActivityUser(
                  {
                    resId: this.resId,
                    mobile: this.mobile
                  },
                  { token: this.mobile }
                )
                  .then(res => {
                    if (res.status == 0) {
                      this.joinStatus = "1";
                      this.joinText = "您 已 参 加";
                    }
                  })
                  .catch(err => {});
              }
            }
          } else {
            if(!this.webVersion){
              modal.toast({
                message: res.desc,
                duration: 1
              });
            }
            this.isLoading = false;
          }
        })
        .catch(err => {});
    },
    // 获取评论详情
    comDetail() {
      this.isLoading = true;
      getComment(
        {
          appid: this.appid,
          resId: this.resId,
          resType: "activity",
          pageNo: "1",
          pageSize: "10"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isLoading = false;
            this.comment = res.object;
            for (let i = 0; i < this.comment.length; i++) {
              if (this.comment[i].icon == undefined) {
                this.comment[i].icon =
                  "http://wap.myyule.teamshub.com/web-icon/in.png";
              } else if (this.comment[i].icon.substr(0, 4) != "http") {
                this.comment[i].icon =
                  "http://media2.myyule.cn/" + this.comment[i].icon;
              }
            }
            this.num = res.object.length;
            // console.log(this.num);
            // modal.alert({
            //   message: "评论："+JSON.stringify(this.comment),
            //   duration: 1
            // });
          } else {
            this.isLoading = false;
            modal.toast({
              message: res.desc,
              duration: 1
            });
          }
        })
        .catch(err => {});
    },
    // 获取发布人
    getCommentman() {
      //获取发布人信息
      getUserInfo(
        {
          appid: this.appid,
          mobile: this.toMobile
          //	      toMobile:'9EFC7F96C52DEA4FB234765796F96B4A',
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.userData = res.object;
            var http = "http";
            var httpUrl = "http://media2.myyule.cn/";
            if (this.userData.icon == undefined) {
              this.userData.icon =
                "http://wap.myyule.teamshub.com/web-icon/in.png";
            } else if (this.userData.icon.substr(0, 4) != "http") {
              this.userData.icon =
                "http://media2.myyule.cn/" + this.userData.icon;
            }
            //获取用户与活动发布者的关系
            if (this.mobile != "" && !this.webVersion) {
              getUserRelation(
                {
                  appid: this.appid,
                  mobile: this.mobile,
                  toMobile: this.toMobile
                },
                { token: this.mobile }
              )
                .then(res => {
                  if (res.status == 0) {
                    this.userRelation = res.object.userRelation;
                    this.isLoading = false;
                  } else {
                    this.isLoading = false;
                    modal.toast({
                      message: res.desc,
                      duration: 1
                    });
                  }
                })
                .catch(err => {});
            }
          } else {
            this.isLoading = false;
            modal.toast({
              message: res.desc,
              duration: 1
            });
          }
        })
        .catch(err => {});
    },
    chatCreator() {
      let obj = this.object;
      getChat(
        {
          resId: this.resId,
          mobile: this.mobile,
          resType: "activity"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.groupId = res.object;
            if (obj.isSign == 0) {
              this.push2("/views/activity/active_layout/active_ticketNoSign", {
                resId: this.resId,
                groupId: res.object
              });
            } else {
              this.push2("/views/activity/active_layout/active_ticketCreator", {
                resId: this.resId,
                mobile: obj.mobile,
                isCreator: obj.isCreator,
                address: obj.address,
                title: obj.title,
                starttime: obj.starttime,
                endtime: obj.endtime,
                stateText: obj.stateText,
                groupId: res.object,
                hasLottery: obj.hasLottery,
                isLottery: obj.isLottery
              });
            }
          } else {
            modal.toast({
              message: res.desc,
              duration: 1
            });
          }
        })
        .catch(err => {});
    },
    //没有参加过活动 签到码加1 不需要要签到的话跳转不签到NoSign
    chat1() {
      let obj = this.object;
      console.log(this.object);
      getChat(
        {
          resId: this.resId,
          mobile: this.mobile,
          resType: "activity"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.groupId = res.object;
            if (obj.isSign == 0) {
              this.push2("/views/activity/active_layout/active_ticketNoSign", {
                resId: this.resId,
                groupId: res.object
              });
            } else {
              this.push2("/views/activity/active_layout/active_ticket", {
                resId: this.resId,
                mobile: obj.mobile,
                isCreator: obj.isCreator,
                isSign: obj.isSign,
                address: obj.address,
                title: obj.title,
                starttime: obj.starttime,
                endtime: obj.endtime,
                joinNum: obj.joinNum + 1,
                groupId: this.groupId
              });
            }
          } else {
            modal.toast({
              message: res.desc,
              duration: 1
            });
          }
        })
        .catch(err => {});
    },
    //如果已经参加过活动 签到码不加1
    chat2() {
      let obj = this.object;
      console.log(this.object);
      getChat(
        {
          resId: this.resId,
          mobile: this.mobile,
          resType: "activity"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.groupId = res.object;
            this.push2("/views/activity/active_layout/active_ticket", {
              resId: this.resId,
              mobile: obj.mobile,
              isCreator: obj.isCreator,
              isSign: obj.isSign,
              address: obj.address,
              title: obj.title,
              starttime: obj.starttime,
              endtime: obj.endtime,
              joinNum: obj.joinNum,
              groupId: this.groupId
            });
          } else {
            modal.toast({
              message: res.desc,
              duration: 1
            });
          }
        })
        .catch(err => {});
    },
    _back() {
      this.pop();
    },
    //跳转部落
    toClub(item) {
      this.push2("/views/club/club_layout", { clubId: item.clubId });
    },
    //跳转地盘
    toPlace(userData) {
      if (userData.userType == 1) {
        this.push2("/views/myPlace/myPlaceMusic", { mobile: userData.mobile });
      } else {
        this.push2("/views/myPlace/myPlace", { mobile: userData.mobile });
      }
    },
    toTicket(object) {
      // 站外分享点击事件处理
      this.shareEvent();
      if (this.mobile == "") {
        modal.toast({
          message: "请登录",
          duration: 1
        });
        toLogin({ loginOut: "0" });
      } else {
        if (this.loadTime) {
          this.loadTime = false;
          if (this.judge == 2) {
            modal.toast({
              message: "抱歉，活动已结束",
              duration: 1
            });
            this.loadTime = true;
            return;
          } else if (this.joinStatus == "") {
            this.isLoading = true;
            putActivityMember(
              {
                appid: this.appid,
                resId: this.resId,
                mobile: this.mobile,
                operatorMobile: this.mobile
              },
              { token: this.mobile }
            )
              .then(res => {
                if (res.status == 0) {
                  this.joinText = "您已参加";
                  modal.toast({
                    message: "参加成功",
                    duration: 1
                  });
                  this.isLoading = false;
                  this.loadTime = true;
                  this.chat1();
                } else {
                  this.isLoading = false;
                  modal.toast({
                    message: res.desc,
                    duration: 1
                  });
                  this.loadTime = true;
                }
              })
              .catch();
          } else {
            this.chat1();
          }
        } else {
          this.isLoading = false;
          return;
        }
      }
    },
    //跳转发布人签到页面
    toTicket1(object) {
      // 站外分享点击事件处理
      this.shareEvent();
      this.chatCreator();
    },
    //评论
    toComment(object) {
        if (!this.mobile || this.mobile == "") {
            toLogin({ loginOut: "0" });
            return;
        }
      this.push2("/views/activity/active_layout/active_comment", {
        resId: this.resId,
        mobile: object.mobile
      });
    },
    //回复评论
    toReplay(object, item) {
        if (!this.mobile || this.mobile == "") {
            toLogin({ loginOut: "0" });
            return;
        }
      this.push2("/views/activity/active_layout/active_comment", {
        resId: this.resId,
        mobile: object.mobile,
        toCommentId: item.commentId
      });
    },
    //评论点赞
    toThumb(object, item) {
      // 站外分享点击事件处理
      this.shareEvent();
		if (!this.mobile || this.mobile == "") {
			toLogin({ loginOut: "0" });
			return;
		}
      if (this.loadTime) {
        this.isLoading = true;
        this.loadTime = false;
        putThumb(
          {
            appid: this.appid,
            resId: item.commentId,
            mobile: this.mobile,
            resType: "comment"
          },
          { token: this.mobile }
        )
          .then(res => {
            if (res.status == 0) {
              item.thumbNum = item.thumbNum + 1;
              item.isThumb = 1;
              this.isLoading = false;
              this.loadTime = true;
            } else {
              console.log(res.desc);
              modal.toast({
                message: res.desc,
                duration: 1
              });
              this.isLoading = false;
              this.loadTime = true;
            }
          })
          .catch();
      }
    },
    //取消评论点赞
    toDeleteThumb(object, item) {
      // 站外分享点击事件处理

      this.shareEvent();
      if (!this.mobile || this.mobile == "") {
            toLogin({ loginOut: "0" });
            return;
        }
      if (this.loadTime) {
        this.isLoading = true;
        this.loadTime = false;
        deleteThumb(
          {
            appid: this.appid,
            resId: item.commentId,
            mobile: this.mobile,
            resType: "comment"
          },
          { token: this.mobile }
        )
          .then(res => {
            if (res.status == 0) {
              item.thumbNum = item.thumbNum - 1;
              item.isThumb = 0;
              this.isLoading = false;
              this.loadTime = true;
            } else {
              console.log(res.desc);
              modal.toast({
                message: res.desc,
                duration: 1
              });
              this.isLoading = false;
              this.loadTime = true;
            }
          })
          .catch();
      } else {
        this.isLoading = false;
        return;
      }
    },
    //收藏活动
    toPutCollect(object) {
      // 站外分享点击事件处理
      this.shareEvent();
	if (!this.mobile || this.mobile == "") {
		toLogin({ loginOut: "0" });
		return;
	}
      this.isLoading = true;
      if (this.loadTime) {
        this.loadTime = false;
        putCollect(
          {
            appid: this.appid,
            resId: this.resId,
            mobile: this.mobile,
            resType: "activity"
          },
          { token: this.mobile }
        )
          .then(res => {
            if (res.status == 0) {
              object.isCollect = object.isCollect + 1;
              object.isCollect = 1;
              modal.toast({
                message: "已收藏",
                duration: 1
              });
              this.isLoading = false;
              this.loadTime = true;
            } else {
              modal.toast({
                message: res.desc,
                duration: 1
              });
              this.isLoading = false;
              this.loadTime = true;
            }
          })
          .catch();
      } else {
        this.isLoading = false;
        return;
      }
    },
    //取消收藏
    toDeleteCollect(object) {
      // 站外分享点击事件处理
      this.shareEvent();
      const _this=this;
      // this.isLoading = true;
      if (this.loadTime) {
          this.loadTime = false;
          modal.confirm(
              {
                  message: "确定取消收藏么 ?",
                  okTitle: "确定",
                  cancelTitle: "取消",
                  duration: 0.3
              },
              function(value) {
                  if (value === "确定") {
                      _this.isLoading = true;
                      deleteCollect(
                          {
                              appid: _this.appid,
                              resId: _this.resId,
                              mobile: _this.mobile,
                              resType: "activity"
                          },
                          { token: _this.mobile }
                      )
                          .then(res => {
                              if (res.status == 0) {
                                  object.isCollect = object.isCollect - 1;
                                  object.isCollect = 0;
                                  modal.toast({
                                      message: "已取消收藏",
                                      duration: 1
                                  });
                                  _this.isLoading = false;
                                  _this.loadTime = true;
                              } else {
                                  modal.toast({
                                      message: res.desc,
                                      duration: 1
                                  });
                                  _this.isLoading = false;
                                  _this.loadTime = true;
                              }
                          })
                          .catch();
                  }
              }
          )
      } else {
        this.isLoading = false;
        return;
      }
    },
    //删除评论
    toDeletecomment(object, item) {
      // 站外分享点击事件处理
      this.shareEvent();
      var _this = this;
      modal.confirm(
        {
          message: "删除评论?",
          okTitle: "确定",
          cancelTitle: "取消",
          duration: 0.3
        },
        function(value) {
          console.log("confirm callback", value);
          if (value == "确定") {
            _this.isLoading = true;
            deleteComment(
              {
                commentId: item.commentId,
                mobile: _this.mobile
              },
              { token: _this.mobile }
            )
              .then(res => {
                if (res.status == 0) {
                  _this.isLoading = false;
                  //删除成功调评论资源接口
                  _this.num--;
                  _this.comment.forEach((value, index, array) => {
                    if (value.commentId === item.commentId) {
                      array.splice(index, 1);
                    }
                  });
                } else {
                  _this.isLoading = false;
                  modal.toast({
                    message: res.desc,
                    duration: 1
                  });
                }
              })
              .catch();
          }
        }
      );
    },
    // 生成二维码
    createQRCode(url) {
      var QR = qrcode(0, "L");
      QR.addData(url);
      QR.make();
      this.$nextTick(() => {
        this.codeSrc =
          "data:image/jpg" +
          QR.createImgTag(6, 12)
            .substring(24, QR.createImgTag(6, 12).length - 28)
            .replace(/(^\s*)|(\s*$)/g, "");
        // modal.alert({message:this.codeSrc})
        console.log(this.codeSrc);
      });
    },
    // 打开二维码
    openMask() {
      this.createQRCode("http://www.myyule.com/app/down");
      this.isShow = true;
      this.light = false;
    },
    closeMask() {
      this.isShow = false;
      this.light = true;
    },
    //关注
    followUser() {
      // 站外分享点击事件处理
      this.shareEvent();
      if (this.mobile != "") {
        this.isLoading = true;
        putUserFollow(
          {
            appid: this.appid,
            mobile: this.mobile,
            toMobile: this.toMobile
          },
          { token: this.mobile }
        )
          .then(res => {
            if (res.status == 0) {
              this.isLoading = false;
              //  		this.userRelation = res.object.userRelation;
              modal.toast({
                message: "已关注",
                duration: 1
              });
              this.userRelation = 1;
              this.userData.fanNum++;
            } else {
              this.isLoading = false;
              modal.toast({
                message: res.desc,
                duration: 1
              });
            }
          })
          .catch(err => {});
      } else {
        modal.toast({
          message: "请登录",
          duration: 1
        });
        toLogin({ loginOut: "0" });
      }
    },
    //取消关注
    notFollowUser() {
      if (this.mobile != "") {
          const _this=this;
          modal.confirm(
              {
                  message: "确定取消关注么 ?",
                  okTitle: "确定",
                  cancelTitle: "取消",
                  duration: 0.3
              },
              function(value) {
                  if (value === "确定") {
                      _this.isLoading = true;
                      deleteUserFollow(
                          {
                              appid: _this.appid,
                              mobile: _this.mobile,
                              //	      toMobile:'9EFC7F96C52DEA4FB234765796F96B4A',
                              toMobile: _this.toMobile
                          },
                          { token: _this.mobile }
                      )
                          .then(res => {
                              if (res.status == 0) {
                                  _this.isLoading = false;
                                  modal.toast({
                                      message: "已取关",
                                      duration: 1
                                  });
                                  _this.userRelation = 0;
                                  _this.userData.fanNum--;
                              } else {
                                  _this.isLoading = false;
                                  modal.toast({
                                      message: res.desc,
                                      duration: 1
                                  });
                              }
                          })
                          .catch(err => {});
                  }
              }
          )
      } else {
        modal.toast({
          message: "请登录",
          duration: 1
        });
        toLogin({ loginOut: "0" });
      }
    },
    toMyplace(object) {
      this.push2("/views/myPlace/myPlace", { mobile: object.mobile });
    },
    openMap(object) {
      // 站外分享点击事件处理
      this.shareEvent();
      var self = this;
      var mapObj = {
        latitude: object.latitude,
        longitude: object.longitude,
        locAddrStr: object.address
      };
      if (JSON.stringify(mapObj) == {}) {
        mapObj = "";
      }
      myyuleMap.openMap(mapObj, function(rep) {
        // object.longitude = rep.longitude;
        // object.latitude = rep.latitude;
        // object.address = rep.locAddrStr;
      });
    },
    chooseLon(object) {
      var self = this;
      this.push2("/views/activity/mapView", {
        lng: object.longitude,
        lat: object.latitude
      });
    },
    //取消分享
    close() {
      //	  	this.modalKey = false;
      this.light = true;
    },
    //分享图标
    share() {
      // 站外分享点击事件处理
      this.shareEvent();
      var self = this;
      let sObj = {
        title: self.object.title,
        desc: self.object.content,
        web_url:
          self.commonUrl+"myyuleWeb/webShare/activity/index.html?resId=" +
          self.resId,
        img_url: self.object.logo,
        sourse: "myyule"
      };
      sharePage(sObj);
      // YixinJSBridge.invoke('shareToFriend',{
      // 	'title':self.object.title,
      // 	'desc':'介是里没有挽过的船新版本',
      // 	'link':'http://www.myyule.com/app/down',
      // 	'img_url':self.object.logo,
      // 	'img_width': '200' ,
      // 	'img_heigth': '200' ,
      // 	'source':'' ,
      // 	'username':''
      // }, function(e){

      // 	});
    },
    enterGroup() {
      // 站外分享点击事件处理
      this.shareEvent();
        if (!this.mobile || this.mobile == "") {
            toLogin({ loginOut: "0" });
            return;
        }
      // 进入群聊
      this.isLoading = true;
      getChat(
        {
          resId: this.resId,
          mobile: this.mobile,
          resType: "activity"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isLoading = false;
            this.groupId = res.object;
            // YixinJSBridge.invoke('openChat',{'chatacct':res.object,'chattype':'2'}, function(e){
            //  });
            //  群聊
            openChat({ chatacct: res.object, chattype: "2" }); //chattype: 1.点对点聊天，2.群组聊天
          } else {
            modal.toast({
              message: res.desc,
              duration: 1
            });
            this.isLoading = false;
          }
        })
        .catch(err => {});
    },
    //易信接口查看图片
    boostImg(index) {
      // YixinJSBridge.invoke("viewIPicFile", {"index":index+1,"piclist":this.piclist}, function(e) {
      // 		var res = JSON.parse(e.err_msg);
      // 			if(res.status == 0){
      // 				modal.toast({
      // 	        message:'图片查看失败',
      // 	        duration: 0.5
      // 	      });
      // 			}
      //  });
    },
    //现场活动
    toScene(object) {
      this.push2("/views/activity/activity", {
        resId: object.resId,
        actType: object.actType
      });
    },
    //放大查看图片
      openLightBox(images,index) {
          let arr=[];
          this.imageList = [];
          let allData=[];
          images.forEach(img => {
              let item = {
                  src:img
              };
              arr.push(item);
          });
          arr.forEach((img,num) => {
              if(index==num){
                  var sliceData=arr.splice(num,arr.length-num);
                  allData=sliceData.concat(arr);
              }
          });
          this.imageList=allData;
          this.lightBoxShow = true;
      },
    //关闭放大查看图片
    wxcLightboxOverlayClicked() {
      // 无状态组件，需要在此次关闭
      this.lightBoxShow = false;
    },
    viewappear() {
      this.loadTime = true;
      if (this.resId != "" && this.judge != "") {
        this.init();
        this.comDetail();
      }
    }
    //method分界线
  }
};
</script>

<style scope>
.codeImg {
  width: 445px;
  height: 445px;
}
.sbox {
  height: 1px;
  border-width: 1px;
  border-style: solid;
  border-color: #848484;
  margin-top: 30px;
}
.second-container {
  width: 750px;
  flex: 1;
  /* transition: all 0.2s linear; */
  opacity: 1;
  position: relative;
}
/* .head-top {
  width: 750px;
  height: 50px;
  background-color: #fff;
  top: 0;
  left: 0;
  position: fixed;
} */
.top {
  top: 0px;
  width: 750px;
  left: 0;
  background-color: #fff;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 22px;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 22px;
  border-bottom-style: solid;
  border-bottom-color: #d9d9d9;
  border-bottom-width: 1px;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  position: fixed;
}
.left-collect {
  align-items: center;
}
.title {
  color: #333;
  line-height: 61px;
  font-size: 32px;
}
.image-view {
  width: 61px;
  height: 61px;
}
.background {
  width: 720px;
  position: fixed;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 1;
}
.font-w {
  font-weight: 600;
}
.img {
  width: 40px;
  height: 40px;
  position: relative;
}
.content-box {
  line-height: 76px;
  width: 140px;
  height: 76px;
}
.active {
  color: #ee1c41;
}
.now-box {
  width: 750px;
  height: 1334px;
  align-items: center;
}
.clubActivity-item1 {
  width: 710px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 165px;
  margin-bottom: 110px;
  /*  margin-left: 20px; */
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.activity-banner {
  width: 710px;
  height: 390px;
  overflow: hidden;
}
.img-show {
  position: absolute;
  left: 0px;
  width: 710px;
  height: 390px;
}
.image-view1 {
  width: 710px;
  height: 390px;
  border-radius: 15px;
}
.activity-static {
  width: 350px;
  background-color: rgba(0, 0, 0, 0.6);
  text-align: left;
  transform: rotate(-45deg);
  transform-origin: 50% 250%;
  position: absolute;
}
.banner-text {
  font-size: 26px;
  color: #fff;
  width: 300px;
  height: 57px;
  line-height: 57px;
  text-align: center;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.activity-content {
  width: 690px;
}
.margin-8 {
  margin-top: 8px;
}
.activity-title {
  width: 690px;
  height: 90px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-style: dashed;
  border-bottom-color: #848484;
}
.activity-row1 {
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.activity-row2 {
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.colbaf {
  color: #187baf;
}
.act-tit1 {
  margin-top: 10px;
  line-height: 48px;
  color: #333;
  font-size: 30px;
  font-weight: 600;
}
.act-text1 {
  line-height: 90px;
  color: #828282;
  font-size: 26px;
  width: 470px;
  lines: 1;
  text-align: left;
}
.act-text2 {
  line-height: 90px;
  color: #828282;
  font-size: 26px;
}
.act-text3 {
  width: 600px;
  lines: 1;
  line-height: 90px;
  color: #828282;
  font-size: 26px;
  text-align: left;
}
.actImg2-view {
  width: 40px;
  height: 40px;
}
.activity-title1 {
  width: 690px;
  height: 75px;
  flex-direction: row;
  justify-content: space-between;
}
.asd {
  width: 580px;
  height: 75px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  lines: 1;
}
.asd-text1 {
  height: 75px;
  line-height: 75px;
  color: #828282;
  font-size: 26px;
}
.content-span {
  font-size: 24px;
  line-height: 50px;
  color: #ef1842;
  width: 100px;
  height: 50px;
  margin-top: 5px;
  text-align: center;
  border-width: 2px;
  border-style: solid;
  border-color: #ef1842;
  border-radius: 5px;
}
.code {
  position: fixed;
  left: 150px;
  top: 400px;
}
.detail-user {
  width: 690px;
  height: 140px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 6px;
  border-bottom-style: solid;
  border-bottom-color: #efeded;
}
.data-span1 {
  font-size: 30px;
  color: #333;
}
.data-span2 {
  margin-top: 5px;
  font-size: 24px;
  color: #828282;
}
.user-follower {
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  margin-right: 15px;
}
.follow-btn1 {
  width: 108px;
  height: 40px;
  border-width: 2px;
  border-style: solid;
  border-color: #e71842;
  line-height: 40px;
  color: #e71842;
  text-align: center;
  margin-left: 20px;
  font-size: 22px;
  border-radius: 5px;
}
.tit-text {
  color: #828282;
  text-indent: 25px;
  font-size: 30px;
  line-height: 40px;
}
.img1 {
  width: 114px;
  height: 100px;
  position: relative;
  top: 25px;
}
.img1-view1 {
  width: 80px;
  height: 80px;
  margin-right: 15px;
  border-width: 1px;
  border-style: solid;
  border-color: #ccc;
  border-radius: 40px;
}
.img1-view2 {
  width: 40px;
  height: 40px;
}
.userRelationNum {
  font-size: 24px;
  line-height: 26px;
  color: #828282;
  margin-top: 15px;
}
.detail-text {
  width: 680px;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  position: relative;
}
.detail-box {
  flex-direction: row;
  margin-top: 30px;
  padding-bottom: 30px;
  width: 640px;
  align-items: center;
}
.color-EF1842 {
  color: #ef1842;
}
.margin-10 {
  margin-left: 10px;
  width: 130px;
}
.clubList {
  width: 700px;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
}
.clubTag {
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #fff;
  margin-bottom: 20px;
  margin-left: 20px;
  border-width: 1px;
  border-style: solid;
  border-color: #ef294a;
}
.follow-btn2 {
  lines: 1;
  text-overflow: ellipsis;
  color: #ef294a;
  font-size: 24px;
}
.detail-img {
  width: 680px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  position: relative;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.img2 {
  width: 200px;
  height: 200px;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 40px;
  position: relative;
  border-radius: 25px;
}
.img2-view2 {
  width: 200px;
  height: 200px;
  border-radius: 25px;
  border-width: 1px;
  border-style: solid;
  border-color: #ccc;
}
.detail-tips {
  width: 680px;
  height: 60px;
  position: relative;
  margin-top: 50px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.tip-text {
  height: 60px;
  line-height: 60px;
  width: 200px;
  color: #333;
  text-align: center;
  font-size: 30px;
  background-color: #fff;
}
.tip-line {
  position: absolute;
  top: 29.5px;
  width: 680px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #666666;
}
.detail-tips-area {
  width: 680px;
  position: relative;
}
.tip-text1 {
  width: 680px;
  line-height: 200px;
  height: 200px;
  color: #828282;
  font-size: 26px;
  text-align: center;
}
.tip-text2 {
  height: 100px;
  color: #666666;
}
.detail-comment {
  width: 680px;
  flex-direction: column;
}
.tip-title {
  width: 680px;
  flex-direction: row;
  justify-content: flex-end;
}
.comtip-text {
  color: #333;
  text-align: right;
  font-size: 30px;
}
.tip-comment-detial {
  width: 680px;
  margin-top: 10px;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
}
.img3-view {
  width: 80px;
  height: 80px;
  border-radius: 50px;
}
.img3-span {
  color: #666;
  font-size: 26px;
}
.tip-content {
  margin-left: 30px;
}
.tip-content-sort {
  width: 570px;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #d8d8d8;
}
.tip-timeSpan {
  color: #666;
  font-size: 26px;
}
.tip-contSpan1 {
  width: 570px;
  line-height: 40px;
  font-size: 26px;
  color: #999;
}
.tip-contSpan {
  line-height: 40px;
  font-size: 26px;
  color: #999;
}
.imgSpanRow {
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.img6 {
  margin-left: 10px;
  width: 50px;
  height: 50px;
  top: 3px;
}
.img6-view {
  width: 50px;
  height: 50px;
}
.delete-this {
  margin-left: 10px;
  color: #666;
  font-size: 24px;
}
.detail-fun {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 750px;
  height: 110px;
  padding-top: 20px;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 30px;
  padding-right: 30px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #666666;
  background-color: #fff;
}
.m-l30 {
  margin-left: 30px;
}
.detail-btn {
  width: 180px;
  height: 70px;
  flex-direction: row;
  border-width: 1px;
  border-style: solid;
  border-color: #666666;
  border-radius: 15px;
}
.b-c0db {
  border-width: 1px;
  border-style: solid;
  border-color: #0db93a;
}
.img4 {
  width: 60px;
  height: 60px;
  position: relative;
  top: 5px;
  margin-left: 20px;
}
.img4-view1 {
  width: 60px;
  height: 60px;
}
.img4-span {
  font-size: 26px;
  text-align: left;
  line-height: 70px;
  margin-left: 10px;
}
.detail-btn-db {
  width: 180px;
  height: 70px;
  flex-direction: row;
  border-width: 1px;
  border-style: solid;
  border-color: #0db93a;
  border-radius: 15px;
}
.img5 {
  width: 65px;
  height: 65px;
  position: relative;
  top: 5px;
  margin-left: 20px;
}
.img5-view1 {
  width: 65px;
  height: 65px;
}
.img5-span {
  font-size: 26px;
  text-align: left;
  line-height: 70px;
  margin-left: 10px;
  color: #0db93a;
}
.detail-btn1 {
  width: 252px;
  height: 70px;
  flex-direction: row;
  background-color: #ef1842;
  border-radius: 15px;
}
.btn1-span {
  width: 252px;
  font-size: 26px;
  text-align: center;
  color: #ffffff;
  line-height: 70px;
}
.detail-btn2 {
  width: 252px;
  height: 70px;
  flex-direction: row;
  background-color: #ff9c00;
  border-radius: 15px;
}
.btn2-span {
  width: 252px;
  font-size: 26px;
  text-align: center;
  line-height: 70px;
  color: #ffffff;
}
.message-board {
  width: 700px;
  height: 500px;
  margin: 20px 18px;
  border-width: 2px;
  border-style: dashed;
  border-color: #bababa;
}
.issue-item {
  position: fixed;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  width: 720px;
  height: 1000px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  right: 0px;
  bottom: 10px;
  transition: all 0.2s linear;
  opacity: 0;
  transform: translate3d(0, 0, 0);
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
.share-view {
  position: fixed;
  left: 0px;
  bottom: 0px;
  right: 0px;
  background-color: white;
  width: 750px;
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
  position: relative;
  margin-top: 33px;
}
.share-view-img {
  width: 60px;
  height: 60px;
  margin-left: 60px;
}
.share-title {
  width: 180px;
  text-align: center;
  margin-top: 20px;
}
.share-foot {
  width: 750px;
  margin-top: 30px;
  border-bottom-width: 16px;
  border-bottom-style: solid;
  border-bottom-color: #848484;
}
.remove {
  width: 750px;
  height: 104px;
  line-height: 104px;
  text-align: center;
}
</style>