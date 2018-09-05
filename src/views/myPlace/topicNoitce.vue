<template>
  <div class="topicNoitce" :style="{height:(topicImg.length==0?287:512)+'px'}">
    <!-- 用户信息 -->
    <div class="user-info" @click="push2('/views/myPlace/myPlace',{mobile:item.mobile})">
      <div class="left">
        <div class="pic">
          <image class="image-view img-vip" resize="cover" :src="item.user.icon?('http://media2.myyule.cn/'+item.user.icon):'http://www.myyule.com/images/head-02.jpg'" placeholder="http://www.myyule.com/images/head-02.jpg"></image>
        </div>
        <div class="info">
          <text class="info-nickname">{{item.user.nickname}}</text>
          <text class="font-22 info-text color-gray">{{noticeTime(item.createtime)}}</text>
        </div>
      </div>
      <div class="right">
        <text class="iconfont font-30">&#xe61e;</text>
        <text class="seeNum color-gray font-22">{{item.seeNum}}</text>
      </div>
    </div>
    <!-- 话题内容 -->
    <div class="topic-content">
      <div class="topic-text">
        <div class="tag-content">
          <text class="topic-tag color-pink">#</text>
          <text @click="push2('/views/home/lookMore/topicList',{topicTag:item.topicTags[0]})" class="topic-tag color-pink" v-for="(tag,index) in item.topicTags[0].split('')">{{tag}}</text>
          <text class="topic-tag color-pink">#</text>
          <text v-if="item.topicTags[1]" class="topic-tag color-pink">#</text>
          <text v-if="item.topicTags[1]" class="topic-tag color-pink" @click="push2('/views/home/lookMore/topicList',{topicTag:item.topicTags[1]})" v-for="(tag,index) in item.topicTags[1]?item.topicTags[1].split(''):''">{{tag}}</text>
          <text v-if="item.topicTags[1]" class="topic-tag color-pink">#</text>
          <text v-if="item.topicTags[2]" class="topic-tag color-pink">#</text>
          <text v-if="item.topicTags[2]" class="topic-tag color-pink" @click="push2('/views/home/lookMore/topicList',{topicTag:item.topicTags[2]})" v-for="(tag,index) in item.topicTags[2]?item.topicTags[2].split(''):''">{{tag}}</text>
          <text v-if="item.topicTags[2]" class="topic-tag color-pink">#</text>
          <text class="topic-tag color-gray" v-for="(tag,index) in richText(item.content)">{{tag}}</text>
          <text v-if="contentLength()>65" class="font-28 other">...</text>
        </div>
      </div>
      <div class="topic-img">
        <image resize="cover" class="img-item" v-for="(img,index) in topicImg" :key="index" :src="imgSrc+img"></image>
      </div>
    </div>
  </div>
</template>
<script>
import mixins from "../../mixins";
export default {
  mixins: [mixins],
  props: {
    item: {}
  },
  data() {
    return {};
  },
  mounted(){
    console.log(this.topicImg)
  },
  computed: {
    topicImg() {
      return this.item.images.splice(0, 3);
    }
  },
  methods: {
    // 截取后的字数
    richText(ss){
      let tagStr = ''
      this.item.topicTags.forEach((value,index,array)=>{
        tagStr+=value+2
      })
      return ss.split('').splice(0,(65-tagStr.split('').length)>0?65-tagStr.split('').length:0)
    },
    // 标签以及内容长度
    contentLength() {
      let total = this.item.content;
      this.item.topicTags.forEach((value, index, array) => {
        total+=value+2
      });
      return total.length;
    }
  }
};
</script>
<style src="../../assets/style/index.scss">
</style>
<style scoped>
/*图标*/
.iconfont {
  font-family: iconfont;
}
.topicNoitce {
  /* height: 476px; */
  /* height:98px; */
}
.topic-img {
  align-items: center;
  flex-direction: row;
  margin-bottom: 30px;
  /* justify-content: space-around; */
}
.img-item {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  margin-left:26px;
}
.topic-text {
  margin-left: 30px;
  margin-right: 30px;
  width: 655px;
  margin-bottom: 24px;
  flex-direction: row;
}
.tag-content {
  width: 648px;
  flex-direction: row;
  align-items: bottom;
  flex-wrap:wrap;
  /* overflow: hidden; */
}
.topic-tag {
  /* lines: 2; */
  font-size:28px;
  line-height: 39px;
  /* text-overflow: ellipse; */
}
.user-info {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 35px;
  padding-bottom: 30px;
  padding-left: 30px;
  padding-right: 10px;
}
.left,
.right {
  flex-direction: row;
  align-items: center;
}
.seeNum {
  margin-left: 10px;
}
.pic {
  width: 90px;
  height: 90px;
  background-color: #d9d9d9;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  overflow: hidden;
}
.img-vip {
  width: 90px;
  height: 90px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}
.codeImg {
  width: 602px;
  height: 602px;
}
.info {
  padding-left: 20px;
}
.info-text {
  line-height: 28px;
  padding-top: 10px;
}
.info-nickname{
  padding-top: 10px;
}
</style>
