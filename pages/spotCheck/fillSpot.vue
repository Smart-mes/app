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
      <view class="switch">
        <u-icon
          class="icon"
          custom-prefix="custom-icon"
          name="left-arrow"
          color="#999"
          size="50"
          @click="prev"
        />
        <view class="paging">{{ index + 1 }}/{{ aql.qty }}</view>
        <u-icon
          class="icon"
          custom-prefix="custom-icon"
          name="right-arrow"
          color="#999"
          size="50"
          @click="next"
        />
      </view>
      <!-- 切换 -->
      <view class="basic-box form">
        <customForm
          ref="BillFrom"
          :form="inspectionItems[index]"
          :formList="formList"
          :rules="rules"
          @selectChange="selectChange"
        >
          <view slot="submit">
            <view class="btn">
              <u-row gutter="20">
                <u-col span="6">
                  <u-button @click="save" :disabled="!!this.pageType">保存</u-button>
                </u-col>
                <u-col span="6">
                  <u-button
                    v-if="index + 1 !== aql.qty"
                    type="primary"
                    @click="next">
                    下一个
                    </u-button>
                  <u-button v-else type="primary" @click="submit" :disabled="submitDisabled">
                    提交
                  </u-button>
                </u-col>
              </u-row>
            </view>
          </view>
        </customForm>
      </view>
    </view>
    <!-- page -->
    <u-toast ref="uToast" />
  </view>
</template>

<script>
function getAQLCode(lotQty, level) {
  if (lotQty < 2) {
    throw new Error("批次数量达不到抽样标准！");
  }
  const lvlIdx = ["S-1", "S-2", "S-3", "S-4", "I", "II", "III"].indexOf(level);
  if (!~lvlIdx) {
    throw new Error(
      `非法的检查水平：${level}, 合法值为['S-1', 'S-2', 'S-3', 'S-4', 'I', 'II', 'III']`
    );
  }
  const codeMap = {
    //         S-1, S-2, S-3, S-4,  I , II , III
    500001: ["D", "E", "H", "K", "N", "Q", "R"],
    150001: ["D", "E", "G", "J", "M", "P", "Q"],
    "035001": ["D", "E", "G", "J", "L", "N", "P"],
    "010001": ["C", "D", "F", "H", "K", "M", "N"],
    "003201": ["C", "D", "F", "G", "J", "L", "M"],
    "001201": ["C", "D", "E", "G", "H", "K", "L"],
    "000501": ["C", "C", "E", "F", "G", "J", "K"],
    "000281": ["B", "C", "D", "E", "F", "H", "J"],
    "000151": ["B", "C", "D", "E", "E", "G", "H"],
    "000091": ["B", "B", "C", "D", "D", "F", "G"],
    "000051": ["B", "B", "C", "C", "C", "E", "F"],
    "000026": ["A", "B", "B", "C", "C", "D", "E"],
    "000016": ["A", "A", "B", "B", "B", "C", "D"],
    "000009": ["A", "A", "A", "A", "A", "B", "C"],
    "000002": ["A", "A", "A", "A", "A", "A", "B"],
  };

  return Object.entries(codeMap).filter(([k, v]) => k <= lotQty)[0][1][lvlIdx];
}

