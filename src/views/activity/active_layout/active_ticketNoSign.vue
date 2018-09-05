<template>
  <div class="share-success">
  	<!-- <div class="head-top"></div> -->
  	<div class="top" :style="{paddingTop:source==='iOS'?62:20+'px'}">
      <image class="image-view" :src='imgUrl+"back.png"' @click="pop()"></image>
      <text class="title font-32">感谢你的参与</text>
      <text @click="pop()" class="font-32 red">确认</text>
  	</div>
	  <div class="share-text">
			<div  class="winning-box">
				<div v-for="(item,index) in winningList" :key="index" class="winning-flex">
          <image class="img-view" :src="item.icon" @click="push2('/views/myPlace/myPlace',{mobile:item.mobile})"></image>
          <text class="winning-create" v-if="item.userEmp == 1">创</text>
					<div class="winning-user">
						<text class="span1">{{item.nickname}}</text>
			  	 	<text class="span2">{{item.schoolName}}</text>
					</div>
				</div>
			</div>
	 </div>
	 <div class="share-foot">
	 	  <div class="check-tip">
				<text class="tip-span">以上是想参加的小伙伴，一起进入热聊吧~</text>
			</div>
			<div class="check-share">
				<div class="share-btn" @click="toGroupChat()">
					<text class="share-span">进入热聊</text>
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
import { WxcLoading } from "weex-ui";
import { openChat } from "../../../api/weex";
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
      mylImg: "http://media2.myyule.cn/",
      resId: "", //this.$route.query.resId,
      groupId: "", //this.$route.query.groupId,
      signType: "",
      confirmKey: true,
      winningName: "毛绒玩具",
      winningList: []
    };
  },
  created() {
    storage.getItem("data", event => {
      this.resId = JSON.parse(event.data).resId;
      this.groupId = JSON.parse(event.data).groupId;
      if (this.isCreator == 0) {
        this.signType = "host";
      } else if (this.isCreator == 1) {
        this.signType = "guest";
      }
      this.activityMember();
    });
  },
  mounted(){
    // 数据埋点
    this.putPageUrlLog(1607);
  },
  methods: {
    // 查看参与成员
    activityMember() {
      this.isLoading = true;
      getActivityMember({
        appid: this.appid,
        resId: this.resId,
        userEmp: "all",
        pageSize: "9"
      })
        .then(res => {
          if (res.status == 0) {
            this.isLoading = false;
            this.winningList = res.object;
            for (let i = 0; i < this.winningList.length; i++) {
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
            console.log(res.desc);
            modal.toast({
              message: res.desc,
              duration: 1
            });
          }
        })
        .catch(err => {});
    },
    //进入群聊
    toGroupChat() {
      var self = this;
      openChat({ chatacct: self.groupId, chattype: "2" }); //chattype: 1.点对点聊天，2.群组聊天
    }
  }
};
</script>

<style scope>
.share-success {
  width: 750px;
  height: 1284px;
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
  position: fixed;
}
.title {
  color: #000;
  line-height: 61px;
}
.image-view {
  width: 61px;
  height: 61px;
}
.font-w600 {
  font-weight: 600;
}
.share-text {
  margin-top: 165px;
  width: 750px;
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
  top: 80px;
  left: 124px;
  border-radius: 20px;
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
.share-foot {
  width: 750px;
  height: 252px;
  position: fixed;
  left: 0;
  bottom: 0;
  border-bottom-style: dashed;
  border-bottom-color: black;
  border-bottom-width: 1px;
}
.check-tip {
  background-color: #fff;
  height: 144px;
  line-height: 144px;
}
.tip-span {
  font-size: 24px;
  text-align: center;
  line-height: 100px;
}
.check-share {
  width: 750px;
  height: 108px;
}
.share-btn {
  width: 750px;
  height: 108px;
  line-height: 108px;
  background-color: #e71842;
}
.share-span {
  text-align: center;
  line-height: 108px;
  font-size: 30px;
  color: #fff;
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
.font-32 {
  font-size: 32px;
  line-height: 32px;
}
.red {
  color: #ef1842;
}
</style>