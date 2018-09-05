<template>
    <div class="editorSong" @viewappear=""  @viewdisappear="" :style="{paddingTop:source==='iOS'?50:20+'px'}">
        <!--加载器-->
        <wxc-loading :show="isShow"></wxc-loading>
        <!--头部-->
        <div class="header center">
            <text class="iconfont re_icon"  @click="pop()">&#xe625;</text>
            <text  class="h-title">#{{topicTag}}#</text>
            <text class="msc_icon"></text>
        </div>

        <list @loadmore="fetchPage" loadmoreoffset="600"
                  class="item-container musicListBox"
                  :style="{ height:(tabPageHeight-20) + 'px' }">
                <cell class="musicList" v-for="(item, i) in topicList1" @click="push2('/views/topic/topic_detail',{resId:item.resId})">
                    <div class="topicRow">
                        <div class="row">
                        <div class="topic-top">
                            <div class="topic-user">
                                <image  class="pic" resize="cover"  :src="item.user.icon?(url+item.user.icon):(imgUrl+'userIcon.png')" :placeholder="imgUrl+'userIcon.png'"></image>
                                <div class="topic-time">
                                    <text class="userName font-28">{{item.user.nickname}}</text>
                                    <text class="hours font-22 ">{{getDateTimeStamp(item.createtime)}}</text>
                                </div>
                            </div>
                            <div  class="topic-number">
                                <div class="topic-icon">
                                    <image  class="picLocation" resize="cover" :src="imgUrl+'see.png'"></image>
                                    <text class="font-26 topic-see">{{item.seeNum}}</text>
                                </div>
                                <div class="clubNames">
                                    <text v-if="i<2" v-for="(items, i) in item.club" class="topic-btn font-22" @click="toClub(items)">{{items.clubName}}</text>
                                </div>
                            </div>
                        </div>
                        <div class="topic-middle">
                            <div class="topic-text">
                                <div class="tag-content">
                                    <text class="topic-tag font-28 color-pink">#</text>
                                    <text @click="topicTagList(item.topicTags[0])" class="topic-tag font-28 color-pink" v-for="(tag,index) in item.topicTags[0].split('')">{{tag}}</text>
                                    <text class="topic-tag font-28 color-pink">#</text>
                                    <text v-if="item.topicTags[1]" class="topic-tag font-28 color-pink">#</text>
                                    <text v-if="item.topicTags[1]" class="topic-tag font-28 color-pink" @click="topicTagList(item.topicTags[1])" v-for="(tag,index) in item.topicTags[1]?item.topicTags[1].split(''):''">{{tag}}</text>
                                    <text v-if="item.topicTags[1]" class="topic-tag font-28 color-pink">#</text>

                                    <text v-if="item.topicTags[2]" class="topic-tag font-28 color-pink">#</text>
                                    <text v-if="item.topicTags[2]" class="topic-tag font-28 color-pink" @click="topicTagList(item.topicTags[2])" v-for="(tag,index) in item.topicTags[2]?item.topicTags[2].split(''):''">{{tag}}</text>
                                    <text v-if="item.topicTags[2]" class="topic-tag font-28 color-pink">#</text>

                                    <text class="topic-tag font-28 hours" v-for="(tag,index) in richText(item.content,item.topicTags)">{{tag}}</text>
                                    <text v-if="contentLength(item.content+item.topicTags[0]+item.topicTags[1]+item.topicTags[2],item.topicTags).length>75" class="font-28 hours">...</text>
                                </div>
                            </div>

                            <div v-if="item.images&&item.images.length!=0" class="pic-list">
                                <image   @click="openLightBox(item.images,i)" :class="[i<2?'imgIndex':'']" v-if="i<3" v-for="(itemImg, i) in item.images"  class="picImg" resize="cover" :src="url+itemImg"></image>
                            </div>
                        </div>
                        <div class="topic-footer">
                            <div class="heart" @click="toLayout(item)">
                                <image class="heart-view" :src='imgUrl+"comment.png"'></image>
                                <text class="heart-span">{{item.commentNum}}</text>
                            </div>
                            <div class="heart" @click="toThumb(item)">
                                <image v-if="item.isThumb==1" class="heart-view" :src="imgUrl+'thumbNumActive.png'" ></image>
                                <image v-if="item.isThumb==0" class="heart-view"  :src='imgUrl+"thumbNum.png"'></image>
                                <text class="heart-span">{{item.thumbNum}}</text>
                            </div>
                            <div class="heart" @click="share(item)">
                                <image class="heart-view"  :src='imgUrl+"min-share.png"'></image>
                                <text class="heart-span">分享</text>
                            </div>

                            <div class="heart"  @click="moreOpt1(item)">
                                <text class="heart-span">...</text>
                                <text class="heart-span">更多</text>
                            </div>
                        </div>
                    </div>
                    </div>
                </cell>
            </list>

        <wxc-lightbox
                ref="wxc-lightbox"
                height="800"
                :show="lightBoxShow"
                :image-list="imageList"
                :show-indicator = false
                @wxcLightboxOverlayClicked="wxcLightboxOverlayClicked">
        </wxc-lightbox>
        <wxc-popup popup-color="#fff"
                   :show="isBottomShow"
                   @wxcPopupOverlayClicked="popupOverlayBottomClick"
                   pos="bottom"
                   :height="(iMobile === mobile)?342:227"
                   width="750">
            <div class="demo-content">
                <div class="botMoreOpt col" ref="botMoreOptBg" >
                    <div class="optItems col">
                        <!--<text @click="toReport()" class="optDesc">举报</text>-->
                        <text v-if="iMobile === mobile" @click="_delete()" class="optDesc">删除</text>
                        <text v-if="iMobile === mobile" @click="edit()" class="optDesc">编辑</text>
                        <text v-if="iMobile !== mobile" @click="toReport()" class="optDesc">举报</text>
                    </div>
                    <text class="optDesc" @click="close()">取消</text>
                </div>
            </div>
        </wxc-popup>

    </div>
