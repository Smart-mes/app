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
        <customForm ref="TPMform" :form="formData" :formList="formList" :rules="rules">
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
   name: "TPMbill",
  data() {
    return {  
      navBar: {
        title: "保养填单",
        isBack: true,
      },
      // form
      submitDisabled:false,
      formData: {
        checkItems: [],
        description:""
      },
      formList: [
        {
          label: "维保项目",
          props: "checkItems",
          type: "checkbox",
          checkboxList: [],
        },
        {
          label:"维保说明",
          props:"description",
          type:"textarea",
        }
      ],
      rules: {
        checkItems: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur,change",
          },
        ]
      },
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
    this.formList[0].disabled=!!this.pageType;
    this.formList[1].disabled=!!this.pageType;
    this.taskAjax(taskCode)
      .then(([data]) => {
        this.taskState = data;
        this.headerData = JSON.parse(data.headerData);
      })
      .then(() => {
        this.templateAjax().then((res) => {
          // form
          const bodyData= JSON.parse(this.taskState.bodyData)||{};
          for(let key in bodyData){
            this.formData[key]=bodyData[key];
          }
          // formList
          res.forEach((el) => {
            this.formList[0].checkboxList.push({
              name: el.label,
              checked: this.formData.checkItems.includes(el.label),
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
      const formData = { ...this.taskState, bodyData: JSON.stringify(this.formData)};
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
        this.$refs.TPMform.validateForm().then((valid) => {
          if (valid) {
           this.BillTaskAjax();
          }
        });
    },
    BillTaskAjax(){
      const taskState = { ...this.taskState, bodyData: JSON.stringify(this.formData)};
      const taskLog = {
          taskCode: taskState.taskCode,
          roleId: taskState.assignRole,
          empCode: taskState.receiveEmp,
          step: taskState.step,
          result: 1,
          description: ''
        }

      this.$http.request({
          url: '/api/BillTask/Submit', 
            method: "POST",
            data: { taskState, taskLog }
          }).then(() => {             
              this.submitDisabled=true;
              this.$refs.uToast.show({ title: "提交成功",type: "success",url: "/pages/TPM/TPMhistory" });
          }).catch(()=>{
              this.submitDisabled=false;
              this.$refs.uToast.show({ title: "提交失败", type: "error" })
      }); 

    }
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
