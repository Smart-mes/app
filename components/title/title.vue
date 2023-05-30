<template>
    <view class="title">
    <view class="title-left">
      <u-section :title="title"  font-size="30" :show-line="false" :right="false"/>
    </view>
    <view class="title-right" ><slot name="right"></slot> </view>
  </view>
</template>
<script>
export default {
  name:'Title',
  props:{
     title:{type:String,default:''}
  }
}
</script>
<style lang="scss" scoped>
.title{
  display: flex;
  &-left{flex: 1;}
  &-right{text-align: right; font-size:$font-26;color:$font-gray;}
}

</style>