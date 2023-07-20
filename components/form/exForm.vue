<template>
  <view class="form">
    <u-form ref="Form" :model="formData" :label-width="labelWidth">
    <u-row>
      <u-col v-for="item in formOpts.formItem" :key="item.props" :span="item.span||'12'">
        <u-form-item 
        :label="item.label" 
        :prop="item.props"
        :required="formOpts.rules?!!formOpts.rules[item.props]:false"
        :border-bottom="borderBottom">
          <block v-if="item.type==='exInput'||item.type==='textarea'||item.type==='numberBox'">            
            <component
             :is="item.type" 
              :class="{ disabled: !!item.disabled }"
              v-model="formData[item.props]" 
              v-bind="item" 
              v-on="formOpts.event[item.props]"
            />
            <!-- formOpts.event[item.props] -->
            <slot :name="`${item.props}Right`" :data="formData"></slot>
          </block>
          <block v-else-if="item.type==='select'">
            <component
            :is="item.type" 
             :class="{ disabled: !!item.disabled }"
              v-model="selectData[item.props]" 
              v-bind="item"
              @click="selectHandle(item)"
            />  
          </block>
          <block v-else>
            <component 
              :is="`${item.type}Group`" 
              :class="{ disabled: !!item.disabled }"
              v-bind="item" v-model="formData[item.props]"  
              @change="(e)=>{ groupChang(e,item)}">
                <component :is="`${item.type}`" 	          	
                  v-for="(citem, index) in formOpts.optionList[item.list]" 
                  :key="index"
                  v-model="citem.checked"  
                  :name="citem.value"
                  style="padding: 5rpx 0;">
                  {{citem.label}}
                </component>
            </component>
          </block>     
        </u-form-item>
        <view> <slot :name="`${item.props}Bottom`" :data="formData"></slot></view>
      </u-col>
    </u-row>
  </u-form>
  <u-row class="btn" gutter="20" v-if="isBtn">
      <u-col span="6"><u-button type="default" @click="reset">重置</u-button></u-col>
      <u-col span="6"><u-button type="primary" @click="submit">提交</u-button></u-col>
  </u-row>
  <u-select 
    v-model="selectShow" 
    :default-value="selectIndex" 
    :list="selectList" 
    @confirm="confirm"/> 
  </view>
</template>
<script>
import exInput from "uview-ui/components/u-input/u-input.vue";
import checkboxGroup from "uview-ui/components/u-checkbox-group/u-checkbox-group.vue";
import checkbox from "uview-ui/components/u-checkbox/u-checkbox.vue";
import radioGroup from "uview-ui/components/u-radio-group/u-radio-group.vue";
import radio from "uview-ui/components/u-radio/u-radio.vue";
import numberBox from "uview-ui/components/u-number-box/u-number-box.vue";

export default{
  name:'ex-Form',
  components: {
    exInput,
    checkboxGroup,
    checkbox,
    radioGroup,
    radio,
    numberBox,
		},
  props:{
    labelWidth: {type: String,default: "130"},
    formOpts: {type: Object,default: null},
    isBtn:{type:Boolean,default:true},
    borderBottom:{type:Boolean,default:true} 
  },
  data(){
    return{
      activeProps:'',
      selectShow:false,
      selectIndex:[0],
      selectData:{},
      selectList:[],
      formData:{}
    }
  },
  methods: {
    init(){
      const{formItem,formData,optionList} =this.formOpts;
      this.formData={...formData};
      formItem.forEach(({type,props,list})=>{       
          const val=this.formData[props];
          const option=list?optionList[list]:[];
          // select
          if(type==='select'&&val){                   
            const i= option.findIndex(({value})=>value===val);
            this.selectData[props]=option[i].label;
          }
          if(type==='select'&&!val){
            this.selectData[props]=val;
          }       
          // //checkbox
          if(type==='checkbox'){   
            const newVal= val||[]      
            option.forEach(el=>{
              el.checked=newVal.includes(el.value)
            })          
          }
        })
    },
    setData(data){
      this.formData={...this.formData,data}  
    },
    getModel(item){
      if(item.type==='select') this.selectData[item.props];
      else this.formOpts.formData[item.props];
    },
    selectHandle({type,props,list}){
      if(type==='select'){
        const{formData,optionList} =this.formOpts;
        const val=formData[props];
        if(!!val){
          const i= optionList[list].findIndex(({value})=>value===val);
          this.selectIndex=[i];
        }else{
          this.selectIndex=[0];
        }       
        this.activeProps=props;
        this.selectList=optionList[list]; 
        this.selectShow=true;        
      }
    },
    confirm([{label,value}]){
      this.selectData[this.activeProps]=label;
      console.log(this.formData,this.activeProps,label,value)
      this.formData[this.activeProps]=value;
    },
    groupChang(e,{props}){
      this.activeProps=props;
      this.formData[this.activeProps]=e;
    },
    clearSelect(){
      Object.entries(this.selectData).forEach(([key])=>this.selectData[key]='')
    },
    async reset(){
    await this.$refs.Form.resetFields();
    await this.clearSelect();
    await this.init();
    },
    async clear(){
      await this.clearSelect();
      await this.init();
    },
    submit(){
      this.$refs.Form.validate(valid => {
				if (valid) {
					this.$emit('getFormData',this.formData)
				}
			});
    },

    // inputHandle(e,{props},formData,type){
    //   const {event}=this.formOpts
    //   if(event&&event[`${props}${type}`]) event[`${props}${type}`](e,formData)
    // },
  },
  created () {
    this.init();
  },
  mounted () {
    this.$refs.Form.setRules(this.formOpts.rules);
  }
}
</script>
<style lang="scss" scoped>
.btn{padding:30rpx 0;}
</style>