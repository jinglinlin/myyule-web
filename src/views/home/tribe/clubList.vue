<template>
      <cell @click="push2('/views/club/club_layout',{clubId:item.clubId})" class="club-item">
        <div class="left">
          <div class="user-img">
            <image class="img" :src="item.clubLogo?'http://media2.myyule.cn/'+item.clubLogo:''" alt="" width="120" height="120"></image>
          </div>
          <div class="user-info">
            <text lines="1" class="title">{{item.clubName}}</text>
            <div style="flex-direction:row;padding-bottom: 18px;">
              <text class="font-26 color-gray" style="padding-right:30px">人气{{item.clubMemberNum}}</text>
              <text class="font-26 color-gray">话题{{item.topicNum}}</text>
            </div>
            <text class="font-24 desc">{{item.clubDesc}}</text>
          </div>
        </div>
        <wxc-loading :show="isShow" :need-mask="true"></wxc-loading>
        <div v-if="item.clubRelation"  class="follow"><text class="follow-text">已加入</text></div>
        <div v-if="!item.clubRelation" @click="joinClub(item)"  class="follow2"><text class="follow2-text">+ 加入</text></div>
    </cell>
</template>
<script>
import { WxcLoading } from "weex-ui";
import { putClubMember } from "../../../api/club";
import { toLogin, startNewWebView } from "../../../api/weex";
import mixins from "../../../mixins";
var modal = weex.requireModule("modal");
var storage = weex.requireModule("storage");
export default {
  mixins: [mixins],
  props: {
    item: {}
  },
  data() {
    return {
      clubTags: [],
      isShow: false
    };
  },
  components: {
    WxcLoading
  },
  created() {
  },
  methods: {
    // 加入部落
    joinClub(item) {
      if (this.mobile) {
        if (!this.isShow) {
          this.isShow = true;
          putClubMember(
            {
              clubId: item.clubId,
              mobile: this.mobile
            },
            { token: this.mobile }
          )
            .then(res => {
              this.isShow = false;
              if (res.status == 0) {
                item.clubRelation = 1;
                modal.alert({
                  message: "加入部落成功!",
                  duration: 1
                });
              } else {
                console.log(res.desc);
                modal.toast({
                  message: res.desc,
                  duartion: 1
                });
              }
            })
            .catch(err => {});
        }
      } else {
        modal.toast({
          message: "请登录!",
          duration: 1
        });
        toLogin({ loginOut: "0" });
      }
    }
  }
};
</script>
<style scoped>
.iconfont {
  font-family: iconfont;
}
.font-26 {
  font-size: 26;
  line-height: 26px;
  color: #828282;
}
.font-24 {
  font-size: 24;
  line-height: 24px;
  color: #828282;
}
/* 部落 */
.club-item {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 47px;
  padding-bottom: 47px;
  padding-left: 23px;
  padding-right: 23px;
  align-items: center;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #ececee;
}
.left {
  flex-direction: row;
  justify-content: space-around;
}
.user-info{
  width: 400px;
}
.user-img {
  position: relative;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 20px;
  margin-right: 20px;
  width: 120px;
  height: 120px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  background-color: #d9d9d9;
}
.img-vip {
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}
.img {
  width: 120px;
  height: 120px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}
.title {
  lines: 1;
  text-overflow: ellipsis;
  font-size: 28px;
  color: #000;
  margin-bottom: 18px;
}
.desc {
  lines: 1;
  height: 24px;
  text-overflow: ellipsis;
  margin-bottom: 18px;
  color: #828282;
}
.follow {
  width: 110px;
  height: 60px;
  background-color: #ee1c41;
  border-width: 2px;
  border-style: solid;
  border-color: #ee1c41;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.follow2 {
  width: 110px;
  height: 60px;
  background-color: #fff;
  border-width: 2px;
  border-style: solid;
  border-color: #ee1c41;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.follow-text {
  font-size: 26px;
  text-align: center;
  line-height: 60px;
  color: #fff;
}
.follow2-text {
  font-size: 26px;
  text-align: center;
  line-height: 60px;
  color: #ee1c41;
}
</style>
