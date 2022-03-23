<template>
  <view>
    <navBar :title="navBar.title" :is-back="navBar.isBack" />
    <!-- navBar -->
    <view class="u-page">
      <view class="basic-box">
        <customForm
          :form="formData"
          :seletform="formSeletData"
          :formList="formList"
          :rules="rules"
          :loading="btnLoading"
          @selectChange="selectChange"
          @getFormData="getFormData"
        />
      </view>
    </view>
    <!-- page -->
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  name:"CreateBill",
  data() {
    return {
      navBar: {title: "添加首检任务",isBack: true},
      flowId:'',
      billCode:'FAI',
      // form
      btnLoading:false,
      formData: {
        lineCode: "",
        orderNo: "",
        pid: "",
        lotQty:"1"
      },
      formSeletData: {
        lineCode: "",
        pid: "",
      },
      formList: [
        {
          label: "线别",
          props: "lineCode",
          type: "select",
          sheetShow: false,
          disabled: true,
          optionList: [],
        },
        { label: "工单", props: "orderNo", type: "input", disabled: true },
        {
          label: "首检工序",
          props: "pid",
          type: "select",
          sheetShow: false,
          optionList: [],
        },
        { label: "批次数量", props: "lotQty", type: "input" },
      ],
      rules: {
        lineCode: [{required: true, message: "不能为空",trigger: "blur,change"}],
        orderNo: [{required: true,message: "不能为空",trigger: "blur,change"}],
        pid: [ {required: true, message: "不能为空",trigger: "blur,change"}],
        lotQty: [{required: true,message: "不能为空",trigger: "blur,change"}],
      },
    };
  },
  computed: {
    ...mapState(["line","userInfo"]),
  },
  onLoad() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.formData.lineCode=this.line[1].label;
      this.formSeletData.lineCode=this.line[1].value;
      this.orderAjax().then(()=>this.pidAjax());
       
    },
    orderAjax(){
     return this.$http.request({
        url: "/api/POrderInLine",
        method: "GET",
        data: { lineCode: this.line[1].value},
      })
      .then(res=>{
          if(res.length){
            this.formData.orderNo=res[0].orderNo;
            this.flowId=res[0].flowId
          }
      })
    },
    pidAjax(){
     return this.$http.request({
        url: "/api/BProcessFlowDetail/QualityProces",
        method: "GET",
        data: {type:this.billCode,flowId:this.flowId},
      })
       .then(res=>this.formList[2].optionList=res);      
    },
    // form
    selectChange(propsType, [{ value, label }]) {
      if (propsType && value && label) {
        this.formData[propsType] = label;
        this.formSeletData[propsType] = value;
      }
    },
    getFormData(formData) {
     if (!this.flowId) {
        return void this.$refs.uToast.show({ title: "缺少工单的工艺信息", type: "error" });
      }
      const taskState = {
          billCode: this.billCode,
          createEmp: this.userInfo.empCode,
          step: 1,
          assignEmp: this.userInfo.empCode,
          receiveEmp: this.userInfo.empCode,
          state: 1,
          headerData: JSON.stringify({
              lineCode: { label: '产线', value: formData.lineCode, displayValue:this.formData.lineCode},
              orderNo: { label: '工单', value: formData.orderNo, displayValue: this.formData.orderNo },
              pid: { label: '工序', value: formData.pid, displayValue: this.formData.pid },
              lotQty: { label: '批次数量', value: formData.lotQty, displayValue: formData.lotQty}
          })
      };
     const taskTitles = [
          { prop: 'lineCode', value: formData.lineCode },
          { prop: 'pid', value: formData.pid }
      ];
      this.addAjax({taskState,taskTitles});

    },
    addAjax(parame) {
      this.btnLoading=true;
      this.$http
        .request({ url: "/api/BillTask/Create", method: "POST", data: parame })
        .then(() =>{
          this.btnLoading=false;
          this.$refs.uToast.show({ title: "提交成功",type: "success",url: "/pages/firstCheck/firstCheck"});
        })
        .catch(() =>this.btnLoading=false);
    }, 
  },
};
</script>

<style>
</style>
