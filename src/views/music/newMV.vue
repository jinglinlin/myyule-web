<template>
    <div class="hot">
        <div class="h-title">
            <text class="h-txt">最新MV</text>
            <text @click="push2('/views/home/lookMore/MV','')" class="iconfont h-icon">更多&#xe656;</text>
        </div>
        <div class="h-list">
          <div @click="play(item)" v-for="(item,index) in mvList" :key="index" class="item">
            <div class="banner">
              <image class="b-image" resize="cover" :src="'http://media2.myyule.cn/'+item.logo" placeholder="http://www.myyule.com/images/videoBig.jpg"></image>    
              <div class="tag">
                <text v-if="item.typeId == 15" class="tag-text">原创</text>
                <text v-if="item.typeId == 16" class="tag-text">分享</text>
              </div>
              <text class="play iconfont">&#xe61d;</text>
              <text class="icon-play iconfont">&#xe820; {{item.viewSum}}</text>
            </div>
            <text class="play-name">{{item.title}}</text>
            <text class="play-msg">{{item.desc}}</text>
          </div>
        </div>
    </div>
</template>

<script>
import { playVideo } from "../../api/weex";
import mixins from "../../mixins";
import { getVideoPlay } from "../../api/recommend";
import {startNewWEeexView} from '../../api/weex'
export default {
  mixins:[mixins],
  props: {
    mvList: {}
  },
  data() {
    return {};
  },
  methods: {
    play(item) {
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
  margin-top: 19px;
  /*margin-left: 20px;*/
  margin-bottom: 28px;
  flex-direction: row;
  flex-wrap: wrap;
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
.number {
  width: 194px;
  height: 194px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 8px;
  padding-right: 8px;
  margin-bottom: 20px;
  font-size: 22px;
  color: #fff;
  position: absolute;
  top: 146px;
}
.h-title0 {
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
  text-align: left;
  font-size: 22px;
  color: #666;
}
.item {
  width: 335px;
  margin-bottom: 37px;
  margin-left: 10px;
  margin-right: 10px;
}
.banner {
  position: relative;
  width: 335px;
  height: 191px;
}
.b-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 335px;
  height: 191px;
}
.tag {
  width: 72px;
  height: 36px;
  background-color: #ee1c41;
  margin-top: 15px;
  border-bottom-right-radius: 17px;
  border-top-right-radius: 17px;
}
.tag-text {
  width: 72px;
  text-align: center;
  line-height: 36px;
  font-size: 22px;
  color: #fff;
}
.play {
  color: #fff;
  font-size: 96px;
  width: 335px;
  text-align: center;
}
.icon-play {
  color: #fff;
  font-size: 22px;
  padding-left: 12px;
  padding-bottom: 12px;
}
.play-name {
  font-size: 24px;
  padding-top: 23px;
  padding-bottom: 10px;
  color: #3b3b3b;
}
.play-msg {
  font-size: 22px;
  color: #666;
}
</style>