</template>

<script>
    import { WxcTabPage, WxcPanItem, Utils, WxcLoading ,WxcLightbox,WxcPopup} from "weex-ui";
    import mixins from '../../mixins'
    import {
        sharePage,toLogin
    } from "../../api/weex";
    import {getThumb,getThumbDel } from "../../api/userInfo.js";
    import {putReport,getTopic,deleteTopic} from "../../api/topic.js";
    var storage = weex.requireModule("storage");
    const modal = weex.requireModule("modal");
    export default {
        mixins:[mixins],
        components: {
            WxcTabPage,
            WxcLoading,
            WxcPopup,
            WxcLightbox
        },
        data() {
            return {
                playStatus: 0,
                isShow: false,
                pageNo: 1,
                indexPage: 0,
                url: "http://media2.myyule.cn/",
                topicList1: [],
                needSlider: true,
                tabPageHeight:'',
                lightBoxShow:false,
                isBottomShow:false,
                resIdValue:'',
                imageList: [],
                topicTag:'',
                iMobile:''
            };
        },
        beforeCreate(){
            this.fontIcon();
        },
        created() {
            //获取mobile
            storage.getItem("data", event => {
                this.topicTag = JSON.parse(event.data).topicTag;
                // this.topicTag = '测试';
                // 获取话题列表
                this.recommendSong1();

            });

            this.tabPageHeight = Utils.env.getPageHeight();
            // this.tabList = [...Array(this.tabTits.length).keys()].map(i => []);
        },
        mounted() {
            this.putPageUrlLog(1704);
        },
        methods: {
            // 混排
            // 标签以及内容长度
            contentLength(ss){
                return ss.split('')
            },
            // 截取后的字数
            richText(ss,tags){
                let tagStr = ''
                tags.forEach((value,index,array)=>{
                    tagStr+=value+2
                })
                return ss.split('').splice(0,(75-tagStr.split('').length)>0?75-tagStr.split('').length:0)
            },
            // 获取话题标签列表
            recommendSong1() {
                this.isShow = true;
                getTopic(
                    {
                        topicTag:this.topicTag,
                        topicType:"0",
                        pageNo: this.pageNo,
                        pageSize: "10",
                        sort: "new"
                    },
                    { token: this.mobile }
                )
                    .then(res => {
                        if (res.status == 0) {
                            this.isShow = false;
                            this.topicList1 =
                                this.pageNo > 1 ? this.topicList1.concat(res.object) : res.object;
                            console.log(this.topicList1);
                        } else {
                            console.log(res.desc);
                        }
                    })
                    .catch();
            },
            //点击获取标签话题
            topicTagList(item){
                this.isShow = true;
                this.pageNo=1;
                this.topicTag=item;
                getTopic(
                    {
                        topicTag:item,
                        topicType:"0",
                        pageNo: this.pageNo,
                        pageSize: "10",
                        sort: "new"
                    },
                    { token: this.mobile }
                )
                    .then(res => {
                        if (res.status == 0) {
                            this.isShow = false;
                            this.topicList1 =
                                this.pageNo > 1 ? this.topicList1.concat(res.object) : res.object;
                        } else {
                            console.log(res.desc);
                        }
                    })
                    .catch();
            },
            // 加载下一页
            fetchPage() {

                if (!this.isShow) {
                    this.pageNo += 1;
                    this.recommendSong1();
                }
            },
            //评论
            toLayout(item) {
                this.push2("/views/topic/topic_detail", { resId: item.resId, mobile: this.mobile});
            },
            toThumb(item){
                if (!this.mobile || this.mobile == "") {
                    toLogin({ loginOut: "0" });
                    return;
                }
                const _this=this;
                if(item.isThumb==1&&item.thumbNum!=0){
                    if(!_this.isShow){
                        modal.confirm(
                            {
                                message: "确定取消点赞么 ?",
                                okTitle: "确定",
                                cancelTitle: "取消",
                                duration: 0.3
                            },
                            function(value) {
                                if (value === "确定") {
                                    _this.isShow = true;
                                    getThumbDel({
                                        mobile:_this.mobile,
                                        resId:item.resId,
                                        resType:'topic'
                                    },{token:_this.mobile})
                                        .then(res => {
                                            if (res.status ==0){
                                                item.thumbNum-=1;
                                                item.isThumb=0;
                                                _this.isShow=false;
                                                modal.toast({
                                                    message:'已取消点赞',
                                                    duration:1
                                                });

                                            } else {
                                                modal.toast({
                                                    message:res.desc,
                                                    duration:1
                                                });
                                                _this.isShow = false;
                                                console.log(res.desc);
                                            }
                                        }).catch();
                                }
                            }
                        )

                    }

                }else {
                    if (!this.isShow) {
                        this.isShow = true;
                        getThumb({
                            mobile: this.mobile,
                            resId: item.resId,
                            resType:'topic'
                        }, {token: this.mobile})
                            .then(res => {
                                if (res.status == 0) {
                                    item.thumbNum += 1;
                                    item.isThumb = 1;
                                    this.isShow = false;
                                    modal.toast({
                                        message: '已点赞',
                                        duration: 1
                                    });

                                } else {
                                    modal.toast({
                                        message: res.desc,
                                        duration: 1
                                    });
                                    this.isShow = false;
                                    console.log(res.desc);
                                }
                            }).catch();
                    }
                }
            },
            //分享
            share(item) {
                const _this = this;
                let sObj = {
                    title:"分享话题："+item.topicTags[0],
                    desc: item.content,
                    web_url: _this.commonUrl+"myyuleWeb/webShare/topic/index.html?resId="+item.resId,
                    img_url:_this.url+item.user.icon,
                    sourse:"myyule"
                };
                sharePage(sObj)
            },
            //时间处理
            getDateTimeStamp (dateStr) {
                return this.getDateDiff(Date.parse(dateStr.replace(/-/gi,"/")));
            },
            getDateDiff(dateTimeStamp){
                var minute = 1000 * 60;
                var hour = minute * 60;
                var day = hour * 24;
                var halfamonth = day * 15;
                var month = day * 30;
                var now = new Date().getTime();
                var diffValue = now - dateTimeStamp;
                if(diffValue < 0){return;}
                var monthC =diffValue/month;
                var weekC =diffValue/(7*day);
                var dayC =diffValue/day;
                var hourC =diffValue/hour;
                var minC =diffValue/minute;
                var result="";
                if(monthC>=1){
                    result="" + parseInt(monthC) + "月前";
                }
                else if(weekC>=1){
                    result="" + parseInt(weekC) + "周前";
                }
                else if(dayC>=2){
                    result=""+ parseInt(dayC) +"天前";
                }
                else if(dayC>=1){
                    result=""+ "昨天";
                }
                else if(hourC>=1){
                    result=""+ parseInt(hourC) +"小时前";
                }
                else if(minC>=1){
                    result=""+ parseInt(minC) +"分钟前";
                }else
                    result="刚刚";
                return result;
            },
            //跳转部落
            toClub(item) {
                this.push2("/views/club/club_layout", { clubId: item.clubId });
            },
            //放大查看图片
            openLightBox(images,index) {
                let arr=[];
                this.imageList = [];
                let allData=[];
                images.forEach(img => {
                    let item = {
                        src: this.url+img
                    };
                    arr.push(item);
                });
                arr.forEach((img,num) => {
                    if(index==num){
                        var sliceData=arr.splice(num,arr.length-num);
                        allData=sliceData.concat(arr);

                    }
                });
                this.imageList=allData;
                this.lightBoxShow = true;
            },
            //关闭放大查看图片
            wxcLightboxOverlayClicked() {
                this.lightBoxShow = false;
            },
            //非状态组件，需要在这里关闭
            popupOverlayBottomClick() {
                this.isBottomShow = false;
            },
            //举报
            moreOpt1(item){
                console.log(item)
                this.isBottomShow =true;
                this.resIdValue=item;
                this.iMobile = item.mobile;
            },
            // 举报
            toReport(item) {
                this.isBottomShow = false;
                if (!this.mobile || this.mobile == "") {
                    toLogin({ loginOut: "0" });
                    return;
                }
                var self = this;
                modal.prompt(
                    {
                        message: "举报",
                        okTitle: "确定",
                        cancelTitle: "取消",
                        duration: 1
                    },
                    value => {
                        if (value.result == "确定") {
                            this.reportData = value.data;
                            putReport(
                                {
                                    toUsercode: "myyule_service",
                                    reason: this.reportData,
                                    mobile: this.mobile,
                                    //	          reason:'原因不详',
                                    url:this.commonUrl + "/views/topic/topic_detail?resId=" + this.resIdValue.resId
                                },
                                { token: this.mobile }
                            )
                                .then(res => {
                                    if (res.status == 0) {
                                        modal.alert({
                                            message: "举报成功",
                                            duration: 1
                                        });
                                        this.light = true;
                                    } else {
                                        this.light = true;
                                        modal.alert({
                                            message: res.desc,
                                            duration: 1
                                        });
                                    }
                                })
                                .catch();
                        } else {
                            this.light = true;
                        }
                    }
                );
            },
            close(){
                this.isBottomShow = false;
            },
            _delete() {
                if (!this.mobile || this.mobile == "") {
                    toLogin({ loginOut: "0" });
                    return;
                }
                const _this = this;
                modal.confirm(
                    {
                        message: "确定删除么 ?",
                        okTitle: "确定",
                        cancelTitle: "取消",
                        duration: 0.3
                    },
                    function(value) {
                        if (value === "确定") {
                            _this.isShow = true;
                            deleteTopic(
                                {
                                    resId: _this.resIdValue.resId,
                                    mobile: _this.mobile
                                },
                                { token: _this.mobile }
                            )
                                .then(res => {
                                    _this.isShow = false;
                                    if (res.status == 0) {
                                        _this.topicList1.forEach((value, index, array) => {
                                            if (
                                                (value.resData ? value.resData.mobile : value.mobile) ===
                                                _this.iMobile
                                            ) {
                                                _this.close();
                                                array.splice(index, 1);
                                                modal.toast({
                                                    message: "删除成功!",
                                                    duration: 1
                                                });
                                            }
                                        });
                                        _this.isBottomShow = false;
                                    } else {
                                        modal.toast({
                                            message: res.desc,
                                            duration: 1
                                        });
                                        console.log(res.desc);
                                    }
                                })
                                .catch();
                        }
                    }
                )

            },
            edit() {

                    this.push2("/views/topic/editTopic", {
                        resId: this.resIdValue.resId
                    });

            },


        }
    };
