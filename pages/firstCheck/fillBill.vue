<template>
  <view>
    <navBar :title="navBar.title" :is-back="navBar.isBack" />
    <!-- navBar -->
    <view class="u-page">
      <view class="basic-box fill-info">
        <view class="fill-item">
          <text class="name">工&ensp;单&ensp;号：</text>
          <text class="text">DFAD454TETQQWTY</text>
        </view>
        <view class="fill-item">
          <text class="name">工&ensp;&ensp;&ensp;&ensp;序：</text>
          <text class="text">DAG46G</text>
        </view>
        <view class="fill-item">
          <text class="name">批次数量：</text>
          <text class="text">45</text>
        </view>
      </view>
      <!-- basic -->
      <view class="switch">
        <u-icon
          class="icon"
          custom-prefix="custom-icon"
          name="left-arrow"
          color="#000"
          size="50"
        />
        <view class="paging">1/5</view>
        <u-icon
          class="icon"
          custom-prefix="custom-icon"
          name="right-arrow"
          color="#000"
          size="50"
        />
      </view>
      <!-- 切换 -->
      <view class="basic-box">
        <customForm :form="formData" :formList="formList" :rules="rules" />
      </view>
      <!-- 组件 -->
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      name: "FillBill",
      navBar: {
        title: "首检填单",
        isBack: true,
      },
      formData: {
        name: "",
        name2: "",
        sex: "",
        rd: "",
        ch1:[],
        ch2:[]
      },
      formList: [
        { label: "姓名1", props: "name", type: "input" },
        { label: "姓名2", props: "name2", type: "textarea" },
        {
          label: "性别3",
          props: "sex",
          type: "select",
          optionList: [
            { text: "下拉框1", value: "001" },
            { text: "下拉框2", value: "002" },
          ],
          change(that){
            console.log('this:::::::::::',that);
          }
        },
        {
          label: "单选框",
          props: "rd",
          type: "radio",
          radioList: [
            { name: "单选框1", value: "001" },
            { name: "单选框2", value: "002" },
          ],
        },
        {
          label: "复选框1",
          props: "ch",
          type: "checkbox",
          checkboxList: [
            {
              name: "荔枝1",
              checked: false,
            },
            {
              name: "香蕉1",
              checked: false,
            },
            {
              name: "橙子1",
              checked: false,
            },
            {
              name: "草莓1",
              checked: false,
            },
          ],
        },
        {
          label: "复选框2",
          props: "ch2",
          type: "checkbox",
          checkboxList: [
            {
              name: "荔枝2",
              checked: false,
            },
            {
              name: "香蕉2",
              checked: false,
            },
            {
              name: "橙子2",
              checked: false,
            },
            {
              name: "草莓2",
              checked: false,
            },
          ],
        },
      ],
      rules: [],
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.fill-info {
  padding: 30rpx;
  .fill-item {
    display: flex;
    line-height: 1.75;
  }
  .name {
    margin-right: 10rpx;
    width: 140rpx;
    color: $font-light-gray;
    // background: brown;
  }
  .text {
    flex: 1;
  }
}
.switch {
  margin: 0 15rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .paging {
    flex: 1;
    text-align: center;
  }
}
</style>
