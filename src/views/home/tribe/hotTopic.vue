<template>
    <div class="hot">
        <div class="h-title">
            <text class="h-txt">热门活动</text>
            <text class="iconfont h-icon">查看更多&#xe656;</text>
        </div>
        <div class="hot-topic">
          <ul class="topic-list">
            <li v-for="(item,index) in 2" :key="index" class="list-item" @click="toTopic(item)">
              <div class="topic-content">
                <div class="topic-wrapper">
                  <text class="topic-name">#真象大赛#</text>
                  <text class="font-26">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;纸条标题纸条标题纸条标题纸条标题纸条标题纸条标题</text>
                </div>
                <div class="topic-info">
                  <div class="info-img">
                    <image src="" alt="" ></image>
                  </div>
                  <text class="info-name font-24">青桦林</text>
                  <div class="info-icon">
                    <!-- <image class="image-view" :src='imgUrl+"unstyle.png"' ></image> -->
                  </div>
                  <text class="info-text font-24">123</text>
                  <div class="info-icon">
                    <!-- <image class="image-view" :src='imgUrl+"comment.png"' ></image> -->
                  </div>
                  <text class="info-text font-24">123</text>
                </div>
              </div>
              <div class="join-topic"><text class="topic-text">参加话题</text></div>
            </li>
          </ul>
        </div>
    </div>
</template>

<script>
const stream = weex.requireModule("stream");
export default {
  data() {
    return {};
  },
  methods: {},
  created() {}
};
</script>

<style scoped>
.font-24 {
  font-size: 24px;
  line-height: 24px;
}
.iconfont {
  font-family: iconfont;
}
/*标题与查看更多*/
.h-title {
  flex-direction: row;
  justify-content: space-between;
  padding-left: 20px;
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

.hot-topic {
  width: 750px;
}
.list-item {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 30px;
  margin-bottom: 30px;
}
.topic-content {
  width: 500px;
}
.topic-wrapper {
  position: relative;
}
.font-26 {
  font-size: 26px;
  line-height: 26px;
}
.topic-name {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 26px;
  line-height: 26px;
  color: #ee1c41;
}
.topic-info {
  flex-direction: row;
  padding-top: 10px;
}
.info-img {
  width: 49px;
  height: 49px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  background-color: #d9d9d9;
}
.info-text {
  line-height: 49px;
  padding-right: 33px;
  font-size: 26px;
}
.info-name {
  padding-left: 9px;
  padding-right: 84px;
}
.info-icon {
  width: 33px;
  height: 33px;
}
.join-topic {
  border-width: 2px;
  border-style: solid;
  border-color: #ee1c41;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin-top: 19px;
}
.topic-text {
  font-size: 26px;
  height:56px;
  line-height: 56px;
  padding-left: 13px;
  padding-right: 13px;
  color: #ee1c41;
}
</style>