<template>
  <div class="hotTopicDetail">
    <div class="h-title">
        <text class="h-txt">热门话题</text>
        <text @click="push2('/views/home/lookMore/topicListMore','')" class="iconfont h-icon">更多&#xe656;</text>
    </div>
    <!-- 话题内容 -->
    <div  v-for="(item,index) in hotTopic" :key="index" @click="push2('/views/topic/topic_detail',{resId:item.resId})" class="topic-content">
      <div class="topic-text">
        <div class="tag-content">
          <text class="topic-tag color-pink">#</text>
          <text @click="push2('/views/topic/topicList',{topicTag:item.topicTags[0]})" class="topic-tag color-pink" v-for="(tag,index) in item.topicTags[0].split('')">{{tag}}</text>
          <text class="topic-tag color-pink">#</text>
          <text v-if="item.topicTags[1]" class="topic-tag color-pink">#</text>
          <text v-if="item.topicTags[1]" class="topic-tag color-pink" @click="push2('/views/topic/topicList',{topicTag:item.topicTags[1]})" v-for="(tag,index) in item.topicTags[1]?item.topicTags[1].split(''):''">{{tag}}</text>
          <text v-if="item.topicTags[1]" class="topic-tag color-pink">#</text>
          <text v-if="item.topicTags[2]" class="topic-tag color-pink">#</text>
          <text v-if="item.topicTags[2]" class="topic-tag color-pink" @click="push2('/views/topic/topicList',{topicTag:item.topicTags[2]})" v-for="(tag,index) in item.topicTags[2]?item.topicTags[2].split(''):''">{{tag}}</text>
          <text v-if="item.topicTags[2]" class="topic-tag color-pink">#</text>
          <text class="topic-tag color-gray" v-for="(tag,index) in richText(item)">{{tag}}</text>
          <text v-if="contentLength(item)>36" class="font-28 other">...</text>
        </div>
        <text class="join font-22">参与话题</text>
      </div>
      <div class="user">
        <image :src="item.user.icon?(imgSrc+item.user.icon):'http://www.myyule.com/images/head-02.jpg'" class="user-icon"></image>
        <text class="username font-24">{{item.user.nickname}}</text>
        <text class="iconfont collectNum font-24">&#xe627; {{item.collectNum}}</text>
        <text class="iconfont commentNum font-24">&#xe631; {{item.commentNum}}</text>
      </div>
    </div>
  </div>
</template>
<script>
import mixins from "../../../mixins";
export default {
  mixins: [mixins],
  props:{
    hotTopic:{}
  },
  methods: {
    // 截取后的字数
    richText(item) {
      var tagStr = "";
      console.log(item.topicTags);
      item.topicTags.forEach(function(value, index, array) {
        tagStr += value + 2;
      });
      return item.content
        .split("")
        .splice(
          0,
          36 - tagStr.split("").length > 0 ? 36 - tagStr.split("").length : 0
        );
    },

    // 标签以及内容长度
    contentLength(item) {
      var total = item.content;
      item.topicTags.forEach(function(value, index, array) {
        total += value + 2;
      });
      return total.length;
    }
  }
};
</script>
<style src="../../../assets/style/index.scss">
</style>
<style scoped>
.iconfont {
  font-family: iconfont;
}
.h-title {
  flex-direction: row;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 15px;
}
.h-txt {
  color: #000000;
  font-size: 32px;
  margin-top: 18px;
  margin-bottom: 19px;
}
.h-icon {
  font-size: 28px;
  color: #666666;
  margin-top: 14px;
}
.collectNum {
  margin-right: 31px;
}
.h-tag {
  width: 242px;
  flex-direction: row;
  margin-bottom: 11px;
}
.topic-content {
  margin-bottom: 30px;
}
.user-icon {
  width: 60px;
  height: 60px;
  border-radius: 90px;
}
.topic-tag{
  font-size:28px;
  line-height: 39px;
}
.username {
  margin-left: 12px;
  margin-right: 40px;
}
.user {
  flex-direction: row;
  align-items: center;
  margin-left: 20px;
}
.topic-img {
  align-items: center;
  flex-direction: row;
  margin-bottom: 30px;
  justify-content: space-around;
}
.img-item {
  width: 200px;
  height: 200px;
  border-radius: 10px;
}
.topic-text {
  margin-left: 20px;
  margin-right: 30px;
  flex-direction: row;
  align-items: flex-start;
}
.tag-content {
  width: 590px;
  flex-direction: row;
  flex-wrap: wrap;
}
.join {
  padding-top: 5px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 5px;
  border-radius: 5px;
  border-width: 2px;
  border-style: solid;
  border-color: #ee1c41;
  color: #ee1c41;
}
</style>
