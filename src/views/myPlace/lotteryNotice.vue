<template>
  <div class="lotteryNotice">
    <div v-for="(item,index) in activityData" :key="index" class="clubActivity-item" @click="toNotic(item)">
      <activity-noitce v-if="item.resType=='activity'&&isType !=='topic'" :item="item.resData?item.resData:item"></activity-noitce>
      <topic-noitce v-if="item.resType=='topic'||isType=='topic'" :item="item.resData?item.resData:item"></topic-noitce>
      <myDashed></myDashed>
      <!-- 底部bar -->
      <div v-if="!card" class="tip-list" ref="tip">
        <div v-if="item.resType=='activity'&&isType !=='topic'" @click="push2('/views/activity/active_layout/active_detail',{resId:item.resId})" class="comment">
          <image class="img image-view" :src='imgUrl+"comment.png"' ></image>
          <text class="icon-text">{{item.resData?item.resData.commentNum:item.commentNum}}</text>
        </div>
        <div v-if="item.resType=='topic'||isType=='topic'" @click="push2('/views/topic/topic_detail',{resId:item.resId})" class="comment">
          <image class="img image-view" :src='imgUrl+"comment.png"' ></image>
          <text class="icon-text">{{item.resData?item.resData.commentNum:item.commentNum}}</text>
        </div>
        <div @click="thumb(item)" class="thumb">
          <image class="img image-view" :src='imgUrl+(((item.resData?item.resData.isThumb:item.isThumb)==1)?"thumbNumActive.png":"thumbNum.png")' ></image>
          <text class="icon-text">{{item.resData?item.resData.thumbNum:item.thumbNum}}</text>
        </div>
        <div @click="share(item)" class="share">
          <image class="img image-view" :src='imgUrl+"min-share.png"' ></image>
          <!-- <text class="icon-text">{{item.shareNum?item.shareNum:item.resData.shareNum}}</text> -->
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
    <!-- 更多 -->
    <div v-if="key" class="sliderList">
      <wxc-popup popup-color="#fff"
                :show="key"
                @wxcPopupOverlayClicked="toggle"
                pos="bottom"
                :height="(isType !== ''&&iMobile === mobile)?342:227"
                width="750">
        <div class="demo-content">
            <div class="botMoreOpt col" ref="botMoreOptBg" >
                <div class="optItems col">
                    <text v-if="isType !== ''&&iMobile === mobile" @click="_delete()" class="optDesc">删除</text>
                    <text v-if="isType !== ''&&iMobile === mobile" @click="edit()" class="optDesc">编辑</text>
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
    <wxc-loading :show="isShow" :need-mask="true" loading-text="加载中"></wxc-loading>
  </div>
