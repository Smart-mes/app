<template>
  <u-navbar
  :title="title"
    :is-back="isBack"
    :title-color="color"
    :title-size="size"
    :background="background"
    :title-bold="titleBold"
    :borderBottom="borderBottom"
      
    >
    <slot></slot>
    <view slot="left">
      <slot name="left"></slot>
    </view>
    <view slot="right">
      <slot name="right"></slot>
    </view>
    </u-navbar>
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
      default: true,
    },
    color: {
      type: String,
      default: "#333",
    },
    size: {
      type: String,
      default: "32",
    },
    background: {
      type: Object,
      default: () => {
        return { backgroundColor: "#fff" };
      },
    },
    titleBold: {
      type: Boolean,
      default: false,
    },
    borderBottom: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
