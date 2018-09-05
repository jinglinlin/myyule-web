<template>
    <div class="myPoints" @viewappear="appper">
        <scroller class="scroller">
        <div class="mainTop">
            <div class="points-top-bg">
                <image :src="imgUrl+'slider-bg.png'" style="height:440px;width:750px"></image>
            </div>
            <div class="top" :style="{paddingTop:source==='iOS'?62:20+'px'}">
                <div @click="_back()" class="left">
                    <image class="image-view" :src="imgUrl+'back2.png'"></image>
                </div>
                <text class="font-32 color-white">乐币积分</text>
                <text @click="toPayments" class="font-32 color-white">明细</text>
            </div>
            <div class="points-content-1">
                <text class="font-32 title-1">总乐币值{{currentData.totalMoney}}</text>
                <div class="steps-line"></div>
                <div class="steps">
                    <div class="step-item before">
                        <image class="step-icon" :src="imgUrl+'step-before.png'"></image>
                        <text class="font-20 points-p">V{{userLevelData.currentLevel}}</text>

                    </div>
                    <div class="step-item">
                        <image class="step-icon" :src="imgUrl+'step.png'"></image>
                        <text class="font-20 points-p">V{{parseInt(userLevelData.currentLevel)+1}}</text>
                    </div>
                    <div class="step-item">
                        <image class="step-icon" :src="imgUrl+'step.png'"></image>
                        <text class="font-20 points-p">V{{parseInt(userLevelData.currentLevel)+2}}</text>
                    </div>
                </div>

                <image class="user-icon" resize="cover" :src="'http://media2.myyule.cn/'+userIcon" placeholder="http://www.myyule.com/images/head-02.jpg"></image>
                <div class="msg-bottom">
                    <div class="lefts">
                        <text class="font-22 color-white">当前等级特权：免费抽奖{{currentData.lotteryNum}}次</text>
                        <text class="font-22 color-white">等级数据每天早上6点更新</text>
                    </div>
                    <div class="rights">
                        <image class="right-bg" :src="imgUrl+'right-bg.png'"></image>
                        <text class='right-p'>500乐币=VIP/月</text>
                    </div>
                </div>

            </div>

        </div>
        <slider class="slider" interval="3000" auto-play="true">
            <div class="frame" v-for="(item,index) in myLotteryNotice" :key="index">
                <text class="frame-p font-26">中奖快报：恭喜{{item.userName}}抽中了{{item.awardName}}！</text>
            </div>
        </slider>
        <div class="points-content-2">
            <div class="title-2" @click="animit">
                <image class="title-bg" :src="imgUrl+'title-bg.png'"></image>
                <text v-if="parseInt(userLevelData.currentLevel)<10" class="text font-26">距下一个等级V{{parseInt(userLevelData.currentLevel)+1}}</text>
                <text v-if="parseInt(userLevelData.currentLevel)>=10" class="text font-26">黄金等级</text>

            </div>
            <div class="program-wrapper">
                <div class="program">

                    <div class="cicleStyle">
                        <div class="cicleSmall bgSmallR" >
                            <div ref="test" class="cirFirst" :style="{bottom:moneyPercent2+'px'}"></div>
                            <!--<div class="cicleBg" :style="{bottom:moneyPercent2+'px'}"></div>-->
                            <div class="text2" style="">
                                <text class="text2-p font-26">还需</text>
                                <text class="text2-p font-26">{{needMoney}}乐币</text>
                            </div>
                        </div>
                    </div>
                    <text class="program-p">累计乐币{{currentData.totalMoney}}</text>
                </div>
                <div class="program">

                    <div class="cicleStyle">
                        <div class="cicleSmall">
                            <div  class="cirFirst" :style="{bottom:dayPercent2+'px'}"></div>
                            <!--<div class="cicleBg" :style="{bottom:dayPercent2+'px'}"></div>-->
                            <div class="text2">
                                <text class="text2-p font-26">还需</text>
                                <text class="text2-p font-26">{{needSingDay}}天</text>
                            </div>
                        </div>
                    </div>
                    <text class="program-p">登录天数{{currentData.signDay}}</text>
                </div>
            </div>
        </div>
        <div class="day-missions"  @click="toMyMission()">
            <div class="missions-left">
                <image class="missions-image" :src="imgUrl+'day-mission.png'"></image>
                <div class="missions-text">
                    <text class="font-24 ">每日任务</text>
                    <div class="text-inner">
                        <text class="font-22 color-gray">今日可免费获取</text>
                        <text class="font-22" style="color:#ee1c41">{{dayMoney}}乐币</text>
                    </div>
                </div>
            </div>
            <div class="missions-right">
                <text class="font-22" style="padding-top:27px;padding-bottom:19px;">已完成{{overMission}}/{{myMissionsData.length}}</text>
                <div class="get">
                    <text class="get-p font-22">去领取</text>
                </div>
            </div>
        </div>
        <div class="turntable">
            <image class="turntable-bg" :src="imgUrl+'turntable-bg.png'"></image>
            <div class="prize-list">
                <div class="prize-item" :class="[itime == index?'active':'','index'+index]"  v-for="(item,index) in prizeList" :key="index">
                    <image class="prize-image" resize="cover" :src="item.awardLogo?(imgSrc+item.awardLogo):(imgUrl+'prize.png')"></image>
                    <div v-if="itime == index" class="active-bg"></div>
                    <text class="prize-name color-pink font-22" style="color:#EE1C41">{{item.awardName}}</text>
                </div>
                <div @click="_start" class="item buttom">
                    <image class="prize-imageb" :src="imgUrl+'start.png'"></image>
                    <text class="prize-name font-22 tip color-pink">100%中奖</text>
                    <text class="prize-name font-32 color-white">我要</text>
                    <text class="prize-name font-32 color-white">抽奖</text>
                </div>
            </div>

        </div>
        <div class="bottomPage">
            <div @click="rechange" class="itemBottom">
                <image class="bottomPage-image" :src="imgUrl+'prize-list.png'"></image>
                <div>
                    <text class="bottomPro font-26">可兑换商品</text>
                </div>
            </div>
            <text class="font-24 color-gray">开发中...</text>
            <div class="bottomPage-item">
                <image class="bottomPage-image" :src="imgUrl+'rechange-coin.png'"></image>
                <text @click="rechange" class="font-26">充值乐币</text>
            </div>
        </div>

        <wxc-loading loading-text="加载中" :show="isShow" :need-mask="true"></wxc-loading>
        </scroller>
    </div>
