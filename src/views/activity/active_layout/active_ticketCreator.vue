<template>
    <div class="share-success">
	  	<!-- <div class="head-top"></div> -->
	  	<div class="top" :style="{paddingTop:source==='iOS'?62:20+'px'}">
	  	  <image class="image-view1" :src='imgUrl+"back.png"' @click="pop()"></image>
	      <text class="title font-32">查看参与人</text>
	      <image  @click="sao"class="image-view1" :src='imgUrl+"scan.png"' ></image>
	  	</div>
	    <div class="share-text">
			<scroller class='winningLst' @loadmore="fetchPage" loadmoreoffset="600">
			<div class="winning-box">
				<div v-for="(item,index) in winningList" :key="index" class="winning-flex">
			    	<image class="img-view" :src="item.icon" @click="push2('/views/myPlace/myPlace',{mobile:item.mobile})"></image>
				    <text class="winning-create" v-if="item.userEmp == 1">创</text>
					<div class="winning-user">
						<text class="span1">{{item.nickname}}</text>
			  	 		<text class="span2">{{item.schoolName}}</text>
					</div>
				</div>
			</div>
			</scroller>
			<div class="show-code">
				<div class="code-title">
					<text class="fonw600">活动签到码</text>
					<text class="fonco82">扫描二维码进行活动签到</text>
				</div>
				<div class="code">
					<image class="codeImg" :src="codeSrc"></image>
				</div>
			</div>
			<div class="check-info" >
				<div class="info-tip">
					<text class="tipSpan">活动:{{title}}</text>
					<text class="tipSpan">地点:{{address}}</text>
					<text class="tipSpan">时间:{{starttime}}-{{endtime}}</text>
				</div>
			</div>
			<div class="info-draw">
	        	<div class="tip-line"></div>
	        	<text class="font-24 drawSpan" @click="toWining()" v-if="isLottery == 1">{{winningText}}</text>
	        </div>
			<div class="check-share">
				<div class="share-btn">
					<text class="font-24 btnSpan" @click="toGroupChat()">进入热聊</text>
				</div>
				<div class="share-btn1">
					<text class="font-24 btnSpan" @click="share()">邀请好友</text>
				</div>
			</div>
	 	</div>
	 	<!-- 加载器 -->
    	<wxc-loading :show="isLoading" type="default" need-mask="true"></wxc-loading>
	</div>
</template>
<script>
import mixins from "../../../mixins";
import { putActivitySign, getActivityMember } from "../../../api/activity.js";
import { scan } from "../../../api/weex";
import qrcode from "../../../utils/qrcode";
import { sharePage, openChat } from "../../../api/weex";
import { WxcLoading, Utils } from "weex-ui";
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
      isLoading: false,
      winningText: "开始抽奖", //抽奖描述
      isLottery: "", //是否有抽奖 0否 1是
      hasLottery: "", //是否抽奖 0否 1是
      codeSrc: "", //二维码
      userMobile: "", //this.$route.query.mobile,
      resId: "", //this.$route.query.resId,
      isCreator: "", //this.$route.query.isCreator,
      address: "", //this.$route.query.address,
      title: "", //this.$route.query.title,
      starttime: "", //this.$route.query.starttime,
      endtime: "", //this.$route.query.endtime,
      stateText: "", //this.$route.query.stateText,
      groupId: "", //this.$route.query.groupId,
      text: "", //
      signType: "",
      winningName: "毛绒玩具",
      codeNumber: "32",
      winningList: []
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
      this.stateText = JSON.parse(event.data).stateText;
      this.groupId = JSON.parse(event.data).groupId;
      this.hasLottery = JSON.parse(event.data).hasLottery;
      this.isLottery = JSON.parse(event.data).isLottery;
      //生成二维码
      // this.createQRCode(this.commonUrl+'?path=activityDetail&key=resId&value='+this.resId);
      this.createQRCode(
        this.commonUrl +
          "myyuleWeb/index.html?mobile=" +
          this.mobile +
          "&signType=" +
          (this.userMobile == this.mobile ? "host" : "guest") +
          "&resId=" +
          this.resId
      );
      if (this.hasLottery == 1) {
        this.winningText = "中奖信息";
      }
      if (this.isCreator == 0) {
        this.signType = "host";
      } else if (this.isCreator == 1) {
        this.signType = "guest";
      }
      //查看参与成员
      this.activityMember();
    });
  },
  mounted(){
    // 数据埋点
    this.putPageUrlLog(1606);
  },
  methods: {
    // 查看参与成员
    activityMember() {
      this.isLoading = true;
      getActivityMember({
        appid: this.appid,
        resId: this.resId,
        userEmp: "all",
        pageSize: "10"
      })
        .then(res => {
          if (res.status == 0) {
            this.isLoading = false;
            this.winningList = res.object;
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
      if (!this.isLoading) {
        this.pageNo++;
        this.activityMember();
      }
    },
    //抽奖
    toWining() {
      if (this.stateText != "即将开始") {
        this.push2("/views/activity/active_layout/active_winning", {
          resId: this.resId,
          stateText: this.stateText,
          title: this.title
        });
      } else {
        modal.alert({
          message: "未开始的活动不能进行抽奖！",
          duration: 0.5
        });
      }
    },
    share() {
      var self = this;
      let sObj = {
        title: self.title,
        desc: "查看参与人",
        web_url:
          self.commonUrl+"myyuleWeb/webShare/activity/index.html?resId=" +
          self.resId,
        img_url: "",
        sourse: "myyule"
      };
      sharePage(sObj);
    },
    //进入群聊
    toGroupChat() {
      var self = this;
      openChat({ chatacct: self.groupId, chattype: "2" }); //chattype: 1.点对点聊天，2.群组聊天
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
        //modal.alert({message:this.codeSrc});
      });
    },
    sao() {
      scan();
    }
  }
};
</script>

