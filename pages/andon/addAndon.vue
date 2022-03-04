  <template>
  <view>
    <navBar :title="navBar.title" :is-back="navBar.isBack" />
    <!--navBar  -->
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
import { mapState, mapActions } from "vuex";
export default {
  name: "AddAndon",
  data() {
    return {
      navBar: {
        title: "添加安灯登记",
        isBack: true,
      },
      // from
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
          sheetShow: false,
          disabled: true,
          optionList: [],
        },
        { label: "工单", props: "orderNo", type: "input", disabled: true },
        {
          label: "产品",
          props: "productCode",
          type: "select",
          sheetShow: false,
          disabled: true,
          optionList: [],
        },
        {
          label: "工位",
          props: "stationCode",
          type: "select",
          sheetShow: false,
          optionList: [{value: "",label: "没有工位"}]
        },
        {
          label: "事件",
          props: "event",
          type: "select",
          sheetShow: false,
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
  computed: {
    ...mapState(["line", "userInfo"]),
  },
  onLoad() {
    this.lineCodeHandle();
    // 请求
    this.getDict({url: "/api/Dictionary",data: { keys: "BProduct|BStationList" }}).then(({ BProduct, BStationList }) => {
      this.BProductDict = BProduct;
      this.BStationDict = BStationList;
    });

    this.getDict({url: "/api/SDataTranslation", data: { searchText: "P_AndonList" }}).then((res) => {
      res
        .filter((x) => x.fieldName === "event")
        .forEach(({ value, label }) =>this.formList[4].optionList.push({ value, label }));
    });
  },
  onReady() {
    this.orderNoAjax()
      .then((res) => {
        if (res.length > 0) this.formData.orderNo = res[0].orderNo;
      })
      .then(() => {
        this.productAjax().then((res) => {
          if (res.length) {
            const {productCode}=res[0]
            this.formData.productCode = this.BProductDict[productCode];
            this.formSeletData.productCode = productCode;
          }
        });
      });

    this.stationAjax().then((res) => {
      res.map(({ stationCode }) => {
        this.formList[3].optionList.push({value: stationCode,label: this.BStationDict[stationCode]});
      });
    });
  },
  methods: {
    ...mapActions(["getDict"]),
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
        .catch(() => (this.btnLoading = false));
    },
  },
};
</script>

<style>
</style>
