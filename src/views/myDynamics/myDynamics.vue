<template>
    <div class="myDynamics">
        <wxc-loading :show="isShow" :need-mask="true"></wxc-loading>
        <list class="list" @loadmore="fetchPage" loadmoreoffset="10">
            <cell  v-if="resData" class="activity-main" v-for="(item,index) in resData" :key="index">
                <!--活动-->
                <div v-if="item.resType=='activity'">
                    <div class="headshop" v-if="item.user">
                        <image class="image-head" resize="cover" :src="item.user.icon?'http://media2.myyule.cn/'+item.user.icon:(imgUrl+'userIcon.png')"></image>
                    </div>
                    <div class="headshop" v-if="item.club">
                        <image class="image-head" resize="cover" :src="item.club.clubLogo?'http://media2.myyule.cn/'+item.club.clubLogo:(imgUrl+'userIcon.png')"></image>
                    </div>
                    <div class="activity-top">
                        <text v-if="item.user" class='font-32 name'>{{item.user.nickName}}</text>
                        <text v-if="item.club" class='font-32 name'>{{item.club.clubName}}</text>
                        <text v-if="item.optType=='publish'" class='font-26 publish'>发布了活动</text>
                        <text v-if="item.optType=='join'" class='font-26 publish'>加入了活动</text>
                    </div>
                    <div class="activity-all" @click="activeDetail(item)">
                        <div class="activity-banner" v-if="item.resData">
                            <image class="bgImage" resize="cover" :src="item.resData.images[0].substr(0,4)=='http'?item.resData.images[0]:('http://media2.myyule.cn/'+item.resData.images[0])"></image>
                            <div class="bgmsg"></div>
                            <div class="activity-static">
                                <text class="activity-static-p">{{nowDays(item)}}</text>
                            </div>
                        </div>
                        <div class="activity-content">
                        <div class="activity-title">
                            <text class="font-28 contentTitle">{{item.resData.title}}</text>
                            <div class="type styleb">
                                <text class="font-18">{{item.resData.actType}}</text>
                                <image class="image-view" :src="imgUrl+'style.png'"></image>
                            </div>
                            <div></div>
                        </div>
                        <div class="boxView">
                            <div class="content">
                                <div class="content-1">
                                    <div class="adress">
                                        <div class="img">
                                            <image class="image-view" :src="imgUrl+'adress.png'" ></image>
                                        </div>
                                        <text class="font-24 pwith color-gray">{{item.resData.address}}</text>
                                    </div>
                                </div>
                                <div class="content-1">
                                    <div class="adress">
                                        <div class="img">
                                            <image class="image-view" :src="imgUrl+'time.png'" ></image>
                                        </div>
                                        <text class="font-24 color-gray">{{(item.resData.starttime).substr(0,10)}}-{{(item.resData.endtime).substr(0,10)}}</text>
                                    </div>
                                </div>
                                <div class="content-1">
                                    <div class="adress">
                                        <div class="img">
                                            <image class="image-view" :src="imgUrl+'feeType.png'" ></image>
                                        </div>
                                        <text class="font-24 color-gray" v-if="item.resData.feeType==0">免费</text>
                                        <text class="font-24 color-gray" v-if="item.resData.feeType==1">{{item.resData.fee}}.00</text>
                                    </div>
                                </div>
                            </div>
                            <div  class='join'>
                                <text class="font-24 join-p">想参加{{item.resData.joinNum}}人</text>
                            </div>
                        </div>
                    </div>
                     </div>
                    <div class="activity-foot">
                        <div class="choose" @click="thumb(item)">
                            <div class="img"  v-if="item.resData.isThumb==1">
                                <image class="image-view2" :src="imgUrl+'thumbNumActive.png'" ></image>
                            </div>
                            <div class="img"  v-if="item.resData.isThumb==0">
                                <image class="image-view2" :src="imgUrl+'thumbNum.png'" ></image>
                            </div>
                            <text class="font-22">{{item.resData.thumbNum}}</text>
                        </div>
                        <div class="choose" @click="comment(item)">
                            <div class="img">
                                <image class="image-view2" :src="imgUrl+'comment.png'" ></image>
                            </div>
                            <text class="font-22">{{item.resData.commentNum}}</text>
                        </div>

                        <div class="choose" @click="share(item)">
                            <div class="img">
                                <image class="image-view2" :src="imgUrl+'min-share.png'" ></image>
                            </div>
                            <!--<text class="font-22">{{item.resData.shareNum}}</text>-->
                        </div>
                        <div class="choose chooseEnd" @click="more(item,1)">
                            <div class="img">
                                <image class="image-view2" :src="imgUrl+'more.png'" ></image>
                            </div>
                        </div>
                    </div>
                    <div class="lines"></div>
                </div>
                <!--话题-->
                <div v-if="item.resType=='topic'">
                    <div class="headshop" v-if="item.user">
                        <image class="image-head"   resize="cover" :src="item.user.icon?'http://media2.myyule.cn/'+item.user.icon:(imgUrl+'userIcon.png')"></image>
                    </div>
                    <div class="headshop" v-if="item.club">
                        <image class="image-head"   resize="cover" :src="item.club.clubLogo?'http://media2.myyule.cn/'+item.club.clubLogo:(imgUrl+'userIcon.png')"></image>
                    </div>
                    <div class="activity-top">
                        <text  class='font-32 name' v-if="item.user">{{item.user.nickName}}</text>
                        <text  class='font-32 name' v-if="item.club">{{item.club.clubName}}</text>
                        <text  class='font-26 publish'>发布了话题</text>
                    </div>
                    <div class="topic-all" @click="topicDetail(item)">
                        <div class="topic-title">
                            <text class="title-elips font-26" v-if="item.resData">{{item.resData.content}}</text>
                        </div>
                        <div class="topic-banner" v-if="item.resData&&item.resData.images" @click="openLightBox(item.resData.images)">
                            <image  @click="openLightBox(item.resData.images,i)" :class="[i!=3&&i!=7&&i!=11?'picMargin':'picd']" class="bgImageTopic" resize="cover" v-for="(items,i) in item.resData.images"  :key="i"  :src="items.substr(0,4)=='http'?items:('http://media2.myyule.cn/'+items)"></image>
                        </div>
                    </div>
                    <div class="activity-foot">
                        <div class="choose" @click="thumb(item)">
                            <div class="img"  v-if="item.resData&&item.resData.isThumb==1">
                                <image class="image-view2" :src="imgUrl+'thumbNumActive.png'" ></image>
                            </div>
                            <div class="img"  v-if="item.resData&&item.resData.isThumb==0">
                                <image class="image-view2" :src="imgUrl+'thumbNum.png'" ></image>
                            </div>
                            <text class="font-22" v-if="item.resData">{{item.resData.thumbNum}}</text>
                        </div>
                        <div class="choose" @click="commentTopic(item)">
                            <div class="img">
                                <image class="image-view2" :src="imgUrl+'comment.png'" ></image>
                            </div>
                            <text class="font-22" v-if="item.resData">{{item.resData.commentNum}}</text>
                        </div>

                        <div class="choose" @click="share(item)">
                            <div class="img">
                                <image class="image-view2" :src="imgUrl+'min-share.png'" ></image>
                            </div>
                        </div>
                        <div class="choose chooseEnd" @click="more(item,2)">
                            <div class="img">
                                <image class="image-view2" :src="imgUrl+'more.png'" ></image>
                            </div>
                        </div>
                    </div>
                    <div class="lines"></div>
                </div>
                <!--歌曲-->
                <div v-if="item.resType=='song'">
                    <div class="headshop">
                        <image class="image-head" :src="'http://media2.myyule.cn/'+item.user.icon"></image>
                    </div>
                    <div class="activity-top">
                        <text v-if="item.user" class='font-32 name'>{{item.user.nickName}}</text>
                        <text class='font-26 publish'>分享单曲</text>
                    </div>
                    <div class="song-banner">
                        <div class="song-pic">
                            <div class="songMsg"></div>
                            <image class="image-view img-bg" resize="cover"  :src="'http://media2.myyule.cn/'+item.resData.logo"></image>
                            <image class="image-view img-bg playBg" :src="imgUrl+'max-play.png'"></image>
                        </div>
                        <div class="song-static">
                            <text class='font-26 songName'>{{item.resData.title}}</text>
                            <text v-if="item.user" class='font-22 songAuthor'>{{item.resData.nickName}}</text>
                        </div>
                        <text class='songBtn'>数发</text>
                    </div>
                    <div class="activity-foot">
                        <div class="choose" @click="comment(item)">
                            <div class="img">
                                <image class="image-view" :src="imgUrl+'comment.png'" ></image>
                            </div>
                            <text class="font-22">{{item.resData.commentSum}}</text>
                        </div>
                        <div class="choose" @click="share(item)">
                            <div class="img">
                                <image class="image-view" :src="imgUrl+'min-share.png'" ></image>
                            </div>
                            <!--<text class="font-22">{{item.resData.shareSum}}</text>-->
                        </div>
                        <div class="choose chooseEnd" @click="more(item)">
                            <div class="img">
                                <image class="image-view" :src="imgUrl+'more.png'" ></image>
                            </div>
                        </div>
                    </div>
                </div>
                <!--专辑-->
                <div v-if="item.resType=='songAlbum'">
                    <div class="headshop">
                        <image class="image-head" :src="'http://media2.myyule.cn/'+item.user.icon"></image>
                    </div>
                    <div class="activity-top">
                        <text v-if="item.user" class='font-32 name'>{{item.user.nickName}}</text>
                        <text class='font-26 publish'>分享专辑</text>
                    </div>
                    <div class="song-banner">
                        <div class="song-pic">
                            <div class="songMsg"></div>
                            <image class="image-view img-bg"  resize="cover"  :src="'http://media2.myyule.cn/'+item.resData.logo"></image>
                            <image class="image-view img-bg playBg" :src="imgUrl+'max-play.png'"></image>
                        </div>
                        <div class="song-static">
                            <text class='font-26 songName'>{{item.resData.title}}</text>
                            <!--<text class='font-22 songAuthor'>{{item.resData.nickName}}</text>-->
                        </div>
                        <text class='songBtn'>数发</text>
                    </div>

                    <div class="activity-foot">
                        <div class="choose" @click="comment(item)">
                            <div class="img">
                                <image class="image-view" :src="imgUrl+'comment.png'" ></image>
                            </div>
                            <text class="font-22">{{item.resData.commentSum}}</text>
                        </div>
                        <div class="choose" @click="shareTopic(item)">
                            <div class="img">
                                <image class="image-view" :src="imgUrl+'min-share.png'" ></image>
                            </div>
                            <text class="font-22">{{item.resData.shareSum}}</text>
                        </div>
                        <div class="choose chooseEnd" @click="more(item)">
                            <div class="img">
                                <image class="image-view" :src="imgUrl+'more.png'" ></image>
                            </div>
                        </div>
                    </div>
                </div>
            </cell>

            <!-- 空白提示 -->
            <cell class="empty-wrapper" v-if="resData.length==0">
                <image  resize="contain" class="empty" :src="imgUrl+'empty-data.png'"></image>
            </cell>

        </list>

        <div class="top" :style="{paddingTop:source==='iOS'?62:20+'px'}">
            <div @click="pop()" class="left">
                <image class="image-views" :src='imgUrl+"back.png"' ></image>
            </div>
            <text class="title font-32">小动态</text>
            <div class="right"></div>
        </div>
        <wxc-popup popup-color="#fff"
                   :show="isBottomShow"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick"
                   pos="bottom"
                   :height="(iMobile === myMobile)?342:227"
                   width="750">
            <div class="demo-content">
                <div class="botMoreOpt col" ref="botMoreOptBg" >
                    <div class="optItems col">
                        <text v-if="iMobile === myMobile" @click="_delete()" class="optDesc">删除</text>
                        <text v-if="iMobile === myMobile" @click="edit()" class="optDesc">编辑</text>
                        <text v-if="iMobile !== myMobile" @click="toReport()" class="optDesc">举报</text>
                        <!--<text @click="toReport()" class="optDesc">举报</text>-->
                    </div>
                    <text class="optDesc" @click="close()">取消</text>
                </div>
            </div>
        </wxc-popup>
        <wxc-lightbox
                ref="wxc-lightbox"
                height="800"
                :show="lightBoxShow"
                :image-list="imageList"
                :show-indicator = false
                @wxcLightboxOverlayClicked="wxcLightboxOverlayClicked">
        </wxc-lightbox>
    </div>
