<template>
  <div class="lotteryNotice">
    <div @click="push2('/views/activity/active_layout/active_detail',{resId:item.resId})" v-for="(item,index) in activityData" :key="index" class="clubActivity-item">
      <div v-if="iStyle==='club'" class="user-info" @click="push2('/views/myPlace/myPlace',{mobile:item.mobile})">
        <div class="left">
          <div class="pic">
            <image class="image-view img-vip" resize="cover" :src="'http://media2.myyule.cn/'+item.icon" placeholder="http://www.myyule.com/images/head-02.jpg"></image>
          </div>
          <div class="info">
            <text class="info-text font-26">{{item.nickname}}</text>
            <text class="font-22 info-text color-gray">{{noticeTime(item.createtime)}}</text>
          </div>
        </div>
      </div>
      <div class="activity-banner">
        <image class="image-view img-bg" resize="cover" :src="((item.logo?item.logo:item.resData.logo).substr(0,4)!=='http'?'http://media2.myyule.cn/':'')+(item.logo?item.logo:item.resData.logo)" ></image>
      
        <div class="activity-static">
          <text class="static-text">{{activeState(item)}}</text>
        </div>
      </div>
        <div class="activity-content">
          <div class="activity-title">
            <text lines="1" class="title-text font-32">{{item.title?item.title:item.resData.title}}</text>
            <div class="type">
              <text class="color-pink font-18">{{item.actType?item.actType:item.resData.actType}}</text>
            </div>
          </div>
          <div class="content-1">
            <div class="adress">
              <text class="iconfont feeType-text">&#xe609;{{item.address?item.address:item.resData.address}}</text>
            </div>
          </div>
          <div class="content-2"> 
            <div class="time">
              <text class="iconfont feeType-text">&#xe63f;{{(item.starttime?item.starttime:item.resData.starttime).substr(0,10)}} - {{(item.endtime?item.endtime:item.resData.endtime).substr(0,10)}}</text>
            </div>
          </div>
          <div class="content-3"> 
            <div class="feeType">
              <text class="feeType-text iconfont" v-if="(item.resData?item.resData.feeType:item.feeType) ==0">&#xe615;免费</text>
              <text class="feeType-text iconfont" v-if="(item.resData?item.resData.feeType:item.feeType) ==1">&#xe615;收费</text>
            </div>
          </div>
          <myDashed></myDashed>
          <!-- 底部bar -->
          <div v-if="!card" class="tip-list" ref="tip">
            <div @click="push2('/views/activity/active_layout/activityComment',{resId:item.resId,mobile:item.mobile})" class="comment">
              <image class="img image-view" :src='imgUrl+"comment.png"' ></image>
              <text class="icon-text">{{item.resData?item.resData.commentNum:item.commentNum}}</text>
            </div>
            <div @click="thumb(item)" class="thumb">
          <image class="img image-view" :src='imgUrl+(((item.resData?item.resData.isThumb:item.isThumb)==1)?"thumbNumActive.png":"thumbNum.png")' ></image>
              <text class="icon-text">{{item.resData?item.resData.thumbNum:item.thumbNum}}</text>
            </div>
            <div @click="share(item)" class="share">
              <image class="img image-view" :src='imgUrl+"min-share.png"' ></image>
              <!-- <text class="icon-text">{{item.resData?item.resData.shareNum:item.shareNum}}</text> -->
            </div>
            <div @click="getMore(item)" class="more">
              <image class="img image-view" :src='imgUrl+"more.png"' ></image>
              <text style="font-size:21px;">更多</text>
            </div>
            <!-- <div v-if="activeType" class="joinNum">
              <text class="font-22 join-text">想参加{{item.joinNum?item.joinNum:item.resData.joinNum}}人</text>
            </div> -->
          </div>
          <text v-if="card" @click="openMask(item)" class="notice font-24">你有一张票券,点击查看</text>
        </div>
    </div>
    <!-- 更多 -->
    <div v-if="key" class="sliderList">
      <wxc-popup popup-color="#fff"
                :show="key"
                @wxcPopupOverlayClicked="toggle"
                pos="bottom"
                :height="(isType !== ''&&iMobile === mobile)?454:227"
                width="750">
        <div class="demo-content">
            <div class="botMoreOpt col" ref="botMoreOptBg" >
                <div class="optItems col">
                    <text v-if="isType !== ''&&iMobile === mobile" @click="_delete()" class="optDesc">删除</text>
                    <text v-if="isType !== ''&&iMobile === mobile" @click="push2('/views/release/releaseContentRevise',{resId:resId})" class="optDesc">编辑</text>
                    <text v-if="iMobile !== mobile" @click="report()" class="optDesc">举报</text>
                </div>
                <text class="optDesc" @click="toggle()">取消</text>
            </div>
        </div>
      </wxc-popup>
    </div>
    <!-- 卡券二维码 -->
    <wxc-mask height="602"
            width="602"
            border-radius="0"
            duration="200"
            mask-bg-color="#FFFFFF"
            :has-animation="hasAnimation"
            :has-overlay="true"
            :show-close="true"
            :show="codeKey"
            @wxcMaskSetHidden="wxcMaskSetHidden">
      <image class="codeImg" :src="codeSrc"></image>
    </wxc-mask>
  </div>
