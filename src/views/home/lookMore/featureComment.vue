<template>
    <div class="commentWrap" :style="{paddingTop:source==='iOS'?50:20+'px'}">
      <!--加载器-->
        <wxc-loading :show="isShow"></wxc-loading>
        <!--专辑评论头部-->
        <div class="header center row">
          <text class="iconfont re_icon"  @click="pop()">&#xe625;</text>
          <text class="h-title">评论（{{commentNum}}）</text>
        </div>
        <!--专辑评论菜单-->
        <div class="feature_top">
          <div class="featrueInfo row">
           <image class="featrueImg" :src="url+logo"></image>
           <div class="featrueDesc">
             <text class="desc desc1">{{title}}</text>
             <text class="desc desc2 mgTp25">{{nickName}}</text>
           </div>
          </div>
        </div>
        <div class="rankingOpt row">
          <text class="listenNum opt-txt">精彩评论</text>
        </div>
        <list class="commentBox" @loadmore="fetchPage" loadmoreoffset="600">
        <!--专辑评论列表-->
          <cell class="rankings"v-for="(item,index) in commentList">
            <div class="rankingLists">
              <div class="rankingLi">
                 <div class="leftLi row">
                    <image class="useHeader" :src="url+item.icon"></image>
                    <div class="singInfo">
                      <div class="commentName row">
                        <text class="singTitle">{{item.nickname}}</text>
                        <text class="more">{{getDateTimeStamp(item.createtime)}}</text>
                      </div>
                     <text class="singName">{{item.schoolName}}</text>
                     <text class="introduce">{{item.content}}</text>
                     <div class="likeOpt row">
                       <text class="iconfont nolike_icon" v-if="item.isThumb==0" @click=chkCheers(item)>&#xe60e;</text>
                       <text class="iconfont like_icon"  v-if="item.isThumb==1" @click=cancelCheers(item)>&#xe60e;</text>
                       <text class="likeNum">{{item.thumbNum}}</text>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </cell>
        </list>
        <div class="bot_comment row">
          <!--<div class="com_input">-->
          <input class="com_input" type="text" v-model="comContent" return-key-type="done"@change="onchange" @blur="onblur" @input="oninput"  placeholder="发表评论" />
          <text class="sendTxt" @click="comt">发送</text>
         <!-- </div>-->
          <!--<text class="iconfont face_icon"  @click="faceIcon">&#xe616;</text>-->
        </div>
    </div>
</template>

