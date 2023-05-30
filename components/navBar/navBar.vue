<template>
  <u-navbar
    v-bind="$attrs"
    :customBack="customBack"  
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
    customBack: {
				type: Function,
				default:null
			}
  },

};
</script>
