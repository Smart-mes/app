const mixin = {
  methods: {
    hideKeyboard() {
      // #ifdef APP-PLUS
          uni.hideKeyboard();
			// #endif
    },
  }
}
export default mixin;
