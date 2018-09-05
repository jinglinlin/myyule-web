<template>
  <div :class="[switchKey?'active':'']" class="switch">
    <transition name="move">
      <div :class="['switch-inner',switchKey?'inner-active':'']"></div>
    </transition>
  </div>
</template>
<script>
export default {
  props:{
    switchKey:{}
  }
}
</script>
<style scoped>
  .switch{
    position:relative;
    border-bottom-left-radius: 45px;
    border-bottom-right-radius: 45px;
    border-top-left-radius: 45px;
    border-top-right-radius: 45px;
    width:103px;
    height:55px;
    background-color:#dfdfdf;
  }
  .switch-inner{
    position:absolute;
    background-color:#fff;
    border-width: 1px;
    border-style: solid;
    border-color: #dfdfdf;
    top:0;
    left:0;
    width:53px;
    height:53px;
    border-bottom-left-radius: 90px;
    border-bottom-right-radius: 90px;
    border-top-left-radius: 90px;
    border-top-right-radius: 90px;
    transition:all 0.2s linear;
  }
  .active{
    border-width: 1px;
    border-style: solid;
    border-color: #EE1C41;
    background-color:#EE1C41;
  }
  .switch-inner{

    transform:translateX(0px);
  }
  .inner-active{
    transform:translateX(49px);
  }
</style>