</template>
<script>
import mixins from "../../mixins";
import { WxcIcon } from "weex-ui";
import {
  getUserIevel,
  getUserLottery,
  getMission,
  putUserLottery,
  getLottery,
  getLotteryNotice
} from "../../api/userInfo";
const modal = weex.requireModule("modal");
const storage = weex.requireModule("storage");
// const animation = weex.requireModule("animation");

export default {
  mixins: [mixins],
  components: {
    WxcIcon
  },
  data() {
    return {
      num: 50,
      num2: 80,
      prizeList: [],
      itime:-1,
      userIcon: "",
      userLevelData: [],
      currentData: [],
      requirements: [],
      myMissionsData: [],
      myLotteryNotice: [],
      money: ""
    };
  },
  computed: {
    // 还需天数
    needSingDay() {
      return this.requirements.signDay - this.currentData.signDay > 0
        ? this.requirements.signDay - this.currentData.signDay
        : 0;
    },
    // 还需积分
    needMoney() {
      return this.requirements.totalMoney - this.currentData.totalMoney > 0
        ? this.requirements.totalMoney - this.currentData.totalMoney
        : 0;
    },
    // 还需积分百分比
    moneyPercent() {
      const currentMoney = parseInt(this.currentData.totalMoney);
      const requirementMoney = parseInt(
        this.requirements.totalMoney ? this.requirements.totalMoney : 0
      );
      return 100 * currentMoney / requirementMoney > 100
        ? 100
        : 100 * currentMoney / requirementMoney;
    },
    // 还需积分百分比2
    moneyPercent2() {
      const currentMoney = parseInt(this.currentData.totalMoney);
      const requirementMoney = parseInt(
        this.requirements.totalMoney ? this.requirements.totalMoney : 0
      );
      return (currentMoney / requirementMoney)*165>=165?165:(currentMoney / requirementMoney)*165;
    },
    // 还需天数百分比
    dayPercent() {
      const currentDay = parseInt(this.currentData.signDay);
      const requirementDay = parseInt(
        this.requirements.signDay ? this.requirements.signDay : 0
      );
      return 100 * currentDay / requirementDay > 100
        ? 100
        : 100 * currentDay / requirementDay;
      // return  180
    },
    dayPercent2() {
      const currentDay = parseInt(this.currentData.signDay);
      const requirementDay = parseInt(
        this.requirements.signDay ? this.requirements.signDay : 0
      );
      // return  180
      return currentDay / requirementDay * 165 >= 165
        ? 165
        : currentDay / requirementDay * 165;
    },
    overMission() {
      let overMissionNum = 0;
      this.myMissionsData.forEach((value, index, array) => {
        if (value.isComplete == 1 || value.isComplete == 2) {
          overMissionNum++;
        }
      });
      return overMissionNum;
    },
    dayMoney() {
      let money = 0;
      this.myMissionsData.forEach((value, index, array) => {
        money += value.reward;
      });
      return money;
    }
  },
  created() {
      if(this.webParam()){
          this.userIcon = this.webParam().userIcon;
      }else{
          // 获取用户信息
          storage.getItem("userIcon", event => {
              this.userIcon = event.data;
          });
      }
  },
  mounted(){
    this.putPageUrlLog(1201);
    // this.appper();
  },
  methods: {
    _back() {
      this.pop();
    },
    // 开始抽奖
    _start() {
      if (!this.isShow) {
        this.isShow = true;
        this.itime =-1;
        putUserLottery(
          {
            mobile: this.mobile,
            lotteryType: "level"
          },
          { token: this.mobile }
        )
          .then(res => {
            if (res.status == 0) {
              this.isShow = false;
              this.currentData.lotteryNum -= 1;
              const result = res.object;
              let num = 0;
              let overNumb = 0;
              this.prizeList.forEach((value, index, array) => {
                if (result.awardName === value.awardName) {
                  overNumb = 16 + index;
                  console.log(overNumb);
                }
              });
              let start_prize = setInterval(() => {
                num++;
                this.itime = num % 8;
                console.log("overNumb=" + overNumb + "," + "num=" + num);
                if (num == overNumb) {
                  clearInterval(start_prize);
                  modal.alert(
                    {
                      message: "恭喜你抽中" + result.awardName + "!",
                      duration: 0.3
                    },
                    function(value) {}
                  );
                }
              }, 100);
            } else {
              this.isShow = false;
              modal.alert(
                {
                  message: res.desc,
                  duration: 0.3
                },
                function(value) {}
              );
            }
          })
          .catch(err => {});
      }
    },
    // 打开兑换商品列表
    rechange() {
      modal.toast({ message: "正在开发中" });
    },

    // 打开每日任务
    toMyMission() {
      this.push2("/views/userInfo/myMission");
    },
    // 打开收支明细
    toPayments() {
      this.push2("/views/userInfo/payments");
    },
      appper(){
          // 获取用户等级信息
          getUserIevel(
              {
                  mobile: this.mobile
              },
              { token: this.mobile }
          )
              .then(res => {
                  if (res.status == 0) {
                      this.isShow = false;
                      this.userLevelData = res.object;
                      this.requirements = this.userLevelData.requirements
                          ? this.userLevelData.requirements
                          : {};
                      this.currentData = this.userLevelData.currentData;

                      this.money =
                          parseInt(this.currentData.totalMoney) /
                          parseInt(this.requirements.totalMoney) *
                          170;
                  } else {
                      console.log(res.desc);
                  }
              })
              .catch(err => {});
          // 获取每日任务信息
          getMission(
              {
                  mobile: this.mobile,
                  missionType: "day"
              },
              { token: this.mobile }
          )
              .then(res => {
                  if (res.status == 0) {
                      this.myMissionsData = res.object;
                  } else {
                      console.log(res.desc);
                  }
              })
              .catch(err => {});
          // 获取奖池信息
          getLottery(
              {
                  lotteryType: "level"
              },
              { token: this.mobile }
          )
              .then(res => {
                  if (res.status == 0) {
                      this.prizeList = res.object;
                      console.log(this.prizeList);
                      let len = 8 - this.prizeList.length;

                      for (let n = 0; n < len; n++) {
                          this.prizeList.push({ awardName: "敬请期待！" });
                      }
                  } else {
                      console.log(res.desc);
                  }
              })
              .catch(err => {});
          // 获取获奖公告
          getLotteryNotice(
              {
                  lotteryType: "level",
                  pageNo: 1,
                  pageSize: 10
              },
              { token: this.mobile }
          )
              .then(res => {
                  if (res.status == 0) {
                      this.myLotteryNotice = res.object;
                  } else {
                      console.log(res.desc);
                  }
              })
              .catch(err => {});
      }
  }
};
</script>
<style src="../../assets/style/index.scss">
</style>
<style  scoped>
p {
  color: #3b3b3b;
  text-align: center;
}
.color-white {
  color: #fff;
}
.color-pink {
  color: #ee1c41;
}
.color-gray {
  color: #666666;
}
.font-22 {
  font-size: 22px;
}
.font-24 {
  font-size: 24px;
}
.font-32 {
  font-size: 32px;
}
.font-26 {
  font-size: 26px;
}
.image-view {
  width: 42px;
  height: 42px;
}
.myPoints {
  width: 750px;
  background-color: #fff;
  flex: 1;
}

