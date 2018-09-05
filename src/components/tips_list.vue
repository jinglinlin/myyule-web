<template>
  <div class="tip-list" ref="tip">
    <div @click="push2('/views/activity/active_layout/activityComment',{resId:item.resId,mobile:item.mobile})" class="comment">
      <image class="img image-view" :src='imgUrl+"comment.png"' ></image>
      <text class="icon-text">{{item.commentNum?item.commentNum:item.resData.commentNum}}</text>
    </div>
    <div @click="thumb(item)" class="thumb">
      <image class="img image-view" :src='imgUrl+(item.isThumb?item.isThumb:item.resData.isThumb==1?"thumbNumActive.png":"thumbNum.png")' ></image>
      <text class="icon-text">{{item.thumbNum?item.thumbNum:item.resData.thumbNum}}</text>
    </div>
    <div v-if="!activeType" @click="share" class="share">
      <image class="img image-view" :src='imgUrl+"min-share.png"' ></image>
      <text class="icon-text">{{item.shareNum?item.shareNum:item.resData.shareNum}}</text>
    </div>
    <div v-if="!activeType" @click="getMore()" class="more">
      <image class="img image-view" :src='imgUrl+"more.png"' ></image>
      <text style="font-size:21px;">更多</text>
    </div>
    <div v-if="activeType" class="joinNum">
      <text class="font-22 join-text">想参加{{item.joinNum?item.joinNum:item.resData.joinNum}}人</text>
    </div>
    <slider-list ref="sliderList" :iMobile="item.user.mobile" :resId="item.resId" @delet-mobile="onDeletMobile"></slider-list>
  </div>
</template>
<script>
import mixins from "../mixins";
import { putThumb, deleteThumb } from "../api/club";
import sliderList from "./sliderList.vue";
import {toLogin,sharePage} from '../api/weex';
const modal = weex.requireModule("modal");
export default {
  mixins: [mixins],
  components: { sliderList },
  props: {
    item: {},
    activeType: false,
    notice: false
  },
  data() {
    return {};
  },
  mounted() {
    this.isShow = false;
  },
  methods: {
    // 点赞
    thumb(item) {
      const _this = this;
      if (!this.mobile || this.mobile === "") {
        modal.toast({ message: "请登入", duration: 1 });
        toLogin();
      } else if (item.isThumb?item.isThumb:item.resData.isThumb == 1) {
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
                  resId: _this.item.resId
                },
                { token: _this.mobile }
              )
                .then(res => {
                  if (res.status == 0) {
                    item.thumbNum?item.thumbNum:item.resData.thumbNum -= 1;
                    item.isThumb?item.isThumb:item.resData.isThumb = "0";
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
              resId: this.item.resId
            },
            { token: this.mobile }
          )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                item.thumbNum?item.thumbNum:item.resData.thumbNum += 1;
                item.isThumb?item.isThumb:item.resData.isThumb = "1";
              } else {
                modal.toast({ message: res.desc, duration: 1 });
              }
            })
            .catch(err => {});
        }
      }
    },
    getMore() {
      this.$refs.sliderList.toggle();
    },
    onDeletMobile(data) {
      console.log(data);
      this.$emit("deletMobile", data);
    },
    //分享
    share() {
  	  let _this= this;
  	  let sObj = {
  		title:"分享活动："+_this.item.title?_this.item.title:_this.item.resData.title,
  		desc: "活动地址"+_this.item.address?_this.item.address:_this.item.resData.address,
  		web_url: "http://www.myyule.com/app/down",
  		img_url: _this.item.logo?_this.item.logo:_this.item.resData.logo,
  		sourse:""
  	  };
  	  sharePage(sObj)
    }
  }
};
</script>
<style src="../assets/style/index.scss">

</style>
<style scoped>
.tip-list {
  padding-top: 20px;
  flex-direction: row;
  justify-content: flex-end;
}
.thumb,
.comment,
.share,
.more {
  width:122px;
  height: 58px;
  margin-top:0;
  margin-bottom:0;
  margin-left:23px;
  margin-right:23px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(236,236,236,1);
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
