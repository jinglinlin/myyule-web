<template>
  <div class="myClub">
    <div v-for="(item,index) in clubData" :key="index" @click="toLayout(item)" class="club-item">
      <div class="left">
        <image class="user-img" resize="cover" :src="item.clubLogo?'http://media2.myyule.cn/'+item.clubLogo:''" alt="" width="120" height="120"></image>
        
        <div class="user-info">
          <text class="title ">{{item.clubName}}</text>
          <div style="flex-direction:row;padding-bottom: 18px;">
            <text class="font-22 color-gray" style="padding-right:30px">人气{{item.clubMemberNum}}</text>
            <!-- <text class="font-22 color-gray">话题0</text> -->
          </div>
          <text lines="1" class="font-22 desc info-text">{{item.clubDesc}}</text>
        </div>
      </div>
      <div class="follow"><text class="font-26 join-text">已加入</text></div>
  </div>
  </div>
</template>
<script>
import mixins from "../../mixins";
export default {
  mixins: [mixins],
  props: {
    clubData: {}
  },
  methods: {
    toLayout(item) {
      this.push2("/views/club/club_layout", { clubId: item.clubId });
    }
  }
};
</script>
<style src="../../assets/style/index.scss">

</style>
<style scoped>
.myClub{
  width:750px;
}
.club-item {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 47px;
  padding-left: 23px;
  padding-right: 23px;
  padding-top: 47px;
  height:240px;
  align-items: center;
  background-color: #fff;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
}
.left {
  flex-direction: row;
  justify-content: space-around;
}
.img-vip {
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
}
.range {
  font-size: 60px;
  line-height: 120px;
}
.range {
  position: absolute;
  right: -5px;
  top: -5px;
  font-size: 24px;
  color: #fff;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  width: 48px;
  height: 48px;
  text-align: center;
  line-height: 48px;
  background-color: #ee1c41;
}
.user-img {
  position: relative;
  margin-left: 20px;
  margin-right: 20px;
  width: 120px;
  height: 120px;
  border-bottom-left-radius: 90px;
  border-bottom-right-radius: 90px;
  border-top-left-radius: 90px;
  border-top-right-radius: 90px;
  background-color: #d9d9d9;
}
.title {
  width: 300px;
  lines:1;
  color: #000;
  font-size:26px;
  margin-bottom: 18px;
}
.info-text {
  margin-bottom: 18px;
  color: #828282;
}
.desc {
  width: 200px;
  lines:1;
}
.follow {
  width: 110px;
  height: 60px;
  background-color: #ee1c41;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  border-bottom-color: #ececec;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.join-text {
  text-align: center;
  line-height: 60px;
  color: #fff;
}
</style>