.mainTop {
  position: relative;
}
.points-top-bg {
  position: absolute;
  width: 750px;
  top: 0px;
  left: 0;
}
.top {
  /*position: fixed;*/
  width: 750px;
  /*z-index: 3;*/
  left: 0;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 22px;
  padding-left: 40px;
  padding-right: 40px;
  color: white;
  top: 0px;
}

.title {
  color: #000;
  line-height: 61px;
}
.left {
  width: 42px;
  height: 42px;
}
.right {
  width: 61px;
  height: 61px;
}

.points-content-1 {
  position: relative;
  height: 330px;
}

.title-1 {
  padding-top: 22px;
  padding-bottom: 7px;
  justify-content: center;
  text-align: center;
  color: white;
}
.steps {
  padding-left: 54px;
  padding-right: 54px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
}
.step-item {
  width: 50px;
  height: 50px;
  position: relative;
  /*margin-top: -12px;*/
}
.step-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
  /*z-index: -1;*/
}
.points-p {
  line-height: 50px;
  text-align: center;
  color: #b28063;
}

.steps-line {
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #f6e39f;
  position: absolute;
  left: 0;
  top: 95px;
  width: 750px;
  /*z-index: -1;*/
}
.user-icon {
  width: 88px;
  height: 88px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  background-color: #ececec;
  margin-top: 10px;
  margin-bottom: 17px;
  margin-left: 39px;
}
.msg-bottom {
  margin-left: 36px;
  margin-right: 31px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
}
.lefts {
  text-align: left;
  width: 300px;
}
.rights {
  position: relative;
  height: 59px;
  align-items: center;
  flex-direction: column;
}
.right-bg {
  position: absolute;
  right: 0;
  top: 0;
  /*z-index: -1;*/
  width: 240px;
  height: 59px;
}
.right-p {
  text-align: center;
  color: #b28063;
  font-size: 28px;
  padding-top: 14px;
}

