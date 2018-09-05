<template>
  <div class="second-container" @viewappear="viewappear">
  	<scroller class="now-box" :style="{height:scollHeight+'px'}">
      <div class="clubActivity-item1">
		  <div class="row">
			  <div class="topic-top" @click="push2('/views/myPlace/myPlace',{mobile:object.mobile})">
				  <div class="topic-user" >
					  <image  class="pic" v-if="object.user" resize="cover" :src="object.user.icon?(url+object.user.icon):(imgUrl+'userIcon.png')" :placeholder="imgUrl+'userIcon.png'"></image>
					  <div class="topic-time">
						  <div class="userName">
							  <text class="font-28 nickname" v-if="object.user">{{object.user.nickname}}</text>
						  </div>
						  <div class="hours">
							  <text class="font-22" v-if="object.schoolName">{{object.schoolName}}</text>
						  </div>
					  </div>
				  </div>
				  <div  class="topic-number">
					  <text style="padding-top: 18px" v-if="userRelation == 0" class="care-btn font-24" @click="followUser">关注</text>
					  <text style="padding-top: 18px" v-if="userRelation == 1" class="care-btn font-24" @click="notFollowUser">已关注</text>
					  <text style="padding-top: 18px" v-if="userRelation == 2" class="care-btn font-24" @click="notFollowUser">相互关注</text>
					  <div class="picLocation">
                      		<text class="iconfont font-28 ">&#xe656;</text>
					  </div>
				  </div>
			  </div>
			  <div class="topic-middle">

				  <div class="topic-name">
					  <div class="tag-content">
						  <text class="topic-tag font-28 color-pink">#</text>
						  <text @click="topicTagList(object.topicTags[0],1)" class="topic-tag font-28 color-pink" v-for="(tag,index) in object.topicTags[0].split('')">{{tag}}</text>
						  <text class="topic-tag font-28 color-pink">#</text>

						  <text v-if="object.topicTags[1]" class="topic-tag font-28 color-pink">#</text>
						  <text v-if="object.topicTags[1]" class="topic-tag font-28 color-pink" @click="topicTagList(object.topicTags[1],1)" v-for="(tag,index) in object.topicTags[1]?object.topicTags[1].split(''):''">{{tag}}</text>
						  <text v-if="object.topicTags[1]" class="topic-tag font-28 color-pink">#</text>

						  <text v-if="object.topicTags[2]" class="topic-tag font-28 color-pink">#</text>
						  <text v-if="object.topicTags[2]" class="topic-tag font-28 color-pink" @click="topicTagList(object.topicTags[2],1)" v-for="(tag,index) in object.topicTags[2]?object.topicTags[2].split(''):''">{{tag}}</text>
						  <text v-if="object.topicTags[2]" class="topic-tag font-28 color-pink">#</text>
						  <div v-if="object.club&&i<3" class="topic-btn" v-for="(items, i) in object.club" @click="toClub(items)">
							  <text class="btn-text font-24" >{{items.clubName.length>6?items.clubName.substr(0,6):items.clubName}}</text>
							  <text v-if="items.clubName.length>6" class="btn-text font-24" >...</text>
						  </div>
						  <text class="isElips" v-if="object.club&&object.club.length>3">...</text>
					  </div>
				  </div>
				  <div class="div-text">
				  	<text class="middle-text2 font-28">{{object.content}}</text>
				  </div>
				  <div class="pic-list"  v-if="object.images">
					  <image  @click="openLightBox(object.images,i)" :class="[i!=2&&i!=5&&i!=8?'imgIndex':'']"  v-for="(itemImg, i) in object.images"    class="picImg" resize="cover" :src='url+itemImg'></image>
				  </div>
				  <div class="adress" v-if="object.address">
					  <div class="img">
						  <image class="image-adress" :src="imgUrl+'adress.png'" ></image>
					  </div>
					  <text class="font-24 pwith color-gray">{{object.address}}</text>
				  </div>
			  </div>
			  <div class="topic-footer" style="padding-bottom:30px">
				  <div class="heartSee">
					  <image class="heart-view" :src='imgUrl+"see.png"'></image>
					  <text class="heart-span" style="margin-left:10px">{{object.seeNum}}</text>
				  </div>
                  <div  class="heart">
                      <text class="heart-span">{{noticeTime(object.createtime)}}</text>
                  </div>
				  <div  class="heart"></div>
                  <div class="heart" @click="toThumb(object)">
                      <image v-if="object.isThumb==0" class="heart-view"  :src='imgUrl+"thumbNum.png"'></image>
                      <image v-if="object.isThumb==1" class="heart-view" :src="imgUrl+'thumbNumActive.png'" ></image>
                      <text class="heart-span" style="margin-left:10px">{{object.thumbNum}}</text>
                  </div>
			  </div>
		  </div>

		  <div class="activity-title" :class="[commentList.length>0?'noLines':'lines']">
			<div class="detail-tipsnum">
				<text class="tip-text font-32 font-w600">精彩评论({{object.commentNum}})</text>
			</div>
			<div class="detail-tips-area" >
			<!--<text class="tip-text1 font-32" v-if="object.commentNum == 0">随便留下点痕迹吧~</text>-->
				<div class="detail-comment">
					<div class="row" v-for="(item,index) in commentList" :key="index">
						<div class="topic-top">
							<div class="topic-username">
								<image  class="pic" resize="cover" :src="item.icon?(url+item.icon):(imgUrl+'userIcon.png')"></image>
								<div class="topic-time">
									<text class="userName font-28">{{item.nickname}}</text>
								</div>
							</div>

						</div>
						<div class="topic-comment">
							<div class="div-text">
								<text class="middle-text font-24">{{item.content}}</text>
							</div>
							<div class="futext" v-if="item.parentComment != null">
								<text class="middle-text font-24">回复@{{item.toNickname}}:{{item.parentComment.content}}</text>
							</div>
							<div class="footer-topics">
								<div class="footer-time">
									<text class="font-22 date-color">{{item.createtime.substr(5)}}</text>
								</div>
								<div class="footer-text">

									<div class="hearts"  @click="toReplay(object,item)">
										<image class="heart-view" :src='imgUrl+"comment.png"'></image>
									</div>
									<div class="hearts" @click=chkCheers(item)>
										<image class="heart-view" v-if="item.isThumb==0"  :src='imgUrl+"thumbNum.png"'></image>
										<image class="heart-view" v-if="item.isThumb==1"  :src='imgUrl+"thumbNumActive.png"'></image>
										<text class="heart-span"  style="margin-left: 10px">{{item.thumbNum}}</text>
									</div>
									<div class="hearts" @click="toDeletecomment(object,item)">
										<text class="heart-span" style="margin-left: 10px"  v-if="item.mobile == mobile">删除</text>
									</div>

								</div>
							</div>

						</div>
					</div>
				</div>
			</div>
	  	</div>
      </div>
	</scroller>
	  <div class="top" :style="{paddingTop:source==='iOS'?50:20+'px'}">
		  <div class="left-collect" v-if="!webVersion">
			  <image class="image-view" :src='imgUrl+"back.png"' @click="pop()"></image>
			  <div v-if="object.isCollect==0" class="image-view"></div>
			  <div v-if="object.isCollect==1" class="image-view"></div>
		  </div>
		  <text class="title">话题详情</text>
		  <div class="left-collect" v-if="!webVersion">
			  <image v-if="object.isCollect==0" @click="toPutCollect(object)" class="image-view" :src='imgUrl+"unstyle_1.png"' ></image>
			  <image v-if="object.isCollect==1" @click="toDeleteCollect(object)" class="image-view" :src='imgUrl+"style.png"' ></image>
			  <image class="image-view"  @click="share(object)" :src='imgUrl+"share.png"'></image>
		  </div>
	  </div>
	  <div class="bot_comment row" v-if="!webVersion">
		  <input class="com_input" type="text" v-model="comContent"  return-key-type="done"@change="onchange" @blur="onblur" @input="oninput"  placeholder="发表评论" />
		  <text class="sendTxt" @click="comt(object)">发送</text>
	  </div>
	  <download-notice></download-notice>
	  <wxc-lightbox
			  ref="wxc-lightbox"
			  height="800"
			  :show="lightBoxShow"
			  :image-list="imageList"
			  :show-indicator = false
			  @wxcLightboxOverlayClicked="wxcLightboxOverlayClicked">
	  </wxc-lightbox>
    <wxc-loading :show="isShow"></wxc-loading>
  </div>
