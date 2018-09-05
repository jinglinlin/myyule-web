<template>
  <div class="wrapper">
    <div class="imgPlay center" @click="play(video)">
        <image class="imgbg" :src="url+video.logo"></image>
        <text class="iconfont icon">&#xe61d;</text>
       <div class="mark center">
         <div class="markBg"></div>
         <text class="markTxt" v-if="video.typeId==16">分享</text>
         <text class="markTxt" v-else-if="video.typeId==15">原创</text>
        <!-- <text class="markTxt" v-else-if="video.type==23">翻唱</text>
         <text class="markTxt" v-else-if="video.type==24">伴奏</text>-->
       </div>
       <div class="video row">
          <text class="iconfont videoImg">&#xe64e;</text>
          <text class="videoNum">{{video.viewSum}}</text>
       </div>
    </div>
    <text class="playTitle">{{video.title}}</text>
  </div>
</template>
<style scoped>
	.iconfont{
   font-family:iconfont;
  }
  .row{
    flex-direction: row;
    justify-content: space-around;
    flex-wrap:wrap;
  }
  .center{
    justify-content: center;
    align-items: center;
  }
  .right{
    justify-content: flex-end;
  }
  .on{
    color:#FF4563;
  }
  .search-title{
     font-size: 30px;
     margin-right: 20px;
     line-height:60px;
  }
  .musicList{
    padding-left:5px;
    padding-right:5px;
    margin-top: 30px;
    padding-bottom: 60px;
  }
  .imgPlay{
    width:335px;
    height:189px;
    border-width:1px;
    border-style:solid;
    border-color:#ccc;
  }
  .imgbg{
    position: absolute;
    top:0;
    left:0px;
    width:335px;
    height:189px;
  }
  .musicLi{
    margin-top: 10px;
    padding-left:10px;
    padding-right:10px;
  }
  .playTitle{
    width:335px;
    margin-top: 10px;
    font-size: 28px;
    lines:1;
  }
  .icon {
    color:#fff;
    font-size:80px;
  }
  .mark{
    position: absolute;
    left:0px;
    top:10px;
    width:72px;
    height: 34px;
  }
  .markBg{
    position: absolute;
    width: 72px;
    height:34px;
    background-color: #f51438;
    border-top-right-radius:15px;
    border-bottom-right-radius:15px;
  }
   .markTxt{
    line-height:34px;
    font-size: 22px;
    color:#fff;
    lines:1;
  }
  .video{
    position: absolute;
    left:10px;
    bottom:0px;
    align-items: center;
  }
  .videoImg{
    font-size:50px;
    color:#fff;
    margin-right:10px;
  }
   .videoNum{
    line-height: 40px;
    font-size: 30px;
    color:#fff;
  }
  /*菜单开始*/
</style>
<script>
import { playVideo } from "../../../api/weex";
import { getVideoPlay } from "../../../api/urlDate";
import mixins from '../../../mixins';
export default {
  mixins:[mixins],
  props: {
    video: {}
  },
  data: () => ({
  	url: "http://media2.myyule.cn/",
	}),
	methods: {
		//播放视频
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
  }
};
</script>