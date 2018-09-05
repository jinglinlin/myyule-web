<template>
    <slider class="slider" auto-play="true" interval="4500">
        <div @click="pushWeb(item)" v-for="(item,index) in poster" :key="index" class="poster">
            <image class="p-img" resize="cover" :src="'http://media2.myyule.cn/'+item.logo"></image>
        </div>
    </slider>
</template>

<script>
import {startNewWebView,openChat,startNewWEeexView} from '../../../api/weex'
import mixins from '../../../mixins'
const modal = weex.requireModule("modal");
export default {
  mixins:[mixins],
  name: "poster",
  props: {
    poster: {}
  },
  methods:{
    pushWeb(item) {
      // openChat({ chatacct: "gz_8fa4423a74ac489f", chattype: "3" });
      if (item.type==='weex'){
        console.log(item.url)
        startNewWEeexView(item.url)
      } else if (item.type==='web'){
        startNewWebView({url:item.url,hideTitle:'1'});
      }
    }
  }
};
</script>

<style scoped>
.poster {
  height: 205px;
}
.p-img {
  width: 750px;
  height: 205px;
}
.slider {
  width: 750px;
  height: 205px;
}
</style>