<template>
    <wxc-mask height="484"
              width="484"
              border-radius="20"
              duration="200"
              mask-bg-color="transparent"
              :has-animation="hasAnimation"
              :has-overlay="true"
              :show-close="true"
              :show="key"
              @wxcMaskSetHidden="wxcMaskSetHidden">
        <div class="content">
            <div class="content-text">
                <div class="BGSign">
                    <image class="image-view signImage" :src='imgUrl+"signBg.png"' alt="" style=""></image>
                </div>
                <div class="calendar-inner2">
                    <image class="image-view" :src='imgUrl+"signSuccess.png"' alt="" style="height: 40px;width: 40px;"></image>
                    <!--<div class="font-30 signColor">-->
                        <text class="signtext">已经签到</text>
                        <text class="day font-36 signTime">{{signData.signDay}}</text>
                        <text>天</text>
                    <!--</div>-->
                </div>
                <div class="days-list">
                    <div v-for="item in 7" :key="item"  class="datys-item">

                        <image class="image-view picSign" :src='signData.signDay<=item?imgUrl+"signed.png":imgUrl+"noSign.png"' alt="" ></image>
                        <div class="numSigns">
                            <text  :class="[signData.signDay>=item?'active':'','font-20','numSign']">{{item}}</text>
                        </div>

                    </div>
                </div>
                <!--<div @click="signKey = false" class="close">-->
                    <!--<image class="image-view" :src='imgUrl+"signClose.png"' alt="" ></image>-->
                <!--</div>-->
            </div>
        </div>
    </wxc-mask>
</template>

<script>
    import { WxcMask } from 'weex-ui';
    import mixins from "../../mixins";
    export default {
        mixins: [mixins],
        components: { WxcMask },
        props: {
            club: {},
            signData: {}
        },
        data() {
            return {
                key: false,
                overlayCanClose: true,
                isFalse: false,
                hasAnimation: true,
                imgUrl: 'http://wap.myyule.teamshub.com/web-icon/',
                // signKey: true,
                // signData: {signDay:1}
            };
        },
        methods: {
            openMask (e) {
                this.key = true;
                this.hasAnimation = true;
            },
            wxcMaskSetHidden () {
                this.key = false;
            },
            openNoAnimationMask (e) {
                this.key = true;
                this.hasAnimation = false;
            },
            show() {
                this.key = true;
            }

        }
    };

</script>
<style src="../../assets/style/index.scss">

</style>
<style scoped>
    
    .image-view{
        width:30px;
        height:30px;
    }
    .content-text{
        position:relative;
        width: 484px;
        height: 454px;
    }
    .BGSign {
        position: absolute;
        top: 0px;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .signImage {
        width: 484px;
        height: 454px;
    }
    .calendar-inner2 {
        position: absolute;
        left: 80px;
        bottom: 150px;
        flex-direction: row;
        justify-content: space-between;
        align-items:center;
    }
    .signTime {
        color: #ee1c41;
        margin-left: 20px;
        margin-right: 20px;
    }
    .signtext{
        margin-left: 20px;
    }
    .days-list {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-left:36px ;
        padding-right: 36px;
        padding-top: 24px;
        padding-bottom: 24px;
        position: absolute;
        bottom: 0px;
        right: 0px;
        left: 0px;
    }
    .datys-item {
        position: relative;
        width: 36px;
        height: 36px;
        justify-content: center;
        align-items: center;
    }
    .picSign{
        position: absolute;
        width: 36px;
        height: 36px;
        top: 0px;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .numSigns {
        position: absolute;
        width: 36px;
        height: 36px;
        top:0px;
        left:0px;
        justify-content: center;
        align-text:center;
        align-items: center;
        color: #000;
    }
    .close{
        position: absolute;
        bottom: -80px;
        left: 242px;
        margin-left: -15px;
    }
    .active{
        color:white;
    }
</style>