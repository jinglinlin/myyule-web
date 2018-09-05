<template>
    <div class="hot">
        <div class="h-title">
            <text class="h-txt">{{title?title:'校长推荐歌单'}}</text>
            <text @click="title?push2('/views/home/lookMore/editorRecommend',''):push('/views/home/lookMore/editorRecommend','')" class="iconfont h-icon">更多&#xe656;</text>
        </div>
        <scroller  class="scroller h-list" scroll-direction="horizontal" show-scrollbar=false>
            <div class="imgWarp" @click="title?push2('/views/home/lookMore/featureList',{resId:item.albumId,resType:'songAlbum'}):push('/views/home/lookMore/featureList',{resId:item.albumId,resType:'songAlbum'})" v-for="(item,index) in albumList" :key="index">
                <div class="imgCont">
                    <image class="image" resize="cover" :src="'http://media2.myyule.cn/'+item.logo" placeholder="http://www.myyule.com/images/musicSmall.jpg"></image>
                    <text class="iconfont number">&#xe678; {{item.playSum}}</text>
                </div>
                <text lines="1" class="h-title0">{{item.title}}</text>
            </div>
        </scroller>
    </div>
</template>

<script>
import mixins from '../../../mixins'
import {startNewWEeexView} from '../../../api/weex'
export default {
  mixins:[mixins],
  created() {},
  props: {
    albumList: {},
    title:{}
  },
  data() {
    return {};
  },
  methods: {
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
  height: 272px;
  margin-top: 19px;
  /*margin-left: 20px;*/
  margin-bottom: 28px;
  flex-direction: row;
}
.imgWarp {
  width: 194px;
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
  lines: 1;
  text-overflow:ellipsis;
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
</style>