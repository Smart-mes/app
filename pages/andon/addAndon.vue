<template>
  <view>
    <ex-TnavBar :title="navBar.title" :is-back="navBar.isBack" />
    <!--navBar  -->
    <view class="u-page">
      <view class="basic-box">
        <customForm
          :async="isAsyncF" 
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
  name: "AddAndon",
  data() {
    return {
      navBar: {
        title: "添加安灯登记",
        isBack: true,
      },
      // from
      isAsyncF:false,
      btnLoading: false,
      formSeletData: {
        lineCode: "",
        productCode: "",
        stationCode: "",
        event: "",
      },
      formData: {
        lineCode: "", //产线
        orderNo: "", //工单
        productCode: "", //产品
        stationCode: "", //工位
        event: "", //事件
        description: "", //事件说明
      },
      formList: [
        {
          label: "线别",
          props: "lineCode",
          type: "select",
          selectShow: false,
          disabled: true,
          optionList: [],
        },
        { label: "工单", props: "orderNo", type: "input", disabled: true },
        {
          label: "产品",
          props: "productCode",
          type: "select",
          selectShow: false,
          disabled: true,
          optionList: [],
        },
        {
          label: "工位",
          props: "stationCode",
          type: "select",
          selectShow: false,
          optionList: [{value: "",label: "没有工位"}]
        },
        {
          label: "事件",
          props: "event",
          type: "select",
          selectShow: false,
          optionList: [],
        },
        { label: "事件说明", props: "description", type: "textarea" },
      ],
      rules: {
        orderNo: [{ required: true,message: "不能为空",trigger: "blur,change" }],
        orderNo: [ {required: true, message: "不能为空", trigger: "blur,change" }],
        productCode: [{required: true,message: "不能为空",trigger: "blur,change"}],
        event: [{required: true, message: "不能为空",trigger: "blur,change"}],
      },
      // 字典
      BProductDict: {},
      BStationDict: {},
    };
  },
  computed: {...mapState(["line", "userInfo"])},
   async onLoad() {
    // 字典   
    const { BProduct, BStationList }=await this.$http.request({url:"/api/Dictionary",method: "GET", data:{ keys: "BProduct|BStationList" }}) 
    this.BProductDict = BProduct;
    this.BStationDict = BStationList;
    // 表单赋值
    await this.lineCodeHandle();
    const andonList=await this.$http.request({url: "/api/SDataTranslation", method: "GET",  data: { searchText: "P_AndonList" }});
    const orderList=await this.orderNoAjax();
    const productList= await  this.productAjax();
    const stationList=await this.stationAjax()
    
    this.formList[4].optionList=andonList.filter((x) => x.fieldName === "event").map(({ value, label }) =>({ value, label }));
    if (orderList.length){
      this.formData.orderNo = orderList[0].orderNo; 
    }
    if (productList.length) {
          const {productCode}=productList[0]
          this.formData.productCode = this.BProductDict[productCode];
          this.formSeletData.productCode = productCode;
    }
    this.formList[3].optionList=stationList.map(({ stationCode }) =>({value: stationCode,label: this.BStationDict[stationCode]}));
    this.isAsyncF=true;
  },
  methods: {
    selectChange(propsType, [{ value, label }]) {
      this.formData[propsType] = label;
      this.formSeletData[propsType] = value;
    },
    getFormData(formData) {
      formData.event += "";
      this.addAjax({...formData,state: 1, empCode: this.userInfo.empCode,beginTime: new Date()});
    },
    // 请求
    orderNoAjax() {
      return this.$http.request({
        url: "/api/POrderInLine",
        method: "GET",
        data: { lineCode: this.formSeletData.lineCode },
      });
    },
    productAjax() {
      return this.$http.request({
        url: "/api/PWorkOrder",
        method: "GET",
        data: { orderNo: this.formData.orderNo },
      });
    },
    stationAjax() {
      return this.$http.request({
        url: "/api/BStationList",
        method: "GET",
        data: { lineCode: this.formSeletData.lineCode },
      });
    },
    lineCodeHandle() {
      const { label, value } = this.line[1];
      this.formList[0].optionList = [{ label, value }];
      this.formData.lineCode = label;
      this.formSeletData.lineCode = value;
    },
    //添加
    addAjax(formData) {
      this.btnLoading = true;
      this.$http.request({ url: "/api/PAndonList", method: "POST", data: formData })
        .then(() => {
          this.btnLoading = false;
          this.$refs.uToast.show({title: "提交成功",type: "success",url: "/pages/andon/andon"});
        })
        .catch(() =>{
          this.btnLoading = false;
        });
    },
  },
};
</script>

<style>
</style>