.slider {
  width: 750px;
  height: 59px;
  background-color: #ececec;
}
.frame {
  width: 750px;
  height: 59px;
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.frame-p {
  text-align: center;
  color: #666666;
}

.title-2 {
  position: relative;
  width: 256px;
  height: 80px;
  margin-top: 19px;
}
.text {
  color: #fff;
  line-height: 85px;
  text-align: center;
  margin-bottom: 17px;
}
.title-bg {
  position: absolute;
  width: 256px;
  height: 80px;
  top: 0;
  left: 0;
  /*z-index: -1;*/
}

.program-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
}
.program {
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.program-p {
  text-align: center;
  padding-top: 10px;
  padding-bottom: 17px;
  font-size: 26px;
}

.day-missions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 18px;
  padding-bottom: 18px;
  padding-left: 34px;
  padding-right: 34px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
}
.missions-left {
  flex-direction: row;
  align-items: center;
}
.missions-image {
  width: 90px;
  height: 90px;
  margin-right: 20px;
}
.missions-text {
  padding-top: 5px;
  padding-bottom: 5px;
}
.text-inner {
  flex-direction: row;
}

.missions-right {
  padding-bottom: 29px;
}
.get {
  width: 91px;
  height: 34px;
  color: #fff;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  background-color: #ee1c41;
}
.get-p {
  color: #fff;
  line-height: 34px;
  text-align: center;
}