<script>
import {
  getPutComment,
  getCommentList,
  putThumb,
  deleteThumb
} from "../../../api/urlDate";
import mixins from "../../../mixins";
import {WxcLoading } from "weex-ui";
var storage = weex.requireModule("storage");
const navigator = weex.requireModule("navigator");
const animation = weex.requireModule("animation");
const modal = weex.requireModule("modal");
var stream = weex.requireModule("stream");
export default {
  mixins:[mixins],
  components: {
    WxcLoading
  },
  data() {
    return {
      submitFlag: true,
      //mobile: "",
      isShow: false,
      pageNo: 1,
      commentNum: 0,
      comContent: "",
      resId: "",
      resType: "",
      nickName: "",
      title: "",
      likeone: 0,
      url: "http://media2.myyule.cn/",
      logo:
        "https://gw.alicdn.com/imgextra/i2/787557947/TB2erNKawoQMeJjy0FoXXcShVXa_!!787557947-0-beehive-scenes.jpg_250x250q90s200.jpg",
      commentList: []
    };
  },
  beforeCreate(){
    this.fontIcon();
  },
  created() {
    //获取专辑id和type
    storage.getItem("data", event => {
        this.resId = JSON.parse(event.data).resId;
        this.resType = JSON.parse(event.data).resType;
        this.logo = JSON.parse(event.data).logo;
        this.title = JSON.parse(event.data).title;
        this.nickName = JSON.parse(event.data).nickName;
        this.commentNum = JSON.parse(event.data).comNum;

        this.comList();
      });
  },
  mounted(){
    // 数据埋点
    this.putPageUrlLog(1302)
  },
  methods: {
    //查看专辑评论
    comList() {
      this.isShow = true;
      getCommentList(
        {
          resId: this.resId,
          resType: this.resType,
          pageNo: this.pageNo,
          pageSize: "10",
          lastIndexId: "",
          sort: "new"
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
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
    //点赞
    chkCheers(item) {
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
    },
    //取消点赞
    cancelCheers(item) {
      this.isShow = true;
      deleteThumb(
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
            item.isThumb = 0;
            item.thumbNum -= 1;
            console.log("取消点赞成功!");
          } else {
            console.log("取消点赞失败," + res.desc);
          }
        })
        .catch();
    },
    // 加载下一页
    fetchPage() {
      if (!this.isShow) {
        this.pageNo += 1;
        this.comList();
      }
    },
    // 评论
    comt() {
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
          resType: this.resType,
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
            this.commentNum+=1;
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
    // onreturn(e) {
    //   this.comContent = e.value;
    //   this.comt();
    //   //this.comList();
    // },
    onchange(e) {
      this.comContent = e.value;
    },
   oninput(e) {
      this.comContent = e.value;
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
  }
  }
};
</script>

<style scoped>
.commentWrap {
  flex: 1;
  background-color: #fff;
  position: relative;
 /*  padding-top:50px; */
}
.commentBox {
  height: 760px;
  margin-bottom: 126px;
}
.row {
  flex-direction: row;
}
.center {
  justify-content: center;
  align-items: center;
}
.mgRt30 {
  margin-right: 30px;
}
.mgTp25 {
  margin-top: 25px;
}
.iconfont {
  font-family: iconfont;
}
/*头部 开始*/
.header {
  height: 100px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
  position: relative;
}
.re_icon {
  color: #ee1c41;
  font-size: 45px;
  font-weight: bold;
  position: absolute;
  top: 30px;
  left: 30px;
}
.h-title{
  font-weight: bold;
  line-height: 100px;
  font-size: 36px;
  lines:1;
  width: 200px;
}
/*头部 结束*/

/*专辑上部 开始*/
.feature_top {
  position: relative;
  width: 750px;
  height: 200px;
  padding-top: 22px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 22px;
}
.featrueBg {
  position: absolute;
  top: 0;
  left: 0;
  width: 750px;
  height: 340px;
}
.featrueInfo {
  align-items: center;
}
.featrueImg {
  width: 156px;
  height: 156px;
  margin-right: 20px;
}
.featrueDesc {
  width: 336px;
}
.desc1 {
  font-size: 32px;
  color: #000;
  lines: 2;
}
.desc2 {
  font-size: 22px;
  color: #959597;
  lines: 1;
}
.desc3 {
  font-size: 16px;
  lines: 3;
}
.featureOpt {
  margin-top: 56px;
  justify-content: space-around;
}
.videoImg {
  width: 45px;
  height: 40px;
  margin-right: 10px;
}
.videoNum {
  line-height: 40px;
  font-size: 30px;
  color: #fff;
}
/*专辑上部 结束*/

/*列表操作*/
.rankingOpt {
  width: 750px;
  line-height: 50px;
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 20px;
  flex-direction: row;
  justify-content: space-between;
  background-color: #eff0f1;
}
.optIcon {
  width: 40px;
  height: 40px;
}
.opt-txt {
  color: #3b3b3b;
  font-size: 26px;
  margin-left: 18px;
  margin-right: 25px;
}
.rankingLists {
  padding-left: 20px;
  
}
.rankingLi {
  position: relative;
  padding-right: 34px;
  padding-top: 30px;
  padding-bottom: 30px;
  background-color: #fff;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
/* .sort {
  align-items: center;
  margin-right: 20px;
  position: relative;
} */
.useHeader {
  width: 94px;
  height: 94px;
  margin-top: 17px;
  margin-right: 20px;
 /*  position: absolute;
  top: 17px;
  left: -94px; */
  border-width: 1px;
  border-color: #ececec;
  border-style: solid;
  border-radius: 47px;
}
.leftLi {
  align-items: flex-start;
}
.singInfo {
  width: 616px;
}
.commentName {
  justify-content: space-between;
  margin-right: 20px;
}
.singTitle {
  font-size: 28px;
  margin-top: 17px;
  color: #3b3b3b;
  lines: 1;
}
.singName {
  font-size: 28px;
  margin-top: 15px;
  color: #666;
  lines: 1;
}
.introduce {
  width: 580px;
  font-size: 24px;
  margin-top: 20px;
  margin-bottom: 20px;
  color: #666;
  lines: 3;
}
.more {
  color: #666;
  font-size: 22px;
  padding-top: 17px;
}
.likeOpt {
  height: 35px;
  justify-content: flex-end;
  align-items: center;
  margin-right: 20px;
}
.nolike_icon {
  font-size: 40px;
  margin-right: 9px;
}
.like_icon {
  color: #ee1c41;
  font-size: 40px;
  margin-right: 9px;
}
.likeNum {
  font-size: 22px;
  color: #000;
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
.face_icon {
  color: #ccc;
  font-size: 70px;
}
.sendTxt {
  color: #333;
  font-size: 28px;
}
/*底部浮层结束*/
</style>