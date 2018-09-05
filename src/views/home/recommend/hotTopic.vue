<template>
    <div class="topic">
        <div class="t-contant" v-for="(item,index) in hotTopic" @click="push2('/views/topic/topicList',{topicTag:item.topicTag})" :key="index">
            <div class="t-title">
                <text class="title-text">#{{item.topicTag}}#</text>
            </div>
            <text class="t-title0">话题数 {{item.topicNum}}</text>
        </div>
    </div>
</template>

<script>
import mixins from "../../../mixins";
export default {
  name: "topic",
  mixins: [mixins],
  props: {
    hotTopic: {}
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
  padding-left: 20px;
  padding-right: 15px;
  padding-top: 34px;
  padding-bottom: 34px;
}
.h-txt {
  color: #3b3b3b;
  font-size: 32px;
}
.h-icon {
  font-size: 28px;
  color: #666;
  margin-right: 20px;
}
.rt-text {
  flex-direction: row;
}
/*话题内容*/
.t-contant {
  flex-direction: row;
  padding-top: 28px;
  padding-bottom: 28px;
  padding-left: 35px;
  padding-right: 50px;
  justify-content: space-between;
}
.t-title {
  width: 375px;
}
.index {
  margin-right: 10px;
}
.title-text {
  lines: 1;
  text-overflow: ellipsis;
  color: #3B3B3B;
  font-size: 28px;
}
.t-title0 {
  font-size: 24px;
  color: #757575;
}
</style>