</template>
<script>
import mixins from "../../mixins";
import {WxcLightbox,WxcPopup,Utils} from "weex-ui";
import { sharePage, toLogin } from "../../api/weex";
import downloadNotice from "../../components/downloadNotice.vue";

import {topicDetail,getComment,getPutComment ,putThumb,deleteThumb} from "../../api/topic.js";
import {
  putUserFollow,
  deleteUserFollow,
  putCollect,
  deleteCollect,
  getUserRelation,
  getUserInfo,
  deleteComment
} from "../../api/activity.js";
var storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
export default {
  components: {
    WxcLightbox,
    downloadNotice
  },
  mixins: [mixins],
  name: "share-success",
  data() {
    return {
      submitFlag: true,
      scollHeight:'',
      object: {},
      url: "http://media2.myyule.cn/",
      images: [],
      userData: {},
      resId: "", //this.$route.query.resId,
      judge: "", // this.$route.query.judge,
      comment: [],
      isBackground: "true",
      isShow: false,
      toMobile: "",
      userRelation: "",
      light: true,
      loadTime: true,
      imageList: [],
      lightBoxShow: false,
	  comContent:'',
	  commentList:[],

    };
  },
  created() {
    this.fontIcon();
     this.scollHeight = Utils.env.getPageHeight();
     // this.resId = 160;
     // this.init();
     // this.comList();

     if(this.webParam()){
         this.resId=this.webParam().resId;
         // 获取活动详情
         this.init();
         this.comList();
     }else{
         storage.getItem("data", event => {
           this.resId = JSON.parse(event.data).resId;
           // 获取活动详情
           this.init();
           this.comList();
        });
    }

},
  mounted() {
    // 数据埋点
    if (this.webVersion) {
      this.putPageUrlLog(1802);
    } else {
        this.putPageUrlLog(1702);
    }
  },
  methods: {
    // 获取活动详情
    init() {
      this.isShow = true;
        topicDetail(
        {
          appid: this.appid,
          resId: this.resId,
          mobile: this.mobile
        },
        { token: this.mobile }
      )
        .then(res => {
          this.isShow = false;
          this.userData = {};
          if (res.status == 0) {
            this.object = res.object;
            this.toMobile = res.object.mobile;
            this.getCommentman()

          } else {
            modal.toast({
              message: res.desc,
              duration: 1
            });
            this.isShow = false;
          }
        })
        .catch(err => {});
    },

    _back(){
      this.pop();
    },
    //跳转部落
    toClub(item) {
        if (!this.mobile || this.mobile == "") {
            toLogin({ loginOut: "0" });
            return;
        }
      this.push2("/views/club/club_layout", { clubId: item.clubId });
    },
    //点赞
      toThumb(item){
        if(!this.webVersion){
            const _this=this;
            if (!this.mobile || this.mobile == "") {
                toLogin({ loginOut: "0" });
                return;
            }
            if(item.isThumb==1&&item.thumbNum!=0){
                if(!this.isShow){
                    modal.confirm(
                        {
                            message: "确定取消点赞么 ?",
                            okTitle: "确定",
                            cancelTitle: "取消",
                            duration: 0.3
                        },
                        function(value) {
                            if (value === "确定") {
                                _this.isShow = true;
                                deleteThumb({
                                    mobile:_this.mobile,
                                    resId:item.resId,
                                    resType:'topic'
                                },{token:_this.mobile})
                                    .then(res => {
                                        if (res.status ==0){
                                            item.thumbNum-=1;
                                            item.isThumb=0;
                                            _this.isShow=false;
                                            modal.toast({
                                                message:'已取消点赞',
                                                duration:1
                                            });

                                        } else {
                                            modal.toast({
                                                message:res.desc,
                                                duration:1
                                            });
                                            this.isShow = false;
                                            console.log(res.desc);
                                        }
                                    }).catch();
                            }
                        }
                    )
                }

            }else {
                if (!this.isShow) {
                    this.isShow = true;
                    putThumb({
                        mobile: this.mobile,
                        resId: item.resId,
                        resType: 'topic'
                    }, {token: this.mobile})
                        .then(res => {
                            if (res.status == 0) {
                                item.thumbNum += 1;
                                item.isThumb = 1;
                                this.isShow = false;
                                modal.toast({
                                    message: '已点赞',
                                    duration: 1
                                });

                            } else {
                                modal.toast({
                                    message: res.desc,
                                    duration: 1
                                });
                                this.isShow = false;
                                console.log(res.desc);
                            }
                        }).catch();
                }
            }
		}

      },
    //取消分享
    close() {
      this.light = true;
    },
    //分享图标
    share(item){
        const _this = this;
        let sObj = {
            title:"分享话题："+item.topicTags[0],
            desc:item.content,
            web_url: _this.commonUrl+"myyuleWeb/webShare/topic/index.html?resId="+_this.resId,
            img_url:_this.url+item.user.icon,
            sourse:"myyule"
        };

        sharePage(sObj)
    },

    //放大查看图片
      openLightBox(images,index) {
          let arr=[];
          this.imageList = [];
          let allData=[];
          images.forEach(img => {
              let item = {
                  src: this.url+img
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
    viewappear(){
      this.loadTime = true;
      if (this.resId != "") {
          this.init();
        this.comList();
      }
    },
      getDateTimeStamp (dateStr) {
          return this.getDateDiff(Date.parse(dateStr.replace(/-/gi,"/")));
      },
      getDateDiff(dateTimeStamp){
          var minute = 1000 * 60;
          var hour = minute * 60;
          var day = hour * 24;
          var halfamonth = day * 15;
          var month = day * 30;
          var now = new Date().getTime();
          var diffValue = now - dateTimeStamp;
          if(diffValue < 0){return;}
          var monthC =diffValue/month;
          var weekC =diffValue/(7*day);
          var dayC =diffValue/day;
          var hourC =diffValue/hour;
          var minC =diffValue/minute;
          var result="";
          if(monthC>=1){
              result="" + parseInt(monthC) + "月前";
          }
          else if(weekC>=1){
              result="" + parseInt(weekC) + "周前";
          }
          else if(dayC>=2){
              result=""+ parseInt(dayC) +"天前";
          }
          else if(dayC>=1){
              result=""+ "昨天";
          }
          else if(hourC>=1){
              result=""+ parseInt(hourC) +"小时前";
          }
          else if(minC>=1){
              result=""+ parseInt(minC) +"分钟前";
          }else
              result="刚刚";
          return result;
      },
      //回复评论
      toReplay(object, item){
          if (!this.mobile || this.mobile == "") {
              toLogin({ loginOut: "0" });
              return;
          }
          this.push2("/views/topic/topic_comment", {
              resId: this.resId,
              mobile: object.mobile,
              toCommentId: item.commentId
          });
      },
      onchange(e) {
          this.comContent = e.value;
      },
      oninput(e) {
          this.comContent = e.value;
      },
      // 评论
      comt(item){
          if (!this.mobile || this.mobile == "") {
              toLogin({ loginOut: "0" });
              return;
          }
          if(this.comContent == ''){
              modal.toast({
                  message:'请输入评论',
                  duration:1
              })
          }else{
              if(this.submitFlag){
                  this.isShow = true;
                  this.submitFlag=false;
                  getPutComment(
                      {
                          resId: this.resId,
                          resType:'topic',
                          mobile: this.mobile,
                          //toCommentId: '5aa36a556236ef77e9c2178d',//没有就不传
                          content: this.comContent,
                          noticeMobiles: ""
                      },
                      { token: this.mobile }
                  )
                      .then(res => {
                          if (res.status == 0) {
                              this.isShow = false;
                              this.submitFlag=true;
                              item.commentNum+=1;
                              this.comContent='';
                              this.comList();
                              modal.toast({
                                  message: "评论成功!",
                                  duration: 1
                              });
                              console.log("评论成功!");
                          } else {
                              modal.toast({
                                  message: "评论失败!",
                                  duration: 1
                              });
                              console.log("评论失败," + res.desc);
                              this.isShow = false;
                              this.submitFlag=true;
                          }
                      })
                      .catch();
              }
          }
      },
      //查看话题评论
      comList() {
          this.isShow = true;
          getComment(
              {
                  resId: this.resId,
                  resType: 'topic',
                  pageNo: this.pageNo,
                  pageSize: "10",
                  lastIndexId: "",
                  sort: "new"
              },
              { token: this.mobile }
          )
              .then(res => {
                  if (res.status == 0){
                      this.isShow = false;
                      this.commentList =
                          this.pageNo > 1
                              ? this.commentList.concat(res.object)
                              : res.object;
                  } else {
                      console.log(res.desc);
                  }
              })
              .catch();
      },
      //回复点赞
      chkCheers(item) {
          const _this=this;
          if (!this.mobile || this.mobile == "") {
              toLogin({ loginOut: "0" });
              return;
          }
          if(!this.webVersion){
              if(item.isThumb==1&&item.thumbNum!=0) {
                  if(!this.isShow){
                      modal.confirm(
                          {
                              message: "确定取消点赞么 ?",
                              okTitle: "确定",
                              cancelTitle: "取消",
                              duration: 0.3
                          },
                          function(value) {
                              if (value === "确定") {
                                  _this.isShow = true;
                                  deleteThumb(
                                      {
                                          resId: item.commentId, //点赞评论的话resId为留言id
                                          resType: "comment", //点赞评论的话类型为comment
                                          mobile: _this.mobile
                                      },
                                      {token: _this.mobile}
                                  )
                                      .then(res => {
                                          if (res.status == 0) {
                                              _this.isShow = false;
                                              item.isThumb = 0;
                                              item.thumbNum -= 1;
                                              console.log("取消点赞成功!");
                                          } else {
                                              console.log("取消点赞失败," + res.desc);
                                          }
                                      })
                                      .catch();
                              }
                          }
                      );
                  }
              }else {
                  if(!this.isShow){
                      this.isShow = true;
                      putThumb(
                          {
                              resId: item.commentId, //点赞评论的话resId为留言id
                              resType: "comment", //点赞评论的话类型为comment
                              mobile: this.mobile
                          },
                          { token: this.mobile }
                      )
                          .then(res => {
                              if (res.status == 0) {
                                  this.isShow = false;
                                  item.isThumb = 1;
                                  item.thumbNum += 1;
                                  console.log("点赞成功!");
                              } else {
                                  console.log("点赞失败," + res.desc);
                              }
                          })
                          .catch();
                  }
              }
          }
      },
      //收藏活动
      toPutCollect(object) {
          if (!this.mobile || this.mobile == "") {
              toLogin({ loginOut: "0" });
              return;
          }
          this.isShow = true;
          if (this.loadTime) {
              this.loadTime = false;
              putCollect(
                  {
                      appid: this.appid,
                      resId: this.resId,
                      mobile: this.mobile,
                      resType: "topic"
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
                          this.isShow = false;
                          this.loadTime = true;
                      } else {
                          modal.toast({
                              message: res.desc,
                              duration: 1
                          });
                          this.isShow = false;
                          this.loadTime = true;
                      }
                  })
                  .catch();
          } else {
              this.isShow = false;
              return;
          }
      },
      //取消收藏
      toDeleteCollect(object) {
          // this.isShow = true;
          const _this=this;
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
                          _this.isShow = true;
                          deleteCollect(
                              {
                                  appid: _this.appid,
                                  resId: _this.resId,
                                  mobile: _this.mobile,
                                  resType: "topic"
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
                                      _this.isShow = false;
                                      _this.loadTime = true;
                                  } else {
                                      modal.toast({
                                          message: res.desc,
                                          duration: 1
                                      });
                                      _this.isShow = false;
                                      _this.loadTime = true;
                                  }
                              })
                              .catch();
                      }
                  }
              )
          } else {
              this.isShow = false;
              return;
          }
      },
      //关注
      followUser() {
        if(!this.webVersion){
            if (!this.mobile || this.mobile == "") {
                toLogin({ loginOut: "0" });
                return;
            }
            if (this.mobile != "") {
                this.isShow = true;
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
                            this.isShow = false;
                            //  		this.userRelation = res.object.userRelation;
                            modal.toast({
                                message: "已关注",
                                duration: 1
                            });
                            this.userRelation = 1;
                            this.userData.fanNum++;
                        } else {
                            this.isShow = false;
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
		}

      },
      //取消关注
      notFollowUser() {
        const _this=this;
          if(!this.webVersion) {

              if (this.mobile != "") {

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
                                      appid: _this.appid,
                                      mobile: _this.mobile,
                                      toMobile: _this.toMobile
                                  },
                                  {token: _this.mobile}
                              )
                                  .then(res => {
                                      if (res.status == 0) {
                                          _this.isShow = false;
                                          modal.toast({
                                              message: "已取关",
                                              duration: 1
                                          });
                                          _this.userRelation = 0;
                                          _this.userData.fanNum--;
                                      } else {
                                          _this.isShow = false;
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
                  toLogin({loginOut: "0"});
              }
          }
      },
      // 获取发布人
      getCommentman() {
          //获取发布人信息
          if(!this.webVersion){
              getUserInfo(
                  {
                      appid: this.appid,
                      mobile: this.toMobile
                  },
                  { token: this.mobile }
              )
                  .then(res => {
                      if (res.status == 0) {
                          //获取用户与活动发布者的关系
                          if (this.mobile != "") {
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
                                          this.isShow = false;
                                      } else {
                                          this.isShow = false;
                                          modal.toast({
                                              message: res.desc,
                                              duration: 1
                                          });
                                      }
                                  })
                                  .catch(err => {});
                          }
                      } else {
                          this.isShow = false;
                          modal.toast({
                              message: res.desc,
                              duration: 1
                          });
                      }
                  })
                  .catch(err => {});
		  }

      },
	  //进入页面时执行
      viewappear(){
          this.loadTime= true;
          if(this.resId!=""){
              this.init();
              this.comList();
          }
      },
      //删除评论
      toDeletecomment(object, item) {
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
                      _this.isShow = true;
                      deleteComment(
                          {
                              commentId: item.commentId,
                              mobile: _this.mobile
                          },
                          { token: _this.mobile }
                      )
                          .then(res => {
                              if (res.status == 0) {
                                  _this.isShow = false;
                                  //删除成功调评论资源接口
                                  // _this.num--;
                                  _this.commentList.forEach((value, index, array) => {
                                      if (value.commentId === item.commentId) {
                                          array.splice(index, 1);
                                      }
                                  });
                              } else {
                                  _this.isShow = false;
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

  }
};
</script>
<style src="../../assets/style/index.scss">

</style>
<style scope>
.font-26{font-size: 26px;}
.font-22{font-size: 22px;}
.font-28{font-size: 28px;}
.font-24{font-size: 24px;}
.iconfont {
	font-family: iconfont;
}
.layout-color{
	color: #666666;
}
.date-color{
	color:#8A8A8A;
}
.second-container {
  width: 750px;
  flex: 1;
  background-color: #ccc;
  opacity: 1;
  position: relative;
}
.top {
  top: 0px;
  left: 0px;
  position: fixed;
  width: 750px;
  background-color: #fff;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 22px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 22px;
  border-bottom-style: solid;
  border-bottom-color: #d9d9d9;
  border-bottom-width: 1px;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}
.left-collect {
	flex-direction: row;
  	align-items: center;
}

.title {
  color: #333;
	font-weight: bold;
	font-size: 36px;
}
.image-view {
  width: 61px;
  height: 61px;
}


.now-box {
  width: 750px;
  align-items: center;
  background-color:#fff;

}
.clubActivity-item1 {
  width: 750px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 158px;
  padding-bottom: 260px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.activity-title {
  background-color:#fff;
  width: 750px;
  margin-top:10px;
}
.lines{
	border-bottom-width: 1px;
	border-bottom-style: dashed;
	border-bottom-color: #848484;
}
.detail-tipsnum {
	width: 680px;
	height: 60px;
	margin-top: 24px;
	margin-left:30px;
	flex-direction: row;
	align-items: center;
}
.tip-text {
  height: 60px;
  line-height: 60px;
  color: #333;
  text-align: center;
  font-size: 30px;
  background-color: #fff;
}

.detail-tips-area {
  width: 750px;
  position: relative;
}
.detail-comment {
  width: 750px;
  flex-direction: column;
}
.heart {
	width: 118px;
	height: 56px;
	margin-left: 10px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-radius: 10px;
}
.heartSee{
	width: 118px;
	height: 56px;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	border-radius: 10px;
	margin-left:-30px;
}
.hearts{
	/*width: 118px;*/
	height: 56px;
	margin-left: 30px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-radius: 10px;
}

.heart-view {
	width: 50px;
	height: 50px;
	margin-left: 10px;
}
.heart-span {
	line-height: 50px;
	color: #828282;
	font-size: 26px;
}
.topic-footer{
	width:690px;
	margin-top:24px;
	flex-direction:row;
	justify-content: space-around;
	align-items:center;

}
.topic-top{
	width:690px;
	flex-direction: row;
	justify-content:space-between;

}
.pic{
	width: 94px;
	height: 94px;
	border-bottom-left-radius: 50px;
	border-bottom-right-radius: 50px;
	border-top-left-radius: 50px;
	border-top-right-radius:50px;
}
.picImg{
	width: 200px;
	height: 200px;
	margin-top: 40px;
	border-bottom-left-radius: 25px;
	border-bottom-right-radius: 25px;
	border-top-left-radius: 25px;
	border-top-right-radius:25px;
}
.pic-list{
	/*margin-top:30px;*/
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: flex-start;
}
.topic-user{
	flex-direction: row;
	align-items: flex-start;
}
.topic-username{
	flex-direction: row;
	align-items: center;
}
.topic-name{
	flex-direction: row;
	justify-content: flex-start;

}
.topicname{
	/*width: 190px;*/
	color:#EE1C41;
	margin-right:20px;
	margin-bottom: 20px;
}
.row{
	/*padding-top:24px;*/
	padding-right: 30px;
	padding-left: 30px;
	background-color:#fff;
}
.topic-time {
	margin-left: 30px;
}
.middle-text{
	color: #666666;
	line-height:32px;
}
.middle-text2{
    color: #666666;
    line-height:38px;
}
.topic-middle{
	width: 690px;
	margin-top:30px;
	padding-bottom:10px;
	/*border-bottom-width: 1px;*/
	/*border-bottom-style: solid;*/
	/*border-bottom-color:#ccc;*/
}
.topic-comment{
	width: 558px;
	margin-left:132px;
	margin-top:-30px;
	padding-bottom:10px;
	border-bottom-width: 1px;
	border-bottom-style: solid;
	border-bottom-color:#ccc;
}
.topic-btn{
	height:49px;
	padding-left:5px;
	padding-right:5px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-style: solid;
	border-color: #EE1C41;
	border-width: 2px;
	background-color:white;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
	border-top-left-radius: 5px;
	border-top-right-radius:5px;
	margin-left: 10px;
	margin-bottom: 10px;

}
.btn-text{
	color:#EE1C41;
}
.isElips{
	color:#EE1C41;
}
.care-btn{
	height:58px;
	width:130px;
	text-align:center;
	padding-top:12px;
	background-color:#EE1C41;
	color:#FFFFFF;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
	border-top-left-radius: 5px;
	border-top-right-radius:5px;

}
.care-btn2{
	height:58px;
	width:130px;
	text-align:center;
	padding-top:16px;
	background-color:#ffffff;
	color:#EE1C41;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
	border-top-left-radius: 5px;
	border-top-right-radius:5px;

}

.picLocation{
	margin-left:24px;
}
.userName{
	margin-bottom:10px;
	color:#3B3B3B;
}
.nickname{
    width:300px;
    lines:1;
    text-overflow:ellipse;
}
.topic-number{
	flex-direction: row;
	/*padding-top:18px;*/
	align-items: center;
}
/*底部评论开始*/
.bot_comment {
	position: fixed;
	bottom: 0px;
	left: 0px;
	width: 750px;
	height: 126px;
	font-size: 50px;
	padding-left: 20px;
	padding-right: 20px;
	padding-top: 20px;
	padding-bottom: 20px;
	text-align: center;
	color: #ffffff;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: #fff;
	border-top-width: 2px;
	border-top-style: solid;
	border-top-color: #ececec;
}
.com_input {
	font-size: 28px;
	width: 620px; /*710px*/
	height: 80px;
	color: #333;
	padding-left: 20px;
	padding-right: 20px;
	background-color: #eff0f1;
	border-width: 2px;
	border-style: solid;
	border-color: #fff;
	border-radius: 10px;
	placeholder-color: #666;
}
.div-text{
	margin-top: 16px;
}
.footer-text{
	flex-direction: row;
	margin-left: 40px;
}
.footer-time{
	flex-direction: row;
}
.footer-topics{
	flex-direction: row;
	align-items:center;
	margin-top:16px;
	justify-content: space-between;

}
.futext{
	margin-top: 10px;
}
.tag-content{
	flex-direction: row;
	width: 690px;
	flex-wrap: wrap;
	justify-content: flex-start;
	align-items:center;
}
.topic-tag {
	line-height: 34px;
}
	.adress{
		width: 650px;
		flex-direction: row;
		align-items:center;
		margin-top:30px;
		flex-wrap:wrap;
	}
	.image-adress{
		width: 30px;
		height: 30px;
	}
	.imgIndex{
		margin-right: 22px;
	}
	.sendTxt{
		color:#ee1c41;
	}
</style>