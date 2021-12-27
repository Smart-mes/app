<template>
  <view>
    <u-navbar
      :title="title"
      :is-back="isBack"
      :title-color="color"
      :title-size="size"
      :height="height"
      :background="background"
      :title-bold="titleBold"
    >
      <view slot="left">
				<slot name="navbarLeft"></slot>
			</view>
      <view slot="right">
        <slot name="navbarRight"></slot>
      </view>
    </u-navbar>
  </view>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    title: {
      type: String,
      default: "",
    },
    isBack: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "#333",
    },
    size: {
      type: String,
      default: "36",
    },
    height: {
      type: String,
      default: "50",
    },
    background: {
      type: Object,
      default: ()=> {return {backgroundColor:'#fff'}}
    },
    titleBold: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
