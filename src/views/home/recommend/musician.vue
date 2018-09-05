<template>
    <div class="musician">
        <wxc-loading :show="isShow"></wxc-loading>
        <div class="h-title">
            <!-- <text class="h-txt">{{musicianTitle}}</text> -->
            <text class="h-txt">幕后音乐英雄</text>
            <text @click="push2('/views/home/lookMore/musicianList',{schoolType:0})" class="iconfont h-icon">更多&#xe656;</text>
        </div>
        <scroller class="scroller slider" @scroll="scrollHandler" scroll-direction="horizontal" show-scrollbar=false>
          <div class="frame" v-for="(musicianItem,index) in musician" :key="index">
              <div class="m-cont" @click="push2('/views/myPlace/myPlace',{mobile:item.mobile})" v-for="(item,index) in musicianItem" :key="index">
                <image class="m-img" :src="'http://media2.myyule.cn/'+item.icon" placeholder="http://www.myyule.com/images/head-02.jpg"></image>
                <div class="msg">
                  <text lines="1" class="m-title">{{item.nickname}}</text>
                  <text class="m-introduce">{{musicianType[item.certification]?musicianType[item.certification]:''}}</text>
                </div>
                <text v-if="!item.userRelation" @click="follow(item)" class="m-button">+ 关注</text>
                <text v-if="item.userRelation" @click="unFollow(item)" class="m-button2">已关注</text>
            </div>
          </div>
        </scroller>
    </div>
</template>

<script>
import { WxcLoading } from "weex-ui";
import {
  putUserFollow,
  deleteUserFollow
} from "../../../api/club";
import { toLogin } from "../../../api/weex";
import { startNewWebView } from "../../../api/weex";
import mixins from "../../../mixins";
var modal = weex.requireModule("modal");
var storage = weex.requireModule("storage");

export default {
  mixins: [mixins],
  props: {
    musician: {}
  },
  data() {
    return {
      musicianTitle:'幕后音乐英雄',
      isShow: false,
      musicianType: [
        "",
        "歌手",
        "作词",
        "作曲",
        "制作人",
        "经纪人",
        "音乐公司",
        "乐队组合",
        "编曲",
        "键盘",
        "吉他手",
        "贝斯手",
        "鼓手",
        "录音师",
        "乐手"
      ]
    };
  },
  mounted() {
  },
  components: {
    WxcLoading
  },
  methods: {
    // 关注
    follow(item) {
      if (this.mobile) {
        if (!this.isShow) {
          this.isShow = true;
          putUserFollow(
            {
              mobile: this.mobile,
              toMobile: item.mobile
            },
            { token: this.mobile }
          )
            .then(res => {
              if (res.status == 0) {
                this.isShow = false;
                item.userRelation = 1;
                modal.toast({
                  message: "关注成功!",
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
          message: "请登录",
          duration: 1
        });
        toLogin({ loginOut: "0" });
      }
    },
    // 取消关注
    unFollow(item) {
      const _this = this;
      console.log(item);
      modal.confirm(
        {
          message: "确定取消关注么 ?",
          okTitle: "确定",
          cancelTitle: "取消",
          duration: 0.3
        },
        function(value) {
          if (value === "确定") {
            _this.isShow = true;
            deleteUserFollow(
              {
                mobile: _this.mobile,
                toMobile: item.mobile
              },
              { token: _this.mobile }
            )
              .then(res => {
                if (res.status == 0) {
                  _this.isShow = false;
                  item.userRelation = 0;
                  modal.toast({
                    message: "取消成功!!",
                    duration: 1
                  });
                } else {
                  _this.isShow = false;
                  modal.toast({
                    message: res.desc,
                    duration: 1
                  });
                }
              })
              .catch(err => {});
          }
        }
      );
    },
    // 滑动
    scrollHandler(e){
      if(e.contentOffset.x>-350){
      // this.musicianTitle=e.contentOffset.x
        this.musicianTitle='幕后音乐英雄'
        this.schoolType = 0
      }else if (-350>e.contentOffset.x&&e.contentOffset.x>-1030){
        this.musicianTitle='校园里音乐人'
        this.schoolType = 1
      }else if (-1030>e.contentOffset.x&&e.contentOffset.x>-1710){
        this.musicianTitle='校园外音乐人'
        this.schoolType = 2
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
.musician {
  background-color: #fff;
}
/*标题与更多*/
.h-title {
  flex-direction: row;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 15px;
}
.h-txt {
  color: #000;
  font-size: 32px;
  margin-top: 18px;
  margin-bottom: 19px;
}
.h-icon {
  font-size: 28px;
  color: #666;
  margin-top: 14px;
}
/*音乐人列表*/
.slider {
  flex-direction: row;
  height:410px;
}

.frame {
  width: 680px;
  position: relative;
  padding-left:30px;
  padding-right:50px;
}
.m-cont {
  height:100px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}
.m-img {
  width: 82px;
  height: 82px;
  border-radius: 100px;
}
.msg{
  width:250px;
  justify-content: flex-start;
}
.m-title {
  lines: 1;
  font-size: 26px;
  color: #000;
  margin-bottom:16px;
  text-overflow: ellipsis;
}
.m-introduce {
  lines: 1;
  font-size: 22px;
  color: #757575;
  text-overflow: ellipsis;
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