</script>
<style src="../../assets/style/index.scss">
</style>
<style scoped>
    .font-26{
        font-size: 26px;
    }
    .font-22{
        font-size: 22px;
    }
    .font-28{
        font-size: 28px;
    }
    .color-pink{
        color: #EE1C41;
    }
    .editorSong {
        position: relative;
        background-color: #fff;
    }
    .iconfont {
        font-family: iconfont;
    }
    /*头部*/
    .header {
        width: 750px;
        padding-bottom: 22px;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 22px;
        justify-content: space-between;
        align-items: center;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #ccc;
        flex-direction: row;
        backgroud-color:white;
    }
    .re_icon {
        color: #ee1c41;
        font-size: 40px;
        font-weight: bold;
    }
    .msc_icon {
        color: #ee1c41;
        font-size: 48px;
    }
    /*头部 结束*/
    .h-title {
        font-size: 36px;
        color: #333;
        font-weight: bold;
    }
    /*列表开始*/
    .musicListBox {
        width: 750px;
    }
    .musicList {
        width: 750px;
        margin-top: 30px;
    }

    .heart {
        width: 130px;
        height: 56px;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-width: 1px;
        border-style: solid;
        border-color: rgba(236, 236, 236, 1);
    }

    .heart-view {
        width: 50px;
        height: 50px;
    }
    .heart-span {
        line-height: 50px;
        color: #8A8A8A;
        font-size: 24px;
    }

    .topic-footer{
        width:650px;
        padding-top:16px;
        padding-bottom:16px;
        flex-direction:row;
        justify-content: space-between;
    }
    .topic-top{
        width:650px;
        flex-direction: row;
        justify-content:space-between;

    }
    .pic{
        width: 94px;
        height: 94px;
        border-bottom-left-radius: 50px;
        border-bottom-right-radius: 50px;
        border-top-left-radius: 50px;
        border-top-right-radius:50px;
    }
    .picImg{
        width: 200px;
        height: 200px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        border-top-left-radius: 8px;
        border-top-right-radius:8px;
    }

    .pic-list{
        width:650px;
        margin-top:40px;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: flex-start;

    }
    .topic-user{
        flex-direction: row;
        align-items: flex-start;
    }
    .topic-icon{
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }

    .row{
        padding-left:30px;
        padding-right:10px;
        padding-top:35px;
    }
    .topicRow{

        margin-top:38px;
        margin-bottom: 10px;
        margin-left: 30px;
        margin-right: 30px;
        background-color: #ffffff;
        box-shadow: 3px 5px 5px 5px #d9d9d9;
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
    }
    .topic-time {
        margin-left: 20px;
    }
    .hours{
        color:#666666;
        line-height: 39px;
    }
    .topic-middle{
        margin-top:16px;
        padding-bottom:30px;
        border-bottom-width: 1px;
        border-bottom-style:dashed;
        border-bottom-color:#ccc;
        width:650px;
        flex-direction: column;

    }
    .topic-btn{
        max-width:160px;
        lines:1;
        text-overflow:ellipsis;
        padding-top:5px;
        padding-bottom: 5px;
        padding-right: 10px;
        padding-left: 10px;
        text-align:center;
        border-style: solid;
        border-color: #EE1C41;
        border-width: 1px;
        background-color:white;
        /*margin-top: 15px;*/
        color:#EE1C41;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        border-top-left-radius: 5px;
        border-top-right-radius:5px;
        margin-right: 10px;

    }
    .topic-see{
        color: #828282;
    }

    .picLocation{
        width: 50px;
        height: 50px;
        margin-right:16px;

    }
    .userName{
        margin-bottom:16px;
        color: #3B3B3B;
        width:300px;
        lines:1;
        text-overflow:ellipse;
    }
    .topic-number{
        flex-direction: column;
        align-items: flex-end;
        margin-top: -10px;
    }
    .botMoreOpt {
        width: 750px;
    }
    .optItems {
        margin-bottom: 10px;
    }
    .optDesc {
        color: #000;
        text-align: center;
        line-height: 112px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #ccc;
        background-color: #fff;
    }
    .clubNames{
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 2px;
    }
    .topic-tag {
        line-height: 39px;
    }
    .tag-content {
        width: 648px;
        flex-direction: row;
        align-items: flex-end;
        flex-wrap:wrap;
    }
    .topic-text {
        width: 650px;
        margin-bottom: 24px;
        flex-direction: row;
    }
    .imgIndex{
        margin-right:22px;
    }
</style>
