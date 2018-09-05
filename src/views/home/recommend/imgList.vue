<template>
    <div class="hot">
        <div class="h-title">
            <text class="h-txt">{{title?title:'原创首发推荐'}}</text>
            <text @click="title?push2('/views/home/lookMore/newPutawayList',''):push('/views/home/lookMore/newPutawayList','')" class="iconfont h-icon">更多&#xe656;</text>
        </div>
        <scroller  class="scroller h-list" scroll-direction="horizontal" show-scrollbar=false>
            <div @click="play(item)" class="imgWarp" v-for="(item,index) in musicList" :key="index">
                <div class="imgCont">
                    <image class="image" resize="cover" :src="'http://media2.myyule.cn/'+item.logo" placeholder="http://www.myyule.com/images/musicSmall.jpg"></image>
                    <div class="img-bottom">
                    <text class="iconfont number">&#xe678; {{item.playSum}}</text>
                    <text class="iconfont number">{{!item.userId?'&#xe629;':'&#xe626;'}}</text>
                    </div>
                </div>
                <text lines="1" class="h-title0">{{item.title}}</text>
                <text lines="1" class="h-time">{{item.songer}}</text>
            </div>
        </scroller>
    </div>
</template>

<script>
import mixins from "../../../mixins";
import { playDailySong, stopMusic,startNewWEeexView } from "../../../api/weex";
const modal = weex.requireModule("modal");
export default {
  mixins: [mixins],
  mounted() {
    console.log(this.musicList);
  },
  props: {
    musicList: {},
    title: {}
  },
  data() {
    return {};
  },
  methods: {
    play(item) {
      if (item.userId) {
        playDailySong([item]);
        this.musicList.forEach(value => {
          value.userId = true;
        });
        // item.userId = false;
      } else {
        stopMusic();
        item.userId = true;
      }
    }
  }
};
</script>

<style scoped>
.iconfont {
  font-family: iconfont;
}
/*标题与更多*/
.h-title {
  flex-direction: row;
  justify-content: space-between;
  /*padding-left: 20px;*/
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
/*图片列表*/
.h-list {
  height: 280px;
  margin-top: 19px;
  /*margin-left: 20px;*/
  margin-bottom: 28px;
  flex-direction: row;
}
.imgWarp {
  margin-right: 4px;
}
.imgCont {
  width: 194px;
  height: 194px;
  position: relative;
  margin-bottom: 15px;
}
.image {
  width: 194px;
  height: 194px;
}
.img-bottom {
  position: absolute;
  width: 194px;
  top: 146px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.number {
  text-align: center;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 8px;
  padding-right: 8px;
  margin-bottom: 20px;
  font-size: 22px;
  color: #fff;
}
.h-title0 {
  lines: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 194px;
  color: #3b3b3b;
  font-size: 24px;
  margin-bottom: 10px;
  text-align: left;
}
.h-time {
  lines: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 194px;
  font-size: 22px;
  color: #666;
}
</style>