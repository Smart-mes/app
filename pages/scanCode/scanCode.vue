<template>
  <view class="scanCode">
    <ex-TnavBar :title="navBar.title" :is-back="navBar.isBack" title-bold/>
    <!-- nav -->
    <view class="scanForm">
      <u-form :model="form" ref="uForm">
        <u-form-item label="编码" prop="code">
          <view class="row">
            <view class="col-input">
              <u-input v-model="form.code" />
            </view>
            <view class="col-icon" @tap="scan">
              <u-icon name="scan" size="40" />
            </view>
          </view>
        </u-form-item>
        <u-form-item label="标题" prop="name">
          <u-input v-model="form.name" />
        </u-form-item>
        <u-form-item label="描述" prop="intro">
          <u-input v-model="form.intro" />
        </u-form-item>
      </u-form>
      <u-button type="primary" @click="submit">提交</u-button>
    </view>
    <!-- form -->
  </view>
</template>

<script>
export default {
  name:"scanCode",
  data() {
    return {
      navBar: {
        title: "扫描查询",
        isBack: true,
      },
      form: {
        code: "",
        name: "",
        intro: "",
      },
      rules: {},
    };
  },
  methods: {
    scan() {
      uni.scanCode({
        success: (res) => {
          const { scanType, result } = res;
          this.form.code = result;
          console.log("this.form:", this.form);
          console.log("条码类型：" + res.scanType);
          console.log("条码内容：" + res.result);
        },
        fail: () => {},
      });
    },
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          console.log("验证通过");
        } else {
          console.log("验证失败");
        }
      });
    },
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
};
</script>
<style lang="scss" scoped>
.scanCode {
  min-height: 100%;
  
}

.scanForm {
  background-color: $white-color;
  border-radius: 15px;
  margin:15rpx;
  padding:25rpx  15px;
  .row {
    display: flex;
    flex-direction: row;
    .col-input {
      width: 510rpx;
    }
    .col-icon {
      padding: 0 10rpx;
    }
  }
}
</style>
