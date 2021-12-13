<template>
  <view>
    <navBar :title="navBar.title" :is-back="navBar.isBack" />
    <!-- navBar -->
    <view class="u-page">
      <view class="search-box">
        <u-form label-width="130" :model="form" ref="BillForm">
          <u-form-item label="工单" prop="ws">
            <u-input v-model="form.ws" placeholder="请输入工单" />
          </u-form-item>
          <u-form-item label="工序" prop="procedure">
            <u-input v-model="form.procedure" placeholder="请输入工序" @click="procedureShow = true" type="select"/>
          </u-form-item>
          <u-form-item label="批次数量" prop="quantity">
            <u-input v-model="form.quantity" placeholder="请输入批次数量" />
          </u-form-item>
        </u-form>
        <view class="btn">
          <u-row gutter="20">
            <u-col span="6">
              <u-button >重置</u-button>
            </u-col>
            <u-col span="6">
              <u-button type="primary" @click="create">创建</u-button>
            </u-col>
          </u-row>
        </view>
      </view>
    </view>
    <!-- page -->
    <u-action-sheet
      :list="procedureList"
      :cancel-btn="true"
      v-model="procedureShow"
      @click="procedureback"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      navBar: {
        title: "首件检验单据",
        isBack: true,
      },
      // form
      form: {
        ws: "",
        procedure: "",
        quantity: "",
      },
      rules: {
        ws: {
          required: true,
          message: "不能为空",
        },
        procedure: {
          required: true,
          message: "不能为空",
        },
        quantity: {
          required: true,
          message: "不能为空",
        },
      },
      // sheet
      procedureShow:false,
      procedureList:[
        {text:'工序1'},
        {text:'工序2'},
        {text:'工序3'}
      ]
    };
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  methods: {
    clear() {
      this.$refs.BillForm.resetFields();
    },
    create() {
      this.$refs.BillForm.validate()
      .then(res => {
			   console.log('通过')
      
			}).catch(errors => {
				 console.log('不通过')
			})
    },
    // sheet
    procedureback(i){
      this.form.procedure=this.procedureList[i].text;
    }
  },
};
</script>

<style>
</style>