</template>
<script>
import myDashed from "../../components/myDashed.vue";
import mixins from "../../mixins";
import { deleteActivity } from "../../api/activity";
import { WxcMask, WxcPopup } from "weex-ui";
import qrcode from "../../utils/qrcode";
import { putThumb, deleteThumb, putReport } from "../../api/club";
import { toLogin, sharePage } from "../../api/weex";
const modal = weex.requireModule("modal");
export default {
  mixins: [mixins],
  components: { myDashed, WxcMask, WxcPopup },
  props: {
    iStyle: {},
    activityData: {},
    card: {},
    isType: {}
  },
  data() {
    return {
      codeKey: false,
      hasAnimation: true,
      codeSrc: "",

      iMobile: "",
      resId: "",
      key: false,
      deletMobile: "",
      reportData: ""
    };
  },
  created() {
    this.fontIcon();
    console.log(this.activityData);
  },
  methods: {
    toggle() {
      this.key = !this.key;
    },
    show(item) {
      console.log(item);
      this.key = true;
      this.iMobile = item.resData ? item.resData.mobile : item.feedData.mobile;
      this.resId = item.resId;
    },
    _delete() {
      modal.confirm(
        {
          message: "确定删除?",
          okTitle: "确认",
          cancelTitle: "取消"
        },
        value => {
          if (value == "确认") {
            this.isShow = true;
            deleteActivity(
              {
                resId: this.resId,
                mobile: this.mobile
              },
              { token: this.mobile }
            )
              .then(res => {
                this.isShow = false;
                if (res.status == 0) {
                  this.activityData.forEach((value, index, array) => {
                    if (value.resId == this.resId) {
                      this.toggle();
                      array.splice(index, 1);
                      modal.toast({
                        message: "删除成功!",
                        duration: 1
                      });
                    }
                  });
                  this.key = false;
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
      );
    },
    // 举报(出现问题，需要解决)
    report() {
      modal.prompt(
        {
          message: "举报",
          okTitle: "确定",
          cancelTitle: "取消",
          duration: 1
        },
        value => {
          this.reportData = value.data;
          putReport(
            {
              mobile: this.mobile,
              toUsercode: "myyule_service",
              reason: this.reportData,
              url: this.commonUrl + "/activityDetail?resId=" + this.resId
            },
            { token: this.mobile }
          )
            .then(res => {
              if (res.status == 0) {
                modal.toast({
                  message: "举报成功",
                  duration: 1
                });
                this.toggle();
              } else {
                console.log(res.desc);
              }
            })
            .catch();
        }
      );
    },
    activeState(item) {
      let itime = new Date();
      let stime = new Date(item.starttime.replace(new RegExp(/-/gm), "/"));
      let etime = new Date(item.endtime.replace(new RegExp(/-/gm), "/"));
      console.log(Number(stime));
      if (Number(stime) > Number(itime)) {
        return "即将开始";
      } else if (Number(itime) > Number(etime)) {
        return "已结束";
      } else {
        return "进行中";
      }
    },
    noticeTime(date) {
      let itime = new Date().getTime();
      let etime = new Date(date.replace(new RegExp(/-/gm), "/")).getTime();
      var total = (itime - etime) / 1000;

      var day = parseInt(total / (24 * 60 * 60)); //计算整数天数
      var afterDay = total - day * 24 * 60 * 60; //取得算出天数后剩余的秒数
      var hour = parseInt(afterDay / (60 * 60)); //计算整数小时数

      return Math.abs(day) + "天" + Math.abs(hour) + "小时前";
    },
    // 打开二维码
    openMask(item) {
      // 站外分享点击事件处理
      this.shareEvent();
      console.log(this.codeKey);
      this.codeKey = true;
      this.hasAnimation = true;
      this.createQRCode(
        "http://testmyyule.teamshub.com/myyuleWeb/index.html?mobile=" +
          this.mobile +
          "&signType=" +
          (item.mobile == this.mobile ? "host" : "guest") +
          "&resId=" +
          item.resId
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
    wxcMaskSetHidden() {
      this.codeKey = false;
    },

    // 点赞
    thumb(item) {
      // 站外分享点击事件处理
      this.shareEvent();
      const _this = this;
      if (!this.mobile || this.mobile === "") {
        modal.toast({ message: "请登入", duration: 1 });
        toLogin({ loginOut: "0" });
        return;
      } else if ((item.resData ? item.resData.isThumb : item.isThumb) == 1) {
        // 取消点赞
        modal.confirm(
          {
            message: "确定取消点赞么 ?",
            okTitle: "确定",
            cancelTitle: "取消",
            duration: 0.3
          },
          function(value) {
            if (value === "确定") {
              deleteThumb(
                {
                  mobile: _this.mobile,
                  resType: "activity",
                  resId: item.resId
                },
                { token: _this.mobile }
              )
                .then(res => {
                  if (res.status == 0) {
                    item.resData ? item.resData.thumbNum : (item.thumbNum -= 1);
                    item.resData ? item.resData.isThumb : (item.isThumb = "0");
                  } else {
                    modal.toast({ message: res.desc, duration: 1 });
                  }
                })
                .catch(err => {});
            }
          }
        );
      } else {
        // 点赞
        if (!this.isShow) {
          this.isShow = true;
          putThumb(
            {
              mobile: this.mobile,
              resType: "activity",
              resId: item.resId
            },
            { token: this.mobile }
          )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                item.resData ? item.resData.thumbNum : (item.thumbNum += 1);
                item.resData ? item.resData.isThumb : (item.isThumb = "1");
              } else {
                modal.toast({ message: res.desc, duration: 1 });
              }
            })
            .catch(err => {});
        }
      }
    },
    getMore(item) {
      // 站外分享点击事件处理
      this.shareEvent();
      this.show(item);
    },
    //分享
    share(item) {
      // 站外分享点击事件处理
      const _this = this;
      this.shareEvent();
      let sObj = {
        title: "分享活动：" + item.title,
        desc: item.content,
        web_url:
          _this.commonUrl +
          "myyuleWeb/webShare/activity/index.html?resId=" +
          item.resId,
        img_url: item.logo,
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
/*图标*/
.iconfont {
  font-family: iconfont;
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
  font-size: 26px;
}
.clubActivity-item {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 20px;
  margin-right: 20px;
  box-shadow: 3px 5px 5px 5px #d9d9d9;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background-color: #fff;
  overflow: hidden;
  height: 840px;
}
.user-info {
  flex-direction: row;
  justify-content: space-between;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
.left {
  flex-direction: row;
}
.pic {
  width: 90px;
  height: 90px;
  background-color: #d9d9d9;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  overflow: hidden;
}
.img-vip {
  width: 90px;
  height: 90px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}
.codeImg {
  width: 602px;
  height: 602px;
}
.info {
  padding-left: 10px;
}
.info-text {
  line-height: 28px;
  padding-top: 10px;
}
.activity-banner {
  position: relative;
  height: 380px;
  background-color: #d9d9d9;
  overflow: hidden;
  /* border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px; */
}
.img-bg {
  position: absolute;
  width: 710px;
  height: 380px;
  top: 0;
  left: 0;
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
.static-text {
  font-size: 26px;
}
.activity-content {
  padding-top: 40px;
  padding-left: 20px;
  padding-right: 20px;
  overflow: hidden;
}
.content-1,
.content-2,
.content-3 {
  padding-bottom: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.adress,
.time,
.feeType {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.icon-img {
  width: 44px;
  height: 44px;
}
.feeType-text {
  line-height: 40px;
  font-size: 22px;
  color: #828282;
  padding-left: 10px;
}
.notice {
  color: #ee1c41;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
}
.title-text {
  max-width: 330px;
  lines: 1;
}
.type {
  margin-left: 22px;
  height: 35px;
  border-width: 2px;
  border-style: solid;
  border-color: #ee1c41;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
}
.activity-title {
  flex-direction: row;
  align-items: center;
  padding-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
}
/* 底部bar */

.tip-list {
  padding-top: 20px;
  padding-bottom: 20px;
  flex-direction: row;
  justify-content: flex-end;
}
.thumb,
.comment,
.share,
.more {
  width: 122px;
  height: 58px;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 23px;
  margin-right: 23px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(236, 236, 236, 1);
}
.icon-text {
  padding-right: 10px;
  font-size: 22px;
  color: #828282;
  line-height: 44px;
}
.joinNum {
  width: 250px;
  height: 58px;
  background-color: #ee1c41;
}
.join-text {
  text-align: center;
  color: #fff;
  line-height: 58px;
  letter-spacing: 3px;
}
.img {
  width: 44px;
  height: 44px;
}
</style>