</template>

<script>
import mixins from "../../mixins";
import { getActive_List, putReport } from "../../api/myDynamics.js";
import { getThumb, getThumbDel } from "../../api/userInfo.js";
import {deleteTopic} from "../../api/topic.js";
import {deleteActivity} from "../../api/activity.js";
import { getUser, sharePage } from "../../api/weex";
import { WxcPopup,WxcLightbox } from "weex-ui";
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");

export default {
  mixins: [mixins],
  components: { WxcPopup,WxcLightbox },
  data() {
    return {
      userInfo: [],
      resData: [],
      pageNo: 1,
      currentDate: [],
      nowDay: "",
      order:'',
      isBottomShow: false,
      resIdValue: "",
      imageList: [],
      lightBoxShow: false,
      myMobile: getUser().mobile,
      // myMobile:"9EFC7F96C52DEA4FB234765796F96B4A",
      iMobile:'',
      catchEvent:false
    };
  },
  created() {
    this.getActiveList();
  },
  mounted() {
    // 数据埋点
    this.putPageUrlLog(1309);
  },
  methods: {
    getActiveList() {
      if (!this.isShow) {
        this.isShow = true;
        getActive_List(
          {
            pageNo: this.pageNo,
            pageSize: 10,
            mobile: this.myMobile
          },
          { token: this.myMobile }
        )
          .then(res => {
            if (res.status == 0) {
              console.log(res.object);
              this.isShow = false;
              this.resData = res.object
                ? this.resData.concat(res.object)
                : res.object;

              this.nowDay = res.currentDate;
              this.isShow = false;
            } else {
              this.isShow = false;
              console.log(res.desc);
            }
          })
          .catch(rej =>{
              this.catchEvent=true;
          });
      }
    },
    //  加载下一页
    fetchPage() {
      if (!this.isShow) {
          if(this.catchEvent){
              this.pageNo= 1;
              this.getActiveList();
              setTimeout(() => {}, 800);
          }else{
              this.pageNo += 1;
              this.getActiveList();
              setTimeout(() => {}, 800);
          }
      }
    },
    thumb(item) {
      const _this = this;
      console.log(item);
      if (item.resData.isThumb == 1 && item.resData.thumbNum != 0) {
        if (!this.isShow) {
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
                        getThumbDel(
                            {
                                mobile: _this.myMobile,
                                resId: item.resId,
                                resType: item.resType
                            },
                            { token: _this.myMobile }
                        )
                            .then(res => {
                                if (res.status == 0) {
                                    item.resData.thumbNum -= 1;
                                    item.resData.isThumb = 0;
                                    _this.isShow = false;
                                    modal.toast({
                                        message: "已取消点赞",
                                        duration: 1
                                    });
                                } else {
                                    modal.toast({
                                        message: res.desc,
                                        duration: 1
                                    });
                                    _this.isShow = false;
                                    console.log(res.desc);
                                }
                            })
                            .catch();
                    }
                }
            )

        }
      } else {
        if (!this.isShow) {
          this.isShow = true;
          getThumb(
            {
              mobile: this.myMobile,
              resId: item.resId,
              resType: item.resType
            },
            { token: this.myMobile }
          )
            .then(res => {
              if (res.status == 0) {
                item.resData.thumbNum += 1;
                item.resData.isThumb = 1;
                this.isShow = false;
                modal.toast({
                  message: "已点赞",
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
            })
            .catch();
        }
      }
    },
    //分享图标
    share(item) {
        if (item.resData.icon&&item.resData.icon.substr(0, 4) != "http"){
            item.resData.icon = "http://media2.myyule.cn/" +item.resData.icon;
        }else{
            item.resData.icon=this.imgUrl+'userIcon.png'
        }

      let sObj = {
        title: "分享小动态：" + item.resData.title,
        desc: "小动态简介" + item.resData.content,
        web_url: "http://www.myyule.com/app/down",
        img_url: item.resData.icon,
        sourse: "myyule"
      };
      sharePage(sObj);
    },
      //分享话题图标
      shareTopic(item) {
          if (item.user.icon&&item.user.icon.substr(0, 4) != "http"){
              item.user.icon = "http://media2.myyule.cn/" +item.resData.icon;
          }else{
              item.user.icon=this.imgUrl+'userIcon.png'
          }

          let sObj = {
              title:"分享话题："+item.resData.topicTags[0],
              desc: "话题内容"+item.resData.content,
              web_url: "http://www.myyule.com/app/down",
              img_url:item.user.icon,
              sourse:"myyule"
          };
          sharePage(sObj)
      },
    //评论
    comment(item) {
      this.push2("/views/activity/active_layout/active_detail", {
        resId: item.resId,
        mobile: this.myMobile
      });
    },
      //话题评论
    commentTopic(item) {
      this.push2("/views/topic/topic_detail", {
        resId: item.resId,
        mobile: this.myMobile
      });
    },
    more(item,index) {
      console.log(item);
      this.isBottomShow = true;
      this.resIdValue = item;
      this.iMobile = item.resData.mobile;
      this.order=index;
    },
    // 举报
    toReport() {
      this.isBottomShow = false;
      var self = this;
      modal.prompt(
        {
          message: "举报",
          okTitle: "确定",
          cancelTitle: "取消",
          duration: 1
        },
        value => {
          if (value.result == "确定") {
            this.reportData = value.data;
            putReport(
              {
                toUsercode: "myyule_service",
                reason: this.reportData,
                mobile: this.myMobile,
                //	          reason:'原因不详',
                url:
                  this.commonUrl +
                  "/views/activity/active_layout/active_detail?resId=" +
                  this.resIdValue.resId
              },
              { token: this.myMobile }
            )
              .then(res => {
                if (res.status == 0) {
                  modal.alert({
                    message: "举报成功",
                    duration: 1
                  });
                  // this.light = true;
                } else {
                  // this.light = true;
                  modal.alert({
                    message: res.desc,
                    duration: 1
                  });
                }
              })
              .catch();
          } else {
            // this.light = true;
          }
        }
      );
    },
    close() {
      this.isBottomShow = false;
    },
    //非状态组件，需要在这里关闭
    popupOverlayBottomClick() {
      this.isBottomShow = false;
    },
    activeDetail(item) {
      this.push2("/views/activity/active_layout/active_detail", {
        resId: item.resId
      });
    },
    nowDays(item) {
      var nowTime = new Date(this.nowDay);
      var Y = nowTime.getFullYear() + "-";
      var M =
        (nowTime.getMonth() + 1 < 10
          ? "0" + (nowTime.getMonth() + 1)
          : nowTime.getMonth() + 1) + "-";
      var D =
        nowTime.getDate() < 10
          ? "0" + nowTime.getDate() + " "
          : nowTime.getDate() + " ";
      var h =
        nowTime.getHours() < 10
          ? "0" + nowTime.getHours() + ":"
          : nowTime.getHours() + ":";
      var m =
        nowTime.getMinutes() < 10
          ? "0" + nowTime.getMinutes()
          : nowTime.getMinutes();
      var nowTimes = Y + M + D + h + m;
      var startDate = item.resData.starttime;
      var endDate = item.resData.endtime;
      console.log(nowTimes);
      if (nowTimes < startDate) {
        return (this.stateText = "即将开始");
      } else if (nowTimes >= startDate && nowTimes <= endDate) {
        return (this.stateText = "进行中");
      } else if (nowTimes > endDate) {
        return (this.stateText = "已结束");
      } else {
        return (this.stateText = "...");
      }
    },
  //放大查看图片
      openLightBox(images,index) {
          let arr=[];
          this.imageList = [];
          let allData=[];
          images.forEach(img => {
              let item = {
                  src:img.substr(0,4)!='http'?'http://media2.myyule.cn/'+img:img
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
  topicDetail(item){
          this.push2('/views/topic/topic_detail',{resId:item.resId})
      },
  _delete() {
      const _this = this;
      if(this.order==1){
         modal.confirm(
             {
                 message: "确定删除么 ?",
                 okTitle: "确定",
                 cancelTitle: "取消",
                 duration: 0.3
             },
             function(value) {
                 if (value === "确定") {
                     _this.isShow = true;
                     deleteActivity(
                         {
                             resId: _this.resIdValue.resId,
                             mobile: _this.myMobile
                         },
                         { token: _this.myMobile }
                     )
                         .then(res => {
                             _this.isShow = false;
                             if (res.status == 0) {
                                 _this.resData.forEach((value, index, array) => {
                                     if (
                                         (value.resData ? value.resData.mobile : value.mobile) ===
                                         _this.iMobile
                                     ) {
                                         _this.close();
                                         array.splice(index, 1);
                                         modal.toast({
                                             message: "删除成功!",
                                             duration: 1
                                         });
                                     }
                                 });
                                 _this.isBottomShow = false;
                             } else {
                                 modal.toast({
                                     message: res.desc,
                                     duration: 1
                                 });
                                 console.log(res.desc);
                             }
                         })
                         .catch();
                 }
             }
         )

     }else if (this.order==2){
          modal.confirm(
              {
                  message: "确定删除么 ?",
                  okTitle: "确定",
                  cancelTitle: "取消",
                  duration: 0.3
              },
              function(value) {
                  if (value === "确定") {
                      _this.isShow = true;
                      deleteTopic(
                          {
                              resId: _this.resIdValue.resId,
                              mobile: _this.myMobile
                          },
                          { token: _this.myMobile }
                      )
                          .then(res => {
                              _this.isShow = false;
                              if (res.status == 0) {
                                  _this.resData.forEach((value, index, array) => {
                                      if (
                                          (value.resData ? value.resData.mobile : value.mobile) ===
                                          _this.iMobile
                                      ) {
                                          _this.close();
                                          array.splice(index, 1);
                                          modal.toast({
                                              message: "删除成功!",
                                              duration: 1
                                          });
                                      }
                                  });
                                  _this.isBottomShow = false;
                              } else {
                                  modal.toast({
                                      message: res.desc,
                                      duration: 1
                                  });
                                  console.log(res.desc);
                              }
                          })
                          .catch();
                  }
              }
          )
     }

  },
  edit() {
        if(this.order==1){
            this.push2("/views/release/releaseContentRevise", {
                resId: this.resIdValue.resId
            });
        }else if (this.order==2) {
            this.push2("/views/topic/editTopic", {
                resId: this.resIdValue.resId
            });
        }
  },
  }
};
</script>
<style src="../../assets/style/index.scss">
</style>
<style scoped>
.font-24 {
  font-size: 24px;
}
.list {
  /*height: 1244px;*/
  margin-top: 160px;
}
.myDynamics {
  flex: 1;
  width: 750px;
}
.top {
  width: 750px;
  left: 0;
  background-color: #fff;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 22px;
  padding-right: 40px;
  padding-left: 40px;
  top: 0px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #d9d9d9;
  position: fixed;
}
.title {
  color: #000;
  justify-content: center;
  align-items: center;
}
.left {
  align-items: center;
  height: 61px;
  width: 61px;
}
.right {
  align-items: center;
  height: 61px;
  width: 61px;
}

.user-img {
  position: relative;
  width: 170px;
  height: 158px;
  background-color: #d9d9d9;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  border-bottom-right-radius: 90px;
  border-bottom-left-radius: 90px;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: auto;
  margin-right: auto;
}
.img-vip {
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  border-bottom-right-radius: 90px;
  border-bottom-left-radius: 90px;
}

.activity-main {
  position: relative;
  margin-top: 26px;
}
.headshop {
  position: absolute;
  top: 10px;
  left: 30px;
  width: 98px;
  height: 98px;
  background-color: gray;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  border-bottom-right-radius: 90px;
  border-bottom-left-radius: 90px;
}
.image-head {
  width: 98px;
  height: 98px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  border-bottom-right-radius: 90px;
  border-bottom-left-radius: 90px;
}

.activity-top {
  width: 556px;
  margin-left: 150px;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 26px;
  margin-top: 20px;
}
.name {
  color: #3b3b3b;
}
.publish {
  color: #8c8c8c;
}
.activity-all {
  margin-left: 150px;
  box-shadow: 3px 5px 5px 5px #d9d9d9;
  background-color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  width: 556px;
}
.topic-all {
  margin-left: 150px;
  width: 556px;
}
.activity-banner {
  position: relative;
  height: 320px;
  background-color: white;
  overflow: hidden;
}
.topic-banner {
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 24px;
}
.bgImage {
  position: absolute;
  width: 556px;
  height: 320px;
  top: 0;
  left: 0;
  /*margin-left: 150px;*/
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.bgImageTopic {
  width: 122px;
  height: 122px;
}
.bgmsg {
  position: absolute;
  width: 556px;
  height: 320px;
  top: 0;
  left: 0px;
  margin-right: 50px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  background-color: rgba(0, 0, 0, 0.2);
}
.activity-static {
  width: 480px;
  height: 57px;
  justify-content: center;
  align-items: center;
  transform: rotate(-45deg);
  transform-origin: 180px 260px;
  background-color: #fff;
}
.activity-static-p {
  color: #000;
  font-size: 24px;
}

.contentTitle {
  width: 240px;
  lines: 1;
  text-overflow: ellipsis;
}
.activity-content {
  /*margin-left: 150px;*/
  width: 556px;
  padding-top: 10px;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 10px;
}
.activity-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.type {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.styleb {
  padding-top: 2px;
  padding-right: 18px;
  padding-bottom: 2px;
  padding-left: 18px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 30px;
  border-width: 2px;
  border-style: solid;
  border-color: red;
}

.image-view {
  width: 30px;
  height: 30px;
}
.image-views {
  width: 61px;
  height: 61px;
}
.image-view2 {
  width: 50px;
  height: 50px;
}
.boxView {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-top: 10px;
  padding-bottom: 10px;
  position: relative;
}
.content {
  flex-direction: column;
}
.adress {
  width: 320px;
  flex-direction: row;
  margin-top: 6px;
}
.pwith {
  width: 276px;
  align-items: center;
  lines: 1;
  text-overflow: ellipsis;
}

.join {
  position: absolute;
  width: 160px;
  height: 54px;
  align-items: center;
  justify-content: center;
  right: 0;
  bottom: 10px;
  border-width: 1px;
  border-style: solid;
  border-color: red;
  background-color: red;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.join-p {
  color: white;
}

.activity-foot {
  width: 556px;
  margin-left: 150px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-top: 24px;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 24px;
}
.image-view {
  width: 30px;
  height: 30px;
}
.choose {
  flex-direction: row;
  align-items: center;
  margin-right: 40px;
}
.chooseEnd {
  margin-right: 0px;
}

.song-title {
  width: 556px;
  margin-left: 150px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.song-banner {
  flex-direction: row;
  width: 556px;
  margin-left: 150px;
  align-items: center;
  background-color: gainsboro;
}
.song-pic {
  width: 200px;
  height: 200px;
  position: relative;
}
.img-bg {
  width: 200px;
  height: 200px;
}
.songMsg {
  position: absolute;
  width: 200px;
  height: 200px;
  top: 0;
  left: 0px;
  margin-right: 50px;
  background-color: rgba(0, 0, 0, 0.2);
}
.playBg {
  position: absolute;
  width: 200px;
  height: 200px;
  top: 0;
  left: 0px;
  margin-right: 50px;
  background-color: rgba(0, 0, 0, 0.2);
}
.song-static {
  margin-left: 40px;
}
.songAuthor {
  margin-top: 40px;
}
.songBtn {
  margin-left: 40px;
  color: red;
  padding-top: 10px;
  padding-left: 26px;
  padding-right: 26px;
  padding-bottom: 10px;
  border-width: 2px;
  border-style: solid;
  border-color: red;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.botMoreOpt {
  width: 750px;
}
.optItems {
  margin-bottom: 10px;
}
.optDesc {
  color: #000;
  text-align: center;
  line-height: 112px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ccc;
  background-color: #fff;
}
.lines {
  width: 750px;
  height: 1px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #d9d9d9;
  margin-bottom: 10px;
  margin-left: 40px;
}
.empty-wrapper {
  width: 750px;
  height: 1140px;
  align-items: center;
}
.empty {
  width: 300px;
  height: 213px;
  margin-top: 300px;
}
.title-elips {
  lines: 2;
  text-overflow: ellipsis;
}
    .picMargin{
        margin-right: 22px;
    }
</style>