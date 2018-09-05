<template>
    <div class="rankingList">
        <div v-if="!limit" class="h-title">
            <text class="h-txt">音乐排行榜</text>
        </div>
        <div class="anking">
            <div class="flexRow">
                <div v-for="(item,index) in rankLimit" @click="!limit?push('/views/home/lookMore/rankingList2',{rankId:item.rankId,journal:item.journal,title:title}):push2('/views/home/lookMore/rankingList2',{rankId:item.rankId,journal:item.journal})" :key="index" class="a-img">
                    <image class="image" resize="cover" :src="'http://media2.myyule.cn/'+item.rankCover" placeholder="http://www.myyule.com/images/musicSmall.jpg"></image>
                    <!-- <text class="a-title" lines="1">{{item.rankName}}</text> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { startNewWEeexView } from "../../../api/weex";
import mixins from "../../../mixins";
export default {
  mixins: [mixins],
  props: {
    rankList: {},
    limit: {},
    title:{}
  },
  computed: {
    rankLimit() {
      if (this.limit) {
        return this.rankList.slice(0, this.limit);
      } else {
        return this.rankList;
      }
    }
  }
};
</script>

<style scoped>
/*标题与更多*/
.h-title {
  flex-direction: row;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 15px;
}
.h-txt {
  color: #000;
  font-size: 32px;
  margin-top: 49px;
  margin-bottom: 40px;
}
/*排行榜列表*/
.anking {
  margin-bottom: 28px;
}
.flexRow {
  flex-direction: row;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.a-img {
  width: 243px;
  height: 243px;
  position: relative;
  margin-bottom: 10px;
  margin-left: 3px;
  margin-right: 3px;
}
.image {
  width: 243px;
  height: 243px;
}
.a-title {
  width: 243px;
  text-align: center;
  text-align: center;
  font-size: 24px;
  color: #fff;
  padding-top: 16px;
  padding-bottom: 16px;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>