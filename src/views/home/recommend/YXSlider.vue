<template>
    <slider class="slider" auto-play="false" interval="4500">
        <div v-if="type==='banner'" @click="pushWeb(item)" class="frame" v-for="(item,index) in imageList" :key="index">
            <image class="image" resize="cover" :src="'http://media2.myyule.cn/'+item.logo"></image>
        </div>
        <div v-if="type==='mv'" @click="play(item)" class="frame" v-for="(item,index) in imageList" :key="index">
            <image class="image" resize="cover" :src="'http://media2.myyule.cn/'+item.logo"></image>
        </div>
        <indicator class="indicator"></indicator>
    </slider>
</template>
<script>
import { playVideo,openChat } from "../../../api/weex";
import { getVideoPlay } from "../../../api/recommend";
import mixins from "../../../mixins";
import {startNewWebView,startNewWEeexView} from '../../../api/weex'
import { push } from '../../../utils/index';
const modal = weex.requireModule("modal");

export default {
  mixins: [mixins],
  props: {
    imageList: {},
    type: {}
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
    },
    pushWeb(item) { 
      // openChat({ chatacct: "gz_8fa4423a74ac489f", chattype: "3" });
      if (item.type==='weex'){
        startNewWEeexView(item.url)
      } else if (item.type==='web'){
        startNewWebView({url:item.url,hideTitle:'1'});
      }
    }
  }
};
</script>
<style scoped>
.iconfont {
  font-family: iconfont;
}

.image {
  width: 750px;
  height: 288px;
}

.slider {
  width: 750px;
  height: 288px;
}

.frame {
  width: 750px;
  height: 288px;
  position: relative;
}

.indicator {
  width: 750px;
  height: 40px;
  item-color: white;
  item-selected-color: #b4282d;
  item-size: 12px;
  position: absolute;
  bottom: 10px;
  right: 0px;
}
</style>
