<template>
  <div class="clubMusic">
    <div @click="play(item)" v-for="(item,index) in resData" :key="index" class="clubMusic-item">
      <div class="music-img">
        <image v-if="!item.feedData" class="music-img" resize="cover" :src="'http://media2.myyule.cn/'+item.logo" placeholder="http://media2.myyule.cn/group1/M00/0D/1C/wKgB2ltYOj-AGj5hAACM-0yh7-U134.jpg"></image>
        <image v-if="item.feedData" resize="cover" class="music-img" :src="'http://media2.myyule.cn/'+item.feedData.logo" placeholder="http://media2.myyule.cn/group1/M00/0D/1C/wKgB2ltYOj-AGj5hAACM-0yh7-U134.jpg"></image>
        <div class="bottom">
          <div class="music-num">
            <image class="img" :src="imgUrl+'listen.png'" ></image>
            <text class="font-18 music-text">{{item.playSum}}</text>
            <text v-if="item.feedData" class="font-18 music-text">{{item.feedData.playSum}}</text>
          </div>
          <image class="img" :src="imgUrl+'play.png'" ></image>
        </div>
      </div>
      <text lines="1" class="title font-26">{{item.title}}</text>
      <text lines="1" class="nickname font-22 color-gray">{{item.songer}}</text>
      <text v-if="item.feedData" lines="1" class="title font-26">{{item.feedData.title}}</text>
      <text v-if="item.feedData" lines="1" class="nickname font-22 color-gray">{{item.feedData.songer}}</text>
    </div>
  </div>
</template>
<script>
import mixins from "../../mixins";
import { playDailySong, openPlayer } from "../../api/weex";
import { getClub_Music } from "../../api/club";
export default {
  mixins: [mixins],
  props: {
    resData: {}
  },
  methods: {
    play(item) {
      // 站外分享点击事件处理
      this.shareEvent();
      if(item.feedData){
        item.feedData.createTime = item.createTime;
        item.feedData.resId = item.resId;
        item.feedData.resType = item.resType;
        item.feedData.userId = item.userId;
        console.log(item.feedData)
        playDailySong([item.feedData]);
      }else{
        playDailySong([item]);
      }
      openPlayer("player");
    }
  }
};
</script>
<style src="../../assets/style/index.scss">
</style>
<style scoped>
.clubMusic {
  width: 750px;
  position: relative;
  margin-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  flex-direction: row;
  flex-wrap: wrap;
}
.clubMusic-item {
  width: 230px;
  padding-bottom: 20px;
  /* height: 320px; */
  margin-left: 3px;
  margin-right: 3px;
}
.music-img {
  position: relative;
  width: 230px;
  height: 230px;
  background-color: #989898;
}
.bottom {
  position: absolute;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 14px;
  padding-right: 14px;
  background-color: transparent;
  align-items: center;
  bottom: 20px;
  width: 230px;
  left: 0;
}
.music-num {
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  color: #fff;
}
.img {
  width: 44px;
  height: 44px;
}
.music-text {
  line-height: 44px;
  color: #fff;
}
.nickname,
.title {
  width: 200px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  lines: 1;
}
</style>
