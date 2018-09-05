<template>
  <div class="clubVideo">
    <div @click="play(item)" v-for="(item,index) in resData" :key="index" class="clubVideo-item">
      <div class="video-banner">
        <image class="video-banner" resize="cover" :src="'http://media2.myyule.cn/'+item.logo" placeholder="http://www.myyule.com/images/videoBig.jpg"></image>
        
        <image class="video-play" :src="imgUrl+'max-play.png'" ></image>
        <div class="video-time"><text class="video-text font-26">播放次数{{item.viewSum}}</text></div>
      </div>
    </div>
  </div>
</template>
<script>
import { getVideoPlay } from "../../api/club";
import { playVideo } from "../../api/weex";
import mixins from "../../mixins";
export default {
  mixins: [mixins],
  props: {
    resData: {}
  },
  methods: {
    play(item) {
      // 站外分享点击事件处理
      this.shareEvent();
      getVideoPlay({ resId: item.videoId }, { token: this.mobile })
        .then(res => {
          if (res.status == 0) {
            playVideo(res.object.url);
          } else {
            console.log(res.desc);
          }
        })
        .catch();
    }
  }
};
</script>
<style src="../../assets/style/index.scss">
</style>
<style scoped>
.clubVideo {
  position: relative;
  padding-left: 20px;
  padding-right: 20px;
}
.clubVideo-item {
  position: relative;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  box-shadow: 10px 13px 6px 3px #d9d9d9;
}
.video-banner {
  position: relative;
  width: 670px;
  height: 420px;
  background-color: #000;
}
.video-play {
  position: absolute;
  top: 146px;
  left: 270px;
  width: 129px;
  height: 129px;
}
.video-time {
  position: absolute;
  bottom: 10px;
  left: 20px;
}
.video-text {
  color: #fff;
}
</style>
