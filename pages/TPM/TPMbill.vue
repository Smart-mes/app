<template>
  <view>
    <navBar :title="navBar.title" :is-back="navBar.isBack" />
    <!-- navBar -->
    <view class="u-page">
      <view class="basic-box fill-info">
        <view
          class="fill-item"
          v-for="(headerItem, key1) in headerData"
          :key="key1"
        >
          <text class="name">{{ headerItem.label }}: </text>
          <text class="text">{{ headerItem.displayValue }}</text>
        </view>
      </view>
      <!-- basic -->
      <view class="basic-box">
        <customForm :form="formData" :formList="formList" :rules="rules">
          <view slot="submit">
            <view class="btn">
              <u-row gutter="20">
                <u-col span="6">
                  <u-button @click="save" :disabled="!!pageType||submitDisabled">保存</u-button>
                </u-col>
                <u-col span="6">
                  <u-button type="primary" @click="submit" :disabled="submitDisabled">提交</u-button>
                </u-col>
              </u-row>
            </view>
          </view>
        </customForm>
      </view>
      <!-- 组件 -->
    </view>
    <!-- page -->
     <u-toast ref="uToast" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      name: "TPMbill",
      navBar: {
        title: "保养填单",
        isBack: true,
      },
      // form
      submitDisabled:false,
      formData: {
        maintain: [],
      },
      formList: [
        {
          label: "维保项目",
          props: "maintain",
          type: "checkbox",
          checkboxList: [],
        },
      ],
      rules: {},
      // 保养
      pageType:"",
      billCode: "EM",
      taskState: {},
      headerData: {},
    };
  },
  onLoad(option) {
    const { taskCode, type } = option;
    if (type) {
      this.pageType = type;
      this.submitDisabled=true;
      this.navBar.title = "查看保养填单";
    } else {
      this.navBar.title = "保养填单";
    }

    this.taskAjax(taskCode)
      .then(([data]) => {
        this.taskState = data;
        this.headerData = JSON.parse(data.headerData);
      })
      .then(() => {
        this.templateAjax().then((res) => {
          this.formData.maintain = JSON.parse(this.taskState.bodyData)||[]
          res.forEach((el) => {
            this.formList[0].checkboxList.push({
              name: el.label,
              checked: this.formData.maintain.includes(el.label),
              disabled:!!this.pageType
            });
          });
        });
      });
  },
  methods: {
    // 请求
    taskAjax(taskCode) {
      return this.$http.request({
        url: "/api/BTaskState",
        method: "GET",
        data: { taskCode },
      });
    },
    templateAjax() {
      const { modelCode, level } = this.headerData;
      return this.$http.request({
        url: "/api/BMachineMaintainProgram/WithDetail",
        method: "GET",
        data: { modelCode: modelCode.value, level: level.value },
      });
    },
    //form
    save() {
      const formData = { ...this.taskState, bodyData: JSON.stringify(this.formData.maintain)};
      this.$http.request({
        url: '/api/BillTask/Save', 
          method: "POST",
          data: formData
        }).then(() => {
           this.$refs.uToast.show({ title: "保存成功",type: "success"});
        })
        .catch(() =>{
          this.$refs.uToast.show({ title: "保存失败", type: "error" })
      })

    },
    submit() {
      const taskState = { ...this.taskState, bodyData: JSON.stringify(this.formData.maintain)};
      const taskLog = {
          taskCode: taskState.taskCode,
          roleId: taskState.assignRole,
          empCode: taskState.receiveEmp,
          step: taskState.step,
          result: 1,
          description: ''
        }

      debugger
      this.$http.request({
          url: '/api/BillTask/Submit', 
            method: "POST",
            data: { taskState, taskLog }
          }).then(() => {             
              this.submitDisabled=true;
              this.$refs.uToast.show({ title: "提交成功",type: "success"});
          }).catch(()=>{
              this.submitDisabled=false;
              this.$refs.uToast.show({ title: "提交失败", type: "error" })
      }); 
    },
  },
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
  }
  .text {
    flex: 1;
  }
}
</style>