.turntable {
  width: 694px;
  height: 694px;
  margin-top: 19px;
  margin-bottom: 19px;
  flex-direction: row;
  justify-content: center;
  margin-left: 28px;
}
.prize-list {
  position: relative;
  width: 538px;
  height: 590px;
  margin-top: 24px;
  margin-bottom: 24px;
  margin-right: auto;
  margin-left: auto;
  margin-top: 74px;
}
.prize-item {
  position: absolute;
  width: 120px;
  /*height: 120px;*/
}
.active-bg {
  width: 120px;
  height: 120px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(238, 28, 65, 0.6);
}
.prize-image {
  width: 120px;
  height: 120px;
}
.prize-name {
  padding-top: 5px;
  text-align: center;
}

.index7 {
  top: 0;
  left: 0;
}
.index0 {
  top: 0;
  left: 210px;
}
.index1 {
  top: 0;
  right: 0;
}
.index2 {
  top: 201px;
  right: 0;
}
.index3 {
  top: 402px;
  right: 0;
}
.index4 {
  top: 402px;
  left: 210px;
}
.index5 {
  top: 402px;
  left: 0;
}
.index6 {
  top: 201px;
  left: 0;
}
.buttom {
  position: relative;
  top: 201px;
  left: 179px;
  width: 183px;
  height: 184px;
  padding-top: 51px;
}
.prize-imageb {
  position: absolute;
  top: 0;
  left: 0;
  width: 183px;
  height: 184px;
}
.name {
  line-height: 40px;
}
.tip {
  position: absolute;
  top: 21px;
  right: -24px;
  width: 125px;
  transform: rotate(45deg);
}

.turntable-bg {
  position: absolute;
  width: 694px;
  height: 694px;
  top: 0;
  left: 0;
  /*z-index: -1;*/
}
.itemBottom {
  flex-direction: row;
  justify-content: space-between;
}
.bottomPage {
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
  width: 750px;
  height: 115px;
  background-color: #fff;
  border-top-color: #ececec;
  border-top-width: 2px;
  border-top-style: solid;
  margin-top: 20px;
}
.bottomPro {
  margin-bottom: 5px;
  disabled: true;
}
.bottomPage-item {
  flex-direction: row;
  align-items: center;
  padding-bottom: 10px;
  padding-top: 10px;
  padding-right: 20px;
  padding-left: 20px;
}
.bottomPage-image {
  width: 34px;
  height: 34px;
  margin-right: 10px;
}
.cicleStyle {
  width: 170px;
  height: 170px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  /*background-color:darkgray;*/
  border-width: 2px;
  border-color: gainsboro;
  border-style: solid;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.cicleBg {
  width: 160px;
  height: 160px;
  position: absolute;
  background-color: white;
  position: absolute;
  right: 0px;
}
.cicleSmall {
  position: relative;
  width: 160px;
  height: 160px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  background-color: #ffb9bd;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.bgSmallR {
  background-color: #d4e9be;
}
.text2 {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;
}
.text2-p {
  color: #3b3b3b;
}
.cirFirst {
  position: absolute;
  width: 360px;
  height: 360px;
  left: -100px;
  background-color: white;

}
</style>
