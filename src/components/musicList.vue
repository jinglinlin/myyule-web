<template>
  <div class="music-list">
    <div v-if="!webShare" class="music-title">
      <text class="font-28">{{title}}</text>
      <div class="right">
        <text class="font-26">共{{(musicData.length?musicData.length:0)+typeName()}}</text>
        <!-- <wxc-icon name="more"></wxc-icon> -->
      </div>
    </div>
    <scroller class="scroll-list" scroll-direction="horizontal">
      <div @click="play(item)" v-for="(item,index) in musicData" :key="index" class="clubMusic-item">
        <image class="img-bg" resize="cover" :src="'http://media2.myyule.cn/'+(item.logo?item.logo:item.icon)" placeholder="http://www.myyule.com/images/videoSmall.jpg"></image>
        <div class="music-img">
          <div v-if="title!=='视频'" class="bottom">
            <div class="music-num bottom-text">
              <image class="img" :src="imgUrl+'listen.png'" ></image>
              <text class="font-18 music-text color-white">{{item.playSum}}</text>
            </div>
            <image class="music-play" :src="imgUrl+'play.png'" ></image>
          </div>
        </div>
        <text class="title font-26">{{item.title}}</text>
        <text class="nickname font-22 color-gray">{{item.nickname}}</text>
      </div>
    </scroller>
  </div>
</template>
<script>
import mixins from "../mixins";
import { getAlbumSongs } from "../api/music";
import { getVideoPlay } from "../api/club";
import { playDailySong,openPlayer,playVideo } from "../api/weex";
import { WxcIcon } from "weex-ui";
const modal = weex.requireModule("modal");

export default {
  mixins: [mixins],
  components: { WxcIcon },
  props: {
    title: {},
    musicData: {},
    webShare:{}
  },
  methods: {
    typeName() {
      if (this.title === "视频") {
        return "部";
      } else if (this.title === "数发专辑") {
        return "张";
      } else {
        return "首";
      }
    },
    // 播放音乐
    play(item) {
      if (this.title === "数发专辑") {
        this.push2('/views/home/lookMore/featureList',{resId:item.albumId,resType:'songAlbum'})
      } else if (this.title === "视频") {
        getVideoPlay({ resId: item.videoId }, { token: this.mobile })
          .then(res => {
            if (res.status == 0) {
              playVideo(res.object.url);
            } else {
              console.log(res.desc);
            }
          })
          .catch();
      } else {
      playDailySong([item]);
      openPlayer("player");
      }
    }
  }
};
</script>
<style src="../assets/style/index.scss">

</style>
<style scoped>

.music-list {
  margin-bottom:20px;
}
.music-title {
  padding-left: 20px;
  padding-right: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items:center;
}
.right {
  flex-direction: row;
  align-items: center;
}
.scroll-list {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  flex-direction: row;
  height:300px;
}
.clubMusic-item {
  position: relative;
  width: 230px;
  padding-bottom:20px;
  margin-right: 5px;
}
.img-bg {
  position: absolute;
  width: 230px;
  height: 230px;
  left: 0;
  right: 0;
}
.music-img {
  position: relative;
  width: 230px;
  height: 230px;
}
.bottom {
  position: absolute;
  flex-direction: row;
  justify-content: space-between;
  align-items:center;
  padding-left: 14px;
  padding-right: 14px;
  align-items: center;
  bottom: 0;
  width: 230px;
  left: 0;
}
.music-num {
  flex-direction: row;
  justify-content: space-around;
  align-items:center;
}
.img {
  width: 44px;
  height: 44px;
}
.music-text {
  line-height: 44px;
}
.music-play {
  width: 44px;
  height: 44px;
}
.bottom-text {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  color: #fff;
}
.nickname,
.title {
  width: 230px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  font-size:26px;
  lines:1;
}
</style>
