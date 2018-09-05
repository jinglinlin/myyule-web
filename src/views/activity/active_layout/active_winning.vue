<template>
	<div class="share-success1">
    <image class="winningBg-view" :src='imgUrl+"winningBg.png"'></image>
		<!-- <div class="head-top"></div> -->
		<div class="top" :style="{marginTop:source==='iOS'?62:20+'px'}">
		  <image class="image-view" :src='imgUrl+"back.png"' @click="pop()"></image>
     	<text class="title font-32">中奖名单</text>
  	</div>
	  <scroller class="share-text">
      <div class="winningBox">
  	  	<div class="activity-box">
    		  <text class="activity-title">{{title}}</text>
  	  	  <div class="share-img">
  			     <image class="img-view" :src="userData.icon"></image>
  			  </div>
  			  <text class="winning-name">{{userData.nickname}}</text>
  			  <text class="winning-school">{{userData.schoolName}}</text>
  	  	</div>
        <div class="lotteryInfo" v-for="(item,index) in awardList" :key="index">
          <div class="award-style">
            <text class="award-text">奖品名称:{{item.awardName}}</text>
          </div>
          <div class="award-style1">
            <text class="award-text">获奖人：</text>
          </div>
      		<div class="winning-box">
      			<div class="winning-flex"v-for="(userItem,index) in item.winningList">
      				<div class="share-img11">
      				  <image class="img-view11" :src="userItem.icon"></image>
      				</div>
      				<div class="winning-user">
      					  <text class="winning-name">{{userItem.nickname}}</text>
      				  	<text class="winning-school">{{userItem.schoolName}}</text>
      				</div>
      			</div>
      		</div>
        </div>
      </div>
	  </scroller>
    <!-- 加载器 -->
    <wxc-loading :show="isLoading" type="default" need-mask="true"></wxc-loading>
	</div>
</template>
<script>
import mixins from "../../../mixins";
import { putActivityLottery, getUserInfo } from "../../../api/activity.js";
import { WxcLoading, Utils } from "weex-ui";
const modal = weex.requireModule("modal");
var storage = weex.requireModule("storage");
export default {
  mixins: [mixins],
  components: {
    WxcLoading
  },
  data() {
    return {
      isLoading: false,
      title: "", //this.$route.query.title,
      winningList: [],
      awardList: [],
      stateText: "", //this.$route.query.stateText,
      resId: "", //this.$route.query.resId,
      title: "", //this.$route.query.title,
      //mobile:'',//
      userData: {}
    };
  },

  beforeCreate() {
    this.fontIcon();
  },
  created() {
    storage.getItem("data", event => {
      this.stateText = JSON.parse(event.data).stateText;
      this.resId = JSON.parse(event.data).resId;
      this.title = JSON.parse(event.data).title;

      this.winningMember();
      this.queryLottery();
    });
    //this.mobile = '650F95307ACC3379453476C43DF386F9';
  },

  mounted(){
    // 数据埋点
    this.putPageUrlLog(1608);
  },

  methods: {
    // 查看中奖成员
    winningMember() {
      this.isLoading = true;
      getUserInfo(
        {
          appid: this.appid,
          mobile: this.mobile
          //     toMobile:'9EFC7F96C52DEA4FB234765796F96B4A',
        },
        { token: this.mobile }
      )
        .then(res => {
          if (res.status == 0) {
            this.isLoading = false;
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
    //抽奖查询
    queryLottery() {
      this.isLoading = true;
      putActivityLottery({
        appid: this.appid,
        resId: this.resId
      })
        .then(res => {
          if (res.status == 0) {
            this.isLoading = false;
            this.awardList = res.object.award;
            this.winningList = res.object.lotteryUsers;
            for (let j = 0; j < this.awardList.length; j++) {
              this.awardList[j].winningList = [];
              for (let i = 0; i < this.winningList.length; i++) {
                if (this.winningList[i].icon.substr(0, 4) != "http") {
                  this.winningList[i].icon =
                    "http://media2.myyule.cn/" + this.winningList[i].icon;
                }
                if (this.winningList[i].schoolName == undefined) {
                  this.winningList[i].schoolName = "暂无学校信息";
                }
                if (
                  this.awardList[j].awardName == this.winningList[i].awardName
                ) {
                  this.awardList[j].awardName = this.winningList[i].awardName;
                  this.awardList[j].winningList.push(this.winningList[i]);
                }
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
    }
  }
};
</script>

<style scope>
.font-32 {
  font-size: 32px;
  line-height: 32px;
}
.re_icon {
  position: absolute;
  left: 15px;
  top: 20px;
  font-family: iconfont;
  color: #ee1c41;
  font-size: 40px;
  font-weight: bold;
}
.share-success1 {
  width: 750px;
  flex: 1;
  position: relative;
}
.winningBg-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 750px;
  height: 1334px;
}
.head-top {
  width: 750px;
  height: 50px;
  top: 0;
  left: 0;
  position: fixed;
}
.top {
  top: 0px;
  width: 750px;
  left: 0;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 22px;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 22px;
  border-bottom-style: solid;
  border-bottom-color: #ccc;
  border-bottom-width: 1px;
}
.image-view {
  position: absolute;
  left: 15px;
  top: 10px;
  width: 50px;
  height: 50px;
}
.title {
  color: #000;
  line-height: 61px;
}
.share-text {
  height: 1208px;
}
.winningBox {
  width: 750px;
}
.activity-box {
  width: 750px;
  text-align: center;
  align-items: center;
}
.activity-title {
  font-size: 32px;
  line-height: 48px;
  text-align: center;
  margin-top: 40px;
}
.share-img {
  margin-top: 70px;
  margin-left: auto;
  margin-right: auto;
  width: 110px;
  height: 110px;
}
.img-view {
  width: 110px;
  height: 110px;
  border-radius: 55px;
}
.lotteryInfo {
  padding-bottom: 20px;
  justify-content: center;
}
.winning-box {
  width: 750px;
  flex-direction: row;
  justify-content: space-between;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.award-style {
  width: 750px;
  margin-top: 25px;
  justify-content: center;
  align-items: center;
}
.award-style1 {
  width: 750px;
  margin-top: 25px;
  margin-bottom: 22px;
  padding-left: 35px;
  justify-content: flex-start;
}
.award-text {
  font-size: 32px;
  line-height: 48px;
}
.winning-flex {
  margin-left: 35px;
  width: 200px;
  height: 250px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.share-img11 {
  width: 110px;
  height: 110px;
}
.img-view11 {
  border-radius: 55px;
  width: 110px;
  height: 110px;
}
.winning-user {
  width: 200px;
}
.winning-name {
  font-size: 30px;
  line-height: 30px;
  text-align: center;
  margin-top: 20px;
  width: 200px;
  lines: 1;
}
.winning-school {
  color: #828282;
  font-size: 28px;
  text-align: center;
  line-height: 28px;
  margin-top: 10px;
  width: 200px;
  lines: 1;
}
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
}
</style>