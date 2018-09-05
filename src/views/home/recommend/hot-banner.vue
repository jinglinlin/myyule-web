<template>
    <div class="hot">
        <div class="h-title">
            <text class="h-txt">热门活动</text>
            <text @click="push2('/views/activity/active_more','')" class="iconfont h-icon">更多&#xe656;</text>
        </div>
        <scroller  class="scroller h-list" scroll-direction="horizontal" show-scrollbar=false>
            <div @click="push2('/views/activity/active_layout/active_detail',{resId:item.resId})" class="imgWarp" v-for="(item,index) in activityList" :key="index">
                <image class="image" resize="cover" :src="item.logo.substr(0,4)==='http'?item.logo:('http://media2.myyule.cn/'+item.logo)" placeholder="http://www.myyule.com/images/music/photo192.jpg"></image>
                <text class="h-title0">{{item.title}}</text>
                <div class="h-tag">
                  <text class="tag-item" v-for="tagItem in item.actTag">{{tagItem}}</text>
                </div>
                <text class="h-time">{{item.starttime.substr(0,10)}}</text>
            </div>
        </scroller>
    </div>
</template>

<script>
import mixins from '../../../mixins'
import {startNewWebView} from '../../../api/weex'
export default {
  mixins:[mixins],
  props: {
    activityList: {}
  },
  data() {
    return {};
  },
  methods: {
  },
  created() {}
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
.h-tag{
  width:242px;
  flex-direction: row;
  margin-bottom: 11px;
}
.tag-item{
  padding-top:3px;
  padding-left:5px;
  padding-right:5px;
  padding-bottom:3px;
  background-color:#E2E2E3;
  color:#666666;
  border-radius:5px;
  font-size:20px;
  margin-right:10px;
}
/*图片列表*/
.h-list {
  height: 503px;
  margin-top: 19px;
  margin-left: 20px;
  margin-bottom: 28px;
  flex-direction: row;
}
.imgWarp {
  width: 242px;
  margin-right: 15px;
}
.image {
  width: 242px;
  height: 343px;
  border-radius: 15px;
  margin-bottom: 20px;
}
.h-title0 {
  color: #3b3b3b;
  font-size: 24px;
  margin-bottom: 12px;
  text-align: left;
  lines:1;
  text-overflow: ellipsis;
}
.h-time {
  text-align: left;
  font-size: 22px;
  color: #666;
}
</style>