function getAQL(lotQty, level, aqlValue) {
  lotQty = +lotQty;
  aqlValue = +aqlValue;
  if (lotQty < 2) {
    return {
      lotQty,
      level,
      aqlValue,
      code: "全检",
      qty: 1,
      ac: 0,
      re: 1,
    };
  }
  const code = getAQLCode(lotQty, level.substr(2));
  const index = [0.65, 1, 1.5, 2.5, 4, 6].indexOf(aqlValue);
  if (!~index) {
    throw new Error(
      `非法的AQL值：${aqlValue}, 合法值为[0.65, 1, 1.5, 2.5, 4, 6]`
    );
  }

  const aqlMap = {
    // [0.65, 1, 1.5, 2.5, 4, 6]的ac数量, 抽样数量
    A: { ac: [0, 0, 0, 0, 0, 0], qty: 2 },
    B: { ac: [0, 0, 0, 0, 0, 0], qty: 3 },
    C: { ac: [0, 0, 0, 0, 0, 1], qty: 5 },
    D: { ac: [0, 0, 0, 0, 1, 1], qty: 8 },
    E: { ac: [0, 0, 0, 1, 1, 2], qty: 13 },
    F: { ac: [0, 0, 1, 1, 2, 3], qty: 20 },
    G: { ac: [0, 1, 1, 2, 3, 5], qty: 32 },
    H: { ac: [1, 1, 2, 3, 5, 7], qty: 50 },
    J: { ac: [1, 2, 3, 5, 7, 10], qty: 80 },
    K: { ac: [2, 3, 5, 7, 10, 14], qty: 125 },
    L: { ac: [3, 5, 7, 10, 14, 21], qty: 200 },
    M: { ac: [5, 7, 10, 14, 21, 21], qty: 315 },
    N: { ac: [7, 10, 14, 21, 21, 21], qty: 500 },
    P: { ac: [10, 14, 21, 21, 21, 21], qty: 800 },
    Q: { ac: [14, 21, 21, 21, 21, 21], qty: 1250 },
    R: { ac: [21, 21, 21, 21, 21, 21], qty: 2000 },
  };
  if (!Object.keys(aqlMap).includes(code)) {
    throw new Error(`非法的样本字码：${code}, 合法值为${Object.keys(aqlMap)}`);
  }

  return {
    lotQty,
    level,
    aqlValue,
    code: code,
    qty: aqlMap[code].qty,
    ac: aqlMap[code].ac[index],
    re: aqlMap[code].ac[index] + 1,
  };
}

