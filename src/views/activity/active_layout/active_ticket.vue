<template>
  <div class="share-success1">
  	<!-- <div class="head-top"></div> -->
  	<div class="top" :style="{paddingTop:source==='iOS'?62:20+'px'}">
  	  <image class="image-view1" :src='imgUrl+"back.png"' @click="pop()"></image>
      <text class="title font-32">票券</text>
      <text class="title font-32" @click="pop()">确认</text>
  	</div>
	  <div class="share-text">
	  	<div class="ticketBox">
		  	<div class="check-sign">
				<div class="check-pos-a">
					<text class="font-32-new">本次活动的签到码</text>
					<text class="font-64">{{signCode}}</text>
				</div>
				<div class="code">
					<image class="codeImg" :src="codeSrc"></image>
				</div>
				<div class="check-pos">
					<text class="font-24 sign-text">入场时请出示您的二维码</text>
					<text class="font-24 sign-text">若找不到请在我的-卡券中查找</text>
					<text class="font-24 sign-text">该二维码只能使用一次，扫后立即作废</text>
				</div>
			</div>
			<div class="check-info">
				<div class="info-tip">
					<text class="font-24 info-text">活动:{{title}}</text>
					<text class="font-24 info-text">地点:{{address}}</text>
					<text class="font-24 info-text">时间:{{starttime}}-{{endtime}}</text>
				</div>
			</div>
			<scroller class='winningLst' @loadmore="fetchPage" loadmoreoffset="600">
				<div  class="winning-box">
					<div class="winning-flex" v-for="(item,index) in winningList" :key="index">
					    <image class="img-view" :src="item.icon" @click="push2('/views/myPlace/myPlace',{mobile:item.mobile})"></image>
					    <text class="winning-create box-span" v-if="item.userEmp == 1">创</text>
						<div class="winning-user">
							<text class=" fon-600 winning-span1">{{item.nickname}}</text>
				  	 	    <text class=" color82 winning-span2">{{item.schoolName}}</text>
						</div>
					</div>
				</div>
			</scroller>
			<div class="botBox">
				<div class="check-tip">
					<text  class="font-24 tip-span">以上是想参加的小伙伴，一起进入热聊吧~</text>
				</div>
				<div class="check-share">
					<div class="share-btns btns-left">
						<text class="chk-text" @click="toGroupChat()">进入热聊</text>
					</div>
					<div class="share-btns btns-right">
						<text class="chk-text" @click="share()">邀请好友</text>
					</div>
				</div>
			</div>
		</div>
	 </div>
	 <!-- 加载器 -->
    <wxc-loading :show="isLoading" type="default" need-mask="true"></wxc-loading>
	</div>
</template>
<script>
import mixins from "../../../mixins";
import { getActivityMember, getActivityUser } from "../../../api/activity.js";
import { WxcLoading, Utils } from "weex-ui";
import { sharePage, openChat } from "../../../api/weex";
import qrcode from "../../../utils/qrcode";
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");
export default {
  mixins: [mixins],
  name: "share-success",
  components: {
    WxcLoading
  },
  data() {
    return {
      pageNo: 1,
      isLoading: false,
      codeSrc: "", //二维码
      userMobile: "", //this.$route.query.mobile,
      resId: "", //this.$route.query.resId,
      isCreator: "", //this.$route.query.isCreator,
      address: "", //this.$route.query.address,
      title: "", //this.$route.query.title,
      starttime: "", //this.$route.query.starttime,
      endtime: "", //this.$route.query.endtime,
      groupId: "", //this.$route.query.groupId,
      joinNum: "", //this.$route.query.joinNum,
      signCode: "",
      confirmKey: true,
      winningName: "毛绒玩具",
      winningList: [],
      common: "http://172.21.151.226:8099/web/#/",
      stop: false
    };
  },

  beforeCreate() {
    this.fontIcon();
  },
  created() {
    //获取平台信息
    this.platform = weex.config.env.platform;
    storage.getItem("data", event => {
      this.resId = JSON.parse(event.data).resId;
      this.userMobile = JSON.parse(event.data).mobile;
      this.isCreator = JSON.parse(event.data).isCreator;
      this.address = JSON.parse(event.data).address;
      this.title = JSON.parse(event.data).title;
      this.starttime = JSON.parse(event.data).starttime;
      this.endtime = JSON.parse(event.data).endtime;
      this.groupId = JSON.parse(event.data).groupId;
      this.joinNum = JSON.parse(event.data).joinNum;
      this.createQRCode(
        this.commonUrl +
          "myyuleWeb/index.html?mobile=" +
          this.mobile +
          "&signType=" +
          (this.userMobile == this.mobile ? "host" : "guest") +
          "&resId=" +
          this.resId
      );

      this.activityMember();
      //开启定时器
      this.checkSign();
      let time = setInterval(() => {
        if (this.stop == true) {
          clearInterval(time);
          return;
        } else {
          this.checkSign();
        }
      }, 3000);
    });
  },
  mounted(){
    // 数据埋点
    this.putPageUrlLog(1605);
  },
  methods: {
    // 查看参与成员
    activityMember() {
      this.isLoading = true;
      getActivityMember({
        appid: this.appid,
        resId: this.resId,
        userEmp: "all",
        pageSize: "10",
        pageNo: this.pageNo
      })
        .then(res => {
          if (res.status == 0) {
            this.isLoading = false;
            //this.winningList = res.object;
            this.winningList =
              this.pageNo > 1
                ? this.winningList.concat(res.object)
                : res.object;
            for (let i = 0; i < this.winningList.length; i++) {
              if (this.winningList[i].schoolName == undefined) {
                this.winningList[i].schoolName = "暂无学校信息";
              }
              if (this.winningList[i].icon == undefined) {
                this.winningList[i].icon =
                  "http://wap.myyule.teamshub.com/web-icon/in.png";
              } else if (this.winningList[i].icon.substr(0, 4) != "http") {
                this.winningList[i].icon =
                  "http://media2.myyule.cn/" + this.winningList[i].icon;
              }
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
    // 加载下一页
    fetchPage() {
      if (!this.isShow) {
        this.pageNo++;
        this.activityMember();
      }
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
        //QR.createImgTag(6, 12).substring(10,QR.createImgTag(6, 12).length-28);
      });
    },
    //跳转核对信息页
    toCheck() {
      this.push2("/views/activity/active_layout/active_check", {
        resId: this.resId,
        mobile: this.userMobile
      });
    },
    //进入群聊
    toGroupChat() {
      var self = this;
      openChat({ chatacct: self.groupId, chattype: "2" }); //chattype: 1.点对点聊天，2.群组聊天
    },
    //分享图标
    share() {
      var self = this;
      let sObj = {
        title: self.title,
        desc: "票券",
        web_url:
          self.commonUrl+"myyuleWeb/webShare/activity/index.html?resId=" +
          self.resId,
        img_url: "",
        sourse: "myyule"
      };
      sharePage(sObj);
    },
    //查询签到状态
    checkSign() {
      getActivityUser(
        {
          resId: this.resId,
          mobile: this.mobile
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.signCode = res.object.signCode;
            if (res.object.isSign == 1) {
              this.stop = true;
              modal.alert({
                message: `您已成功签到!`,
                duration: 1
              });
            }
          } else {
            this.stop = false;
            modal.toast({
              message: res.desc,
              duration: 1
            });
          }
        })
        .catch(err => {});
    }
  }
};
</script>

<style scope>
.font-64 {
  font-size: 64px;
  line-height: 64px;
}
.font-32 {
  font-size: 32px;
  line-height: 32px;
}
.font-24 {
  font-size: 24px;
  line-height: 24px;
}
.share-success1 {
  width: 750px;
  flex: 1;
  position: relative;
}
.head-top {
  width: 750px;
  height: 50px;
  background-color: #fff;
  top: 0;
  left: 0;
  position: fixed;
}
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
  /* padding-top:22px; */
  border-bottom-style: solid;
  border-bottom-color: #d9d9d9;
  border-bottom-width: 1px;
  position: fixed;
}
.image-view1 {
  width: 61px;
  height: 61px;
}
.re_icon {
  font-family: iconfont;
  color: #ee1c41;
  font-size: 40px;
  font-weight: bold;
}
.title {
  color: #000;
  line-height: 61px;
}
.font-w600 {
  font-weight: 600;
}
.share-text {
  flex: 1;
  width: 750px;
  height: 1334px;
}
.ticketBox {
  width: 750px;
  margin-top: 165px;
  margin-bottom: 201px;
}
.height1 {
  height: 1179px;
}
.height2 {
  height: 1284px;
}
.notice {
  color: #ee1c41;
  text-align: center;
  padding-top: 20px;
}
.winningLst {
  width: 750px;
  height: 280px;
}
.winning-box {
  width: 750px;
  flex-direction: row;
  border-bottom-color: #d9d9d9;
  border-bottom-style: dotted;
  border-bottom-width: 1px;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding-top: 50px;
  padding-bottom: 50px;
}
.winning-flex {
  margin-left: 35px;
  width: 200px;
  height: 250px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.box-span {
  margin-top: 10px;
  text-align: center;
}
.winning-create {
  font-size: 25px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  background-color: #e71842;
  color: white;
  position: absolute;
  top: 50px;
  left: 124px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  text-align: center;
}
.winning-user {
  position: relative;
}
.fon-600 {
  font-weight: 600;
}
.color82 {
  color: #828282;
}
.winning-span1 {
  width: 200px;
  lines: 1;
  font-size: 30px;
  text-align: center;
  margin-top: 20px;
}
.winning-span2 {
  width: 200px;
  lines: 1;
  font-size: 28px;
  text-align: center;
  margin-top: 10px;
}
.botBox {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 750px;
  height: 201px;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #cccaca;
  background-color: #fff;
}
.check-tip {
  height: 100px;
  width: 750px;
}
.tip-span {
  text-align: center;
  color: #828282;
  line-height: 80px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #cccaca;
}
.check-sign {
  width: 750px;
  height: 460px;
  position: relative;
  border-bottom-width: 1px;
  border-bottom-style: dashed;
  border-bottom-color: #000;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.sign-text {
  text-align: center;
  color: #828282;
  margin-top: 10px;
}
.check-pos {
  position: relative;
  align-items: center;
}
.code {
  position: relative;
  width: 250px;
  height: 250px;
}
.codeImg {
  width: 250px;
  height: 250px;
}
.check-pos-a {
  position: relative;
  flex-direction: row;
  align-items: center;
}
.font-32-new {
  font-size: 32px;
  line-height: 57px;
  margin-right: 10px;
}
.share-img {
  width: 250px;
  height: 250px;
  position: absolute;
  left: 250px;
  top: 50px;
}
.img-view {
  border-bottom-left-radius: 52px;
  border-bottom-right-radius: 52px;
  border-top-left-radius: 52px;
  border-top-right-radius: 52px;
  width: 113px;
  height: 113px;
}
.check-info {
  width: 750px;
  height: 242px;
  position: relative;
  line-height: 80px;
  border-bottom-width: 1px;
  border-bottom-style: dashed;
  border-bottom-color: #000;
}
.info-tip {
  width: 550px;
  height: 200px;
  position: absolute;
  top: 80px;
  left: 100px;
}
.info-text {
  text-align: left;
  margin-top: 10px;
  lines: 1;
  width: 550px;
}
.check-share {
  width: 750px;
  height: 100px;
  position: relative;
  border-bottom-width: 1px;
  border-bottom-style: dashed;
  border-bottom-color: #000;
}
.share-btns {
  width: 250px;
  height: 70px;
  position: absolute;
  top: 4px;
  background-color: #e71842;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.btns-left {
  left: 100px;
}
.btns-right {
  left: 400px;
}
.chk-text {
  color: #fff;
  text-align: center;
  line-height: 70px;
  font-size: 26px;
}
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 750px;
  bottom: 0;
  background-color: #000;
  opacity: 0.8;
}
</style>