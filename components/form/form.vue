<template>
  <view>
    <u-form :model="form" ref="uForm" :label-width="labelWidth">
      <u-form-item
        v-for="(formItem, index) in formList"
        :key="formItem.props"
        :label="formItem.label"
        :prop="formItem.props"
        :border-bottom="formItem.borderBottom?true:formItem.borderBottom"
        :required="rules?!!rules[formItem.props]:false" 
      >     
        <block v-if="inputType(formItem.type)">
          <u-input
            v-model="form[formItem.props]"
            :type="formItem.type"
            :disabled="formItem.disabled"
            :placeholder="formItem.placeholder"
            :class="{ disabled: !!formItem.disabled }"
          />
          <u-icon class="icon" v-if="formItem.suffixIcon" custom-prefix="custom-icon" :name="formItem.suffixIcon" size="38" @click="$emit('icon-click', formItem.props)"/>
        </block>
        <block v-else-if="formItem.type === 'select'">
          <u-input
            type="select"
            :select-open="formItem.sheetShow"
            :placeholder="formItem.placeholder"
            :disabled="formItem.disabled"
            v-model="form[formItem.props]"
            @click="selectClick(formItem.props, index)"
            :class="{ disabled: !!formItem.disabled }"
          />
        </block>
        <block v-else-if="formItem.type === 'checkbox'">
          <u-checkbox-group
            :class="{ disabled: !!formItem.disabled }"
            @change="formGroupChange"
          >
            <u-checkbox
              v-for="(checkItem, key) in formItem.checkboxList"
              :key="key"
              :name="checkItem.name"
              v-model="checkItem.checked"
              :disabled="checkItem.disabled"
              @change="formChange(formItem.props)"
            >
              {{ checkItem.name }}
            </u-checkbox>
          </u-checkbox-group>
        </block>
        <block v-else-if="formItem.type === 'radio'">
          <u-radio-group
            :class="{ disabled: !!formItem.disabled }"
            v-model="form[formItem.props]"
            style="width: 100%;"        
          >
            <u-radio
              v-for="radioItem in formItem.radioList"
              :key="radioItem.name"
              :name="radioItem.name"
              :disabled="radioItem.disabled"
              style="width: 50%;" 
            >
              {{ radioItem.label }}
            </u-radio>
          </u-radio-group>
        </block>
      </u-form-item>
    </u-form>
    <view v-show="!buttonHide" class="submit">
      <slot name="submit">
        <u-row gutter="20">
            <u-col span="6"><u-button class="left-btn" size="default"  @click="resetForm()">重置</u-button></u-col>
            <u-col span="6"><u-button class="right-btn" type="primary" :loading="loading"  @click="submitForm()"> 提交 </u-button></u-col>
        </u-row>    
      </slot>
    </view>
    <u-select
      v-model="selectShow"
      mode="single-column"
      :list="list"
      @confirm="selectconfirm"
    />
  </view>
</template>
<script>
export default {
  name: "Form",
  props: {
    labelWidth: {type: String,default: "130"},
    form: {type: Object,default: null},
    seletform: {type: Object,default: null},
    formList: {type: Array,default: null},
    rules: {type: Object,default: null},
    disabled: {type: Boolean,default: false},
    loading: {type: Boolean,default: false},
    buttonHide: {type: Boolean,default: false},
    async:{type:Boolean,default:false}
  },
  data() {
    return {
      propsType: "",
      cloneForm:{},
      // form: {},
      list: [],
      show: false,
      // sheet
      selectShow: false,
      selectIndex: 0,
    };
  },
  mounted() {
    this.validator();
    this.cloneForm={...this.form}; 
  },
  watch: {
    selectShow(val) {
      if (!val) {
        this.formList[this.selectIndex].sheetShow = false;
      }  
    },
    async(val){
      if(val){
        this.cloneForm={...this.form};
      }
      
    },
  },
  methods: {
    validator() {
      this.$refs.uForm.setRules(this.rules);
    },
    formGroupChange(e) {
      this.form[this.propsType] = e;
    },
    formChange(type) {
      this.propsType = type;
    },
    // sheet
    selectClick(type, i) {
      if (this.formList[i].disabled) {
        return false;
      }
      this.formList[i].sheetShow = true;
      this.selectShow = true;
      this.selectIndex = i;
      this.formChange(type);
      this.list = this.formList[i].optionList;
    },
    selectconfirm(e) {
      this.$emit("selectChange", this.propsType, e);
    },

    getData() {
      const form = {};
      for (let key in this.form) {
        form[key] =this.seletform && this.seletform[key] ? this.seletform[key]: this.form[key];
      }
      return form;
    },
    inputType(type) {
      return /^(input|number|textarea|password)$/.test(type);
    },
    validateForm() {
      return new Promise((resolve) =>
        this.$refs.uForm.validate((val) => resolve(val))
      );
    },
    submitForm() {
      this.$refs.uForm.validate((val) => {
        if (val) {
          const form = this.getData();
          this.$emit("getFormData", form);
        }
      });
    },
    resetForm() {
      this.$refs.uForm.resetFields();
      Object.entries(this.form).map(([key]) => {
        this.form[key]=this.cloneForm[key];
      });
      return Promise.resolve();
    },
  },
};
</script>
<style lang="scss" scoped>
.form {
  /deep/.u-btn {
    width: 100%;
    padding: 0;
  }
}
.icon{padding: 0 20rpx;}
.submit {
  margin-top: 20rpx;
}

</style>