<style scope>
.font-32 {
  font-size: 32px;
  line-height: 32px;
}
.font-24 {
  font-size: 24px;
  line-height: 24px;
}
.share-success {
  width: 750px;
  flex: 1;
  position: relative;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
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
.image-view1 {
  width: 50px;
  height: 50px;
}
.font-w600 {
  font-weight: 600;
}
.share-text {
  width: 750px;
  height: 1334px;
}
.height1 {
  height: 1200px;
}
.height2 {
  height: 1200px;
}
.ctxt {
  width: 200px;
  text-align: center;
  margin-top: 10px;
  lines: 1;
}
.check-tip {
  height: 100px;
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
.img-view {
  border-radius: 57px;
  width: 114px;
  height: 114px;
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
  margin-top: 10px;
  position: relative;
  width: 200px;
}
.span1 {
  margin-top: 20px;
  text-align: center;
  width: 200px;
  lines: 1;
  font-size: 30px;
  color: #000;
}
.span2 {
  margin-top: 10px;
  text-align: center;
  width: 200px;
  lines: 1;
  font-size: 28px;
  color: #666;
}
.check-sign {
  width: 750px;
  height: 360px;
  background-color: #41b883;
  position: relative;
  border-bottom-width: 1px;
  border-bottom-style: dashed;
  border-bottom-color: #000;
}
.check-pos {
  position: relative;
  top: 220px;
}
.check-pos-a {
  position: absolute;
  top: 20px;
  left: 190px;
}
.share-img {
  width: 150px;
  height: 150px;
  position: absolute;
  left: 250px;
  top: 50px;
}
.img-view2 {
  border-bottom-left-radius: 75px;
  border-bottom-right-radius: 75px;
  border-top-left-radius: 75px;
  border-top-right-radius: 75px;
  width: 150px;
  height: 150px;
}
.show-code {
  width: 750px;
  height: 346px;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-style: dashed;
  border-bottom-color: #000;
  border-top-width: 1px;
  border-top-style: dashed;
  border-top-color: #000;
}
.code-title {
  margin-top: 130px;
  margin-left: 79px;
}
.fonw600 {
  font-weight: 600;
  font-size: 32px;
  line-height: 32px;
}
.fonco82 {
  color: #828282;
  line-height: 28px;
  font-size: 28px;
  margin-top: 22px;
}

.codeImg {
  width: 268px;
  height: 268px;
  margin-top: 30px;
  margin-bottom: 30px;
  margin-left: 30px;
}
.check-info {
  width: 750px;
  height: 242px;
  position: relative;
  /* border-bottom-width: 1px;
border-bottom-style: dashed;
border-bottom-color: #000; */
}
.info-tip {
  width: 550px;
  height: 200px;
  margin-left: 90px;
  margin-top: 55px;
}
.tipSpan {
  width: 550px;
  lines: 1;
  text-align: left;
  font-size: 26px;
  margin-top: 10px;
  color: #828282;
}
.tip-line {
  position: absolute;
  top: 29.5px;
  width: 750px;
  border-bottom-width: 1px;
  border-bottom-style: dashed;
  border-bottom-color: #000;
}
.info-draw {
  width: 750px;
  height: 60px;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.drawSpan {
  width: 251px;
  height: 60px;
  background-color: white;
  border-width: 1px;
  border-style: solid;
  border-color: #ee1c41;
  border-radius: 10px;
  text-align: center;
  color: #ee1c41;
  line-height: 60px;
}
.check-share {
  width: 750px;
  height: 250px;
  position: relative;
}
.btnSpan {
  color: #ffb5bd;
  text-align: center;
  line-height: 60px;
  color: white;
}
.share-btn {
  width: 250px;
  height: 60px;
  position: absolute;
  top: 80px;
  left: 100px;
  background-color: #e71842;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.share-btn1 {
  width: 250px;
  height: 60px;
  position: absolute;
  top: 80px;
  left: 400px;
  background-color: #e71842;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 750px;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
}
</style>