</template>
<script>
import myDashed from "../../components/myDashed.vue";
import mixins from "../../mixins";
import { deleteActivity } from "../../api/activity";
import { deleteTopic } from "../../api/topic";
import { WxcMask, WxcPopup } from "weex-ui";
import qrcode from "../../utils/qrcode";
import { putThumb, deleteThumb, putReport } from "../../api/club";
import { toLogin, sharePage } from "../../api/weex";
import activityNoitce from "./activityNoitce.vue";
import topicNoitce from "./topicNoitce.vue";
const modal = weex.requireModule("modal");
export default {
  mixins: [mixins],
  components: { myDashed, WxcMask, WxcPopup, activityNoitce, topicNoitce },
  props: {
    activityData: {},
    card: {},
    isType: {}
  },
  data() {
    return {
      codeKey: false,
      hasAnimation: true,
      codeSrc: "",
      item: [],
      iMobile: "",
      resId: "",
      key: false,
      deletMobile: "",
      reportData: ""
    };
  },
  created() {
    this.fontIcon();
  },
  methods: {
    // 跳转
    toNotic(item) {
      if (item.resType == "activity" && this.isType !== "topic") {
        this.push2("/views/activity/active_layout/active_detail", {
          resId: item.resId
        });
      } else {
        this.push2("/views/topic/topic_detail", { resId: item.resId });
      }
    },
    toggle() {
      this.key = !this.key;
    },
    show(item) {
      this.key = true;
      this.iMobile = item.resData.mobile;
      this.resId = item.resId;
      this.item = item;
    },
    // 编辑活动
    edit() {
      if (this.item.resType == "activity" && this.isType !== "topic") {
        if (this.activeState(this.item) === "已结束") {
          modal.alert({ message: "活动已经结束无法进行修改！" });
        } else if (this.activeState(this.item) === "进行中") {
          modal.alert({ message: "活动进行中无法进行修改！" });
        } else {
          this.push2("/views/release/releaseContentRevise", {
            resId: this.resId
          });
        }
      } else {
        this.push2("/views/topic/editTopic", {
          resId: this.resId
        });
      }
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
            if (this.item.resType == "activity" && this.isType !== "topic") {
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
            } else {
              deleteTopic(
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
              url:
                this.commonUrl + "/" + this.item.resType == "topic"
                  ? "activityDetail"
                  : "topic_detail" + "?resId=" + this.resId
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
      let stime = new Date(
        (item.resData ? item.resData.starttime : item.starttime).replace(
          new RegExp(/-/gm),
          "/"
        )
      );
      let etime = new Date(
        (item.resData ? item.resData.endtime : item.endtime).replace(
          new RegExp(/-/gm),
          "/"
        )
      );
      if (Number(stime) > Number(itime)) {
        return "即将开始";
      } else if (Number(itime) > Number(etime)) {
        return "已结束";
      } else {
        return "进行中";
      }
    },
    // 打开二维码
    openMask(item) {
      // 站外分享点击事件处理
      this.shareEvent();
      this.codeKey = true;
      this.hasAnimation = true;
      // modal.alert({message:'http://testmyyule.teamshub.com/myyuleWeb/index.html?mobile='+this.mobile+'&signType='+(item.mobile==this.mobile?'host':'guest')+'&resId='+item.resId})
      this.createQRCode(
        this.commonUrl +
          "myyuleWeb/index.html?mobile=" +
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
        console.log(this.codeSrc)
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
                  resType: item.resType,
                  resId: item.resId
                },
                { token: _this.mobile }
              )
                .then(res => {
                  if (res.status == 0) {
                    item.resData
                      ? (item.resData.thumbNum -= 1)
                      : (item.thumbNum -= 1);
                    item.resData
                      ? (item.resData.isThumb = 0)
                      : (item.thumbNum = 0);
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
              resType: item.resType,
              resId: item.resId
            },
            { token: this.mobile }
          )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                item.resData
                  ? (item.resData.thumbNum += 1)
                  : (item.thumbNum += 1);
                item.resData ? (item.resData.isThumb = 1) : (item.thumbNum = 1);
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
      this.shareEvent();
      const _this = this;
      if (_this.isType === "topic" || item.resType === "topic") {
        let userIcon = item.resData ? item.resData.user.icon : item.user.icon;
        let sObj = {
          title:
            "分享话题：" + item.resData
              ? item.resData.topicTags[0]
              : item.topicTags[0],
          desc: item.resData ? item.resData.content : item.content,
          web_url:
            _this.commonUrl +
            "myyuleWeb/webShare/topic/index.html?resId=" +
            item.resId,
          img_url: "http://media2.myyule.cn/" + userIcon,
          sourse: "myyule"
        };
        sharePage(sObj);
      } else {
        let sObj = {
          title: "分享活动：" + item.resData.title,
          desc: item.resData.content,
          web_url:
            _this.commonUrl +
            "myyuleWeb/webShare/activity/index.html?resId=" +
            item.resId,
          img_url: "http://media2.myyule.cn/" + item.resData.logo,
          sourse: "myyule"
        };
        sharePage(sObj);
      }
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
}
.left {
  flex-direction: row;
}
.codeImg {
  width: 602px;
  height: 602px;
}
.notice {
  color: #ee1c41;
  text-align: center;
  padding-top: 40px;
  padding-bottom: 20px;
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
