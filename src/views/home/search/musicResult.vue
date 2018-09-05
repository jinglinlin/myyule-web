<template>
    <div @click="play(item)" class="music-item">
      <image class="music-icon" resize="cover" :src="'http://media2.myyule.cn/'+item.logo" placeholder="http://media2.myyule.cn/group1/M00/0D/1C/wKgB2ltYOj-AGj5hAACM-0yh7-U134.jpg"></image>
      <div class="music-content">
          <div class="music-all">
              <div class="music-name">
                  <text class="font-28"  :class="[otherName(item)[0]==keyWord?'color-pink':'color-black']">{{otherName(item)[0]}}</text>
                  <text class="font-28" :class="[otherName(item)[1]==keyWord?'color-pink':'color-black']">{{otherName(item)[1]}}</text>
                  <text class="font-28" :class="[otherName(item)[2]==keyWord?'color-pink':'color-black']">{{otherName(item)[2]}}</text>
              </div>
              <text v-if="isElips" class="elips font-28">...</text>
          </div>
        <div class="music-desc">
           <text class="font-28" :class="[otherNick(item)[0]==keyWord?'color-pink':'color-gray']">{{otherNick(item)[0]}}</text>
            <text class="font-28" :class="[otherNick(item)[1]==keyWord?'color-pink':'color-gray']">{{otherNick(item)[1]}}</text>
            <text class="font-28" :class="[otherNick(item)[2]==keyWord?'color-pink':'color-gray']">{{otherNick(item)[2]}}</text>
            <text v-if="isElips2" class="elips font-28">...</text>
        </div>

      </div>
    </div>
</template>
<script>
import mixins from "../../../mixins";
import {startNewWEeexView} from '../../../api/weex'
import { playDailySong, openPlayer } from "../../../api/weex";
const modal = weex.requireModule("modal");
export default {
  mixins: [mixins],
  props: {
    item: {},
    keyWord: {}
  },
    data(){
        return{
            isElips:false,
            isElips2:false
        }
    },
  computed: {},
  methods: {
    play(item){
      if(item.type){
        console.log(0)
        playDailySong([item]);
        openPlayer('player');
      }else if (item.albumId){
        this.push2('/views/home/lookMore/featureList',{resId:item.albumId,resType:'songAlbum'})
      }
    },
    //标红
    otherName(item){
        const stringInit = item.title;
        let string='';
        if(stringInit.length>18){
             string=stringInit.substr(0,18);
            this.isElips=true
        }else{
            string=stringInit;
            this.isElips=false
        }
        let index= 0;
        let len=this.keyWord.length;
        index = string.indexOf(this.keyWord);
        if(index == 0){
            return [this.keyWord,string.substr(len),'']
        } else if (index >0){
            return [string.substr(0,index),this.keyWord,string.substr(index+len)]
        }else{
            return ['',string,'']
        }
    },
      //标红
      otherNick(item){
          const stringInit= item.nickName;
          let string='';
          if(stringInit.length>18){
              string=stringInit.substr(0,18);
              this.isElips2=true
          }else{
              string=stringInit;
              this.isElips2=false
          }
          let index= 0;
          let len=this.keyWord.length;
          index = string.indexOf(this.keyWord);
          if(index == 0){
              return [this.keyWord,string.substr(len),'']
          } else if (index >0){
              return [string.substr(0,index),this.keyWord,string.substr(index+len)]
          }else{
              return ['',string,'']
          }
      },
  }
};
</script>
<style src="../../../assets/style/index.scss">
</style>
<style scoped>
/* 公共样式 */
.color-pink {
  color: #ee1c41;
}
.color-gray {
  columns: #666666;
}
.font-26 {
  font-size: 26px;
  line-height: 26px;
}
.font-28 {
  font-size: 28px;
  line-height: 28px;
  padding-top: 10px;
  padding-bottom: 13px;
}
/* 音乐结果 */
.music-item {
  width:750px;
  flex-direction: row;
  padding-left: 36px;
  padding-top: 26px;
  padding-bottom: 26px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #eeccee;
  background-color: #fff;
}
.music-icon {
  width: 88px;
  height: 88px;
  background-color: #eeccee;
  margin-right: 30px;
}

.music-name{
    /*width: 480px;*/
    flex-direction: row;
    overflow: hidden;
}
.elips{
    width: 30px;

}
.music-desc {
  flex-direction: row;
}
.music-all{
    flex-direction: row;

}
</style>
