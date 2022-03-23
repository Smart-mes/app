<template>
  <view class="failureForm">
    <u-navbar
      :height="50"
      :title="'报障_' + stationName"
      :is-back="navbar.isBack"
      :background="navbar.background"
    />
    <view class="form-box">
      <u-form :model="form" :label-width="140" ref="uForm">
        <u-form-item label="故障项" prop="faultphenomenonCode">
          <u-input
            type="select"
            :select-open="faultSheetShow"
            v-model="form.faultphenomenonCode"
            placeholder="请选择故障项"
            @click="faultSheetShow = true"
          />
        </u-form-item>
        <u-form-item label="上报级别" prop="grade">
          <u-input
            type="select"
            :select-open="gradeSheetShow"
            v-model="form.grade"
            placeholder="请选择上报级别"
            @click="gradeSheetShow = true"
          />
        </u-form-item>
        <u-form-item label="备注" prop="remarks">
          <u-input type="textarea" :height="200" v-model="form.remarks" />
        </u-form-item>
      </u-form>
      <u-button type="primary" @click="submit">提交</u-button>
    </view>
    <!-- u-action-sheet -->
    <u-action-sheet
      :list="faultSheetList"
      :cancel-btn="true"
      v-model="faultSheetShow"
      @click="faultSheetCallback"
    />
    <u-action-sheet
      :list="gradeSheetList"
      :cancel-btn="true"
      v-model="gradeSheetShow"
      @click="gradeSheetCallback"
    />
    <u-toast ref="uToast" />
  </view>
</template>

<script>
export default {
  name: "FailureForm",
  data() {
    return {
      navbar: {
        background: {
          backgroundColor: "#ffffff",
        },
        isBack: true,
      },
      // 参数
      machineCode: "",
      stationName: "",

      form: {
        faultphenomenonCode: "",
        grade: "",
        remarks: "",
      },
      rules: {
        faultphenomenonCode: [
          {
            required: true,
            message: "请输入故障项",

            trigger: ["change", "blur"],
          },
        ],
        grade: [
          {
            required: true,
            message: "请输入上报级别",
            trigger: ["change", "blur"],
          },
        ],
        remarks: [
          {
            required: true,
            message: "请输入备注",
            trigger: ["change", "blur"],
          },
        ],
      },
      faultSheetList: [],
      faultSheetShow: false,
      //  上级
      gradeSheetList: [
        {
          value: 1,
          text: "一级",
        },
        {
          value: 2,
          text: "二级",
        },
        {
          value: 3,
          text: "三级",
        },
      ],
      gradeSheetShow: false,
    };
  },
  onLoad(option) {
    this.machineCode = option.machineCode;
    this.stationName = option.stationName;

    this.faultAjax();
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  computed: {
    faultCode() {
      const faultObj = {};
      this.faultSheetList.map((gradeItem) => {
        const { text, value } = gradeItem;
        faultObj[text] = value;
      });
      return faultObj;
    },
    gradetCode() {
      const gradeObj = {};
      this.gradeSheetList.map((gradeItem) => {
        const { text, value } = gradeItem;
        gradeObj[text] = value;
      });
      return gradeObj;
    },
  },
  methods: {
    submit() {
      this.$refs.uForm.validate((valid) => {
        valid && this.faultFormAjax();
      });
    },
    faultSheetCallback(index) {
      this.form.faultphenomenonCode = this.faultSheetList[index].text;
    },
    gradeSheetCallback(index) {
      uni.hideKeyboard();
      this.form.grade = this.gradeSheetList[index].text;
    },
    faultAjax() {
      this.$http
        .request({
          url: "/api/PMachineState/GetMachineFaultphenomenon",
          method: "GET",
          data: {
            machineCode: this.machineCode,
          },
        })
        .then((res) => {
          this.faultSheetList = res.map((faultItem) => {
            const { faultphenomenonCode: value, faultphenomenonName: text } =
              faultItem;
            return { value, text };
          });
        });
    },
    faultFormAjax() {
      const { faultphenomenonCode, grade, remarks } = this.form;
      // 报障提交
      this.$http
        .request({
          url: "/api/PMachineState/AddMachineException",
          method: "POST",
          data: {
            machineCode: this.machineCode,
            faultphenomenonCode: this.faultCode[faultphenomenonCode],
            grade: this.gradetCode[grade],
            remarks,
          },
        })
        .then(
          () => this.$refs.uToast.show({title: "提交成功",type: "success",url: "/pages/device/failure" })
        )
    },
  },
};
</script>

<style lang="scss" scoped>
.failureForm {
  min-height: 100%;
}

.form-box {
  margin: 15rpx 15rpx;
  padding: 30rpx;
  border-radius: 10rpx;
  background-color: $white-color;
}
</style>
