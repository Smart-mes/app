<template>
  <view 
    class="desc"
    :style="{...customStyle,margin:margin}"
    :class="{'border-radius':borderRadius}">
      <text v-if="title" class="title">{{title}}</text>
      <view class="desc-list">
        <u-row  style="flex-wrap: wrap;">
          <block v-for="(value,key) in lableDict" :key="key" v-if="key">
            <block v-if="typeof(value)==='object'">
              <u-col span="12" v-for="(val,vkey) in value" :key="vkey" v-if="lableDict[key]">
                  <view class="desc-item">
                      <view class="dest-name" :style="{width:labelWidth,textAlign:labelAlign}">
                        {{val}}：
                      </view>
                      <view class="dest-content" v-if="slotName&&slotName[key]&&slotName[key][vkey]"><slot v-if="data[key]" :name="`${key}-${vkey}`" :data="data"></slot></view>
                      <view class="list-col-content" v-else>
                        {{getVal(key,vkey,data)}}
                      </view>     
                  </view>
              </u-col>             
            </block>
            <block v-else>
                <u-col span="12">
                  <view class="desc-item">
                      <view class="dest-name" :style="{width:labelWidth,textAlign:labelAlign}">
                        {{value}}：
                      </view>                       
                      <view class="dest-content" v-if="slotName&&slotName[key]">
                        <slot v-if="data[key]"  :name="key" :data="data"></slot>
                      </view>
                      <view class="dest-content" v-else>
                        {{getValue(key,data)}}
                      </view>           
                  </view>                  
              </u-col>              
            </block>
          </block>
        </u-row>
      </view>
      <slot name="bottom"/>
    </view>  
</template>

<script>
export default {
  name:'Describe',
  props:{
    title:{type:String,default:''},
    customStyle:{type:Object,default:null},
    data:{ type:Object,default:null},
    lableDict:{type:Object,default:null},
    valueDict:{type:Object,default:null},
    slotName:{type:Object,default:null},
    borderRadius:{type:Boolean,default:false},
    margin:{type:String,default:'15rpx 0'},
    labelWidth:{type:String,default:'140rpx'},
    labelAlign:{type:String,default:'right'}, 
  },
  computed: {
    flexLayout:()=>this.layout==='horizontal'?'row':'column'
  },
  methods: {
    getVal(key,vkey,data){
     if(data[key]){
        if(this.valueDict&&this.valueDict[key]&&this.valueDict[key][vkey]){
          return this.valueDict[key][vkey][data[key][vkey]]||'无';
        }else{
          return data[key][vkey]||'无'
        }        
      }
    },
    getValue(key,data){
      // if(data[key]){
      if(this.valueDict&&this.valueDict[key]){
        return this.valueDict[key][data[key]]||'无';
      }else{
        return data[key]||'无';
      }
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.title{ display:block;font-weight: bold; font-size: 32rpx; margin:0 0 20rpx 0;}
  .border-radius{border-radius:10rpx;margin: 15rpx;}
  .desc{
    padding: 30rpx;
    font-size: 28rpx;
    line-height: 1.75;
    background-color: #fff;
    word-break:break-all;
    .desc-item{display: flex;}
    .dest-name{
      overflow: hidden; 
      margin-right:10rpx;
      color: #999;
    }
    .dest-content{
      flex: 1;
      overflow:hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
     }
 }
</style>