export default {
  name: "FillSpot",
  data() {
    return {
      navBar: {
        title: "抽检填单",
        isBack: true,
      },
      // 参数
      billCode: "CI",
      headerData: {},
      // form
      formList: [],
      rules: {},
      pageType:'',
      // 模板
      template: null,
      aql: {},
      inspectionItems: [],
      index: 0,
      // 人工判断的属性
      judgmentKeys: [],
      saveDisabled:false,
      submitDisabled:false
    };
  },
  computed: {
    validMap () {
      const concerns = this.template ? this.template.concerns : []
      return concerns.reduce((dict, c) => {
        dict[c.name] = function (val) {
          val = +val
          if (c.condition === '人工判断') {
            return val === 1
          } else if (c.condition === '区间') {
            return val >= c.num1 && val <= c.num2
          } else if (c.condition === '允差') {
            return val >= (c.num1 - c.num2) && val <= (c.num1 + c.num2)
          } else if (c.condition === '<') {
            return val < c.num1
          } else if (c.condition === '<=') {
            return val <= c.num1
          } else if (c.condition === '=') {
            return val === c.num1
          } else if (c.condition === '>') {
            return val > c.num1
          } else if (c.condition === '>=') {
            return val >= c.num1
          } else {
            return false
          }
        }
        return dict
      }, {})
  },
  },
  onLoad(option) {
    const {taskCode,type}=option
    if(type){
      this.pageType=type;
      this.submitDisabled=true;
      this.navBar.title="查看抽检填单";
    }else{
      this.navBar.title="抽检填单";
    } 
    
    this.taskAjax(taskCode)
     .then(([data])=>{
          this.taskState= data;
          this.headerData = JSON.parse(data.headerData);
    })
     .then(()=>{
        this.templateAjax().then((res) => {
          this.template = JSON.parse(res[0].template);
          this.aql = getAQL(
            this.headerData.lotQty.value,
            this.template.level,
            this.template.aql
          );
          this.template.concerns.forEach((c) => {
            this.formList.push({
              label: `${ c.name }${ c.unit ? `(${c.unit})` : '' }`,
              props: c.name,
              type: c.condition === "人工判断" ? "radio" : "input",
              radioList: [
                { name: 0, label: "NG",disabled:!!this.pageType },
                { name: 1, label: "OK",disabled:!!this.pageType },
              ],
              disabled:!!this.pageType 
            });

            if (c.condition !== "人工判断") {
              this.rules[c.name] = {
                required: true,
                message: "不能为空",
                trigger: "blur,change",
              };
            }
          });

          // 赋值
          this.judgmentKeys = this.template.concerns.filter(x => x.condition === '人工判断').map(x => x.name)
          if (this.taskState.bodyData) {
            this.inspectionItems = JSON.parse(this.taskState.bodyData)
          } else {
            this.inspectionItems = Array(this.aql.qty)
              .fill(0)
              .map((v, i) => {
                const item = { index: i + 1 }
                this.judgmentKeys.forEach(k => {
                  item[k] = 1
                })
                return item;
              });
          }
        });
    });

  },
  methods: {
      // form
      selectChange(propsType, [{ label, value }]) {
        this.inspectionItems[this.index][propsType] = label;
      },
      prev() {
        if (this.index > 0) {
          this.index -= 1
        }
      },
      next() {
       if(this.index+1===this.inspectionItems.length){
         return void 0;
       }
        this.$refs.BillFrom.validateForm().then((valid) => {
          if (valid) {
            this.index++;
          }
        });
      },
      save() {
        const formData = { ...this.taskState, bodyData: JSON.stringify(this.inspectionItems) }
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
        this.$refs.BillFrom.validateForm().then((valid) => {
          if (valid) {
            let ngQty = 0
            const inspectionItems = JSON.parse(JSON.stringify(this.inspectionItems))          
            inspectionItems.forEach(item => {
              item.__result = this.template.concerns.every(c => this.validMap[c.name](item[c.name]))
              ngQty += item.__result ? 0 : 1
            })
            const result = ngQty <= this.aql.ac ? 'OK' : 'NG'
            const headerData = JSON.stringify({
              ...JSON.parse(this.taskState.headerData),
              aql: { label: 'AQL', value: this.aql, displayValue: `${this.aql.code}: ${ngQty}/${this.aql.qty}` },
              result: { label: '检验结果', value: result, displayValue: result }
            })
  
            const bodyData = JSON.stringify(inspectionItems)
            const taskState = { ...this.taskState, result, headerData, bodyData }
            const taskLog = {
              taskCode: taskState.taskCode,
              roleId: taskState.assignRole,
              empCode: taskState.receiveEmp,
              step: taskState.step,
              result: 1,
              description: '提交'
            }
            
            this.submitDisabled=true;
            this.$http.request({
              url: '/api/BillTask/Submit', 
              method: "POST",
              data: { taskState, taskLog }
            }).then(() => {
              //  this.submitDisabled=true;
               this.$refs.uToast.show({ title: "提交成功",type: "success",url: "/pages/spotCheck/historySpot"});
            }).catch(()=>{
              this.submitDisabled=false;
              this.$refs.uToast.show({ title: "提交失败", type: "error" });
            })      
          }
        });
      },
      // 请求
      // taskCode
      taskAjax(taskCode){
        return this.$http.request({
          url: "/api/BTaskState",
          method: "GET",
          data: {taskCode },
        });
      },
      templateAjax() {
        return this.$http.request({
          url: "/api/BInspectionTemplate",
          method: "GET",
          data: { type: this.billCode, pid: this.headerData.pid.value },
        });
      }
   }
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
.switch {
  margin: 0 20rpx;
  padding-top: 15rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .paging {
    flex: 1;
    text-align: center;
  }
}
.u-page {
  overflow: hidden;
}
.form {
  margin-bottom: 15rpx;
}
</style>
