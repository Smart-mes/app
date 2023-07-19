<template>
  <view :class="[radius?'radius':'rightAngle']">
    <slot></slot>
  </view>
</template>
<script>
export default{
  name:'Box',
  props:{
    radius:{type:Boolean,default:true}
  }
}
</script>
<style lang="scss" scoped>
  .radius{
    margin:15rpx 15rpx;
    padding: 30rpx;
    border-radius: 10rpx;
    background-color: $white-color;
  }
  .rightAngle{padding:30rpx;background-color: $white-color; margin:15rpx 0;}
</style>