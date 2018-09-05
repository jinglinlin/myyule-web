<template>
    <div class="t-contant" @click="push2('/views/topic/topicList',{topicTag:item.topicTag})" :key="index">
        <div class="t-title">
            <text class="title-text color-pink">#{{item.topicTag}}#</text>
        </div>
        <text class="t-title0">话题数{{item.topicNum}}</text>
        <div class="button">
          <text class="color-pink font-22">查看</text>
        </div>
    </div>
</template>

<script>
import mixins from "../../../mixins";
export default {
  name: "topic",
  mixins: [mixins],
  props: {
    item: {}
  }
};
</script>

<style src="../../../assets/style/index.scss">
</style>
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
.button{
  width:101px;
  height:45px;
  align-items: center;
  justify-content: center;
  border-width:1px;
  border-color:#ee1c41;
  border-radius:5px;
  border-style:solid;
}
.h-txt {
  color: #000;
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
  width:750px;
  flex-direction: row;
  align-items:center;
  padding-top: 28px;
  padding-bottom: 28px;
  padding-left: 35px;
  padding-right: 50px;
  justify-content: space-between;
  border-bottom-width:1px;
  border-bottom-style: solid;
  border-bottom-color:#ececec;
}
.t-title {
  flex-direction: row;
  width: 375px;
}
.index {
  margin-right: 10px;
}
.title-text {
  width: 375px;
  lines: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 28px;
}
.t-title0 {
  font-size: 22px;
  color: #757575;
}
</style>