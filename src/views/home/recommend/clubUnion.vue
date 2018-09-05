<template>
    <div class="clubUnion">
        <wxc-loading :show="isShow"></wxc-loading>
        <div class="m-list">
            <div class="m-cont mgRt" @click="push2('/views/club/club_layout',{clubId:item.clubId})" v-for="(item,index) in clubUnion" :key="index">
                <image class="m-img" :src="'http://media2.myyule.cn/'+item.clubLogo" placeholder="http://www.myyule.com/images/music/photo192.jpg"></image>
                <text lines="1" class="m-title">{{item.clubName}}</text>
                <!-- <text class="m-introduce">人气{{item.clubMemberNum}}</text> -->
                <text v-if="!item.clubRelation" @click="joinClub(item)" class="m-button">+ 加入</text>
                <text v-if="item.clubRelation" class="m-button2">已加入</text>
            </div>
        </div>
    </div>
</template>

<script>
import { WxcLoading } from "weex-ui";
import {
  putClubMember
} from "../../../api/club";
import { toLogin } from "../../../api/weex";
import { startNewWebView } from "../../../api/weex";
import mixins from "../../../mixins";
var modal = weex.requireModule("modal");
var storage = weex.requireModule("storage");

export default {
  mixins: [mixins],
  props: {
    clubUnion: {},
  },
  data() {
    return {
      isShow: false
    };
  },
  mounted() {
  },
  components: {
    WxcLoading
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
              if (res.status == 0) {
                this.isShow = false;
                item.clubRelation = 1;
                modal.toast({
                  message: "加入部落成功!",
                  duration: 1
                });
              } else {
                this.isShow = false;
                modal.toast({
                  message: res.desc,
                  duration: 1
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
/*图标*/
.iconfont {
  font-family: iconfont;
}
.clubUnion {
  background-color: #fff;
}
/*音乐人列表*/
.m-list {
  flex-direction: row;
  padding-left: 12px;
  padding-right: 12px;
  margin-bottom: 32px;
  justify-content: space-between;
}
.m-cont {
  width: 180px;
  align-items: center;
}
.m-img {
  width: 120px;
  height: 120px;
  border-radius: 100px;
  margin-bottom: 15px;
}
.m-title {
  lines: 1;
  font-size: 26px;
  color: #000;
  text-align: center;
  margin-bottom: 12px;
  text-overflow: ellipsis;
}
.m-introduce {
  font-size: 22px;
  color: #757575;
  margin-bottom: 20px;
  text-align: center;
  height:22px;
  line-height: 22px;
}
.m-button {
  width: 120px;
  height: 50px;
  color: #ee1c41;
  font-size: 22px;
  border-style: solid;
  border-width: 1px;
  border-top-color: #ee1c41;
  border-bottom-color: #ee1c41;
  border-right-color: #ee1c41;
  border-left-color: #ee1c41;
  border-radius: 10px;
  text-align: center;
  line-height: 50px;
}
.m-button2 {
  width: 120px;
  height: 50px;
  color: #fff;
  font-size: 22px;
  background-color: #ee1c41;
  border-style: solid;
  border-width: 1px;
  border-top-color: #ee1c41;
  border-bottom-color: #ee1c41;
  border-right-color: #ee1c41;
  border-left-color: #ee1c41;
  border-radius: 10px;
  text-align: center;
  line-height: 50px;
}
</style>