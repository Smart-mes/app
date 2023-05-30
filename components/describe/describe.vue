<template>
  <view 
    class="desc"
    :style="{...customStyle,margin:margin}"
    :class="{'border-radius-10':shape==='fillet'}">
      <view class="des-title" v-if="title">
        <text class="tit">{{title}}</text>
      </view>
      <view class="desc-list" :style="{flexDirection:layout==='horizontal'?'row':'column'}">
        <u-row>
          <block v-for="(value,key,i) in data" :key="key">
            <block v-if="keyShow.includes(key)">
              <u-col v-if="typeof(value)==='string'" span="12">
                  <view class="desc-item">
                      <view class="dest-name" :style="{width:labelWidth,textAlign:labelAlign}">
                        {{dict[key]?dict[key]:key}}：
                      </view>
                      <view class="dest-content">{{value}}</view>        
                  </view>
              </u-col>
              <block v-else>
                  <block v-for="(val,vkey,i) in value" >
                    <u-col v-if="typeof(val)==='string'"  span="12">
                        <view class="desc-item" v-if="dict&&dict.hasOwnProperty(vkey)">
                        <view class="dest-name" :style="{width:labelWidth,textAlign:labelAlign}">
                              {{dict[vkey]?dict[vkey]:val}}：
                            </view>
                            <view class="dest-content">{{val}}</view>        
                        </view>
                    </u-col>                 
                  </block>           
              </block>
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
    customStyle:{type:Object,default:()=>({})},
    data:{ type:Array,default:null},
    dict:{type:Object,default:null},
    shape:{type:String,default:'fillet'}, //square直接|fillet圆角
    margin:{type:String,default:'15rpx'},
    labelWidth:{type:String,default:'140rpx'},
    labelAlign:{type:String,default:'right'}, 
    layout:{type:String,default:'horizontal'},    //horizontal | vertical
    span:{type:Array,default:()=>[]},
    keyShow:{type:Array,default:()=>[]},
  }
}
</script>

// layout
<style lang="scss" scoped>
  .border-radius-10{border-radius:10rpx}
  .desc{
    padding: 30rpx;
    line-height: 1.7;
    background-color: #fff;
    word-break:break-all;
    .desc-item{display: flex;}
    .dest-name{
      overflow: hidden; 
      margin-right:20rpx;
      color: #999;
    }
    .dest-content{
      flex: 1;
      overflow:hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
     }
     .des-title{margin-bottom: 15rpx;}
     .tit{
      box-sizing: border-box;
      font-size: 32rpx;
      font-weight: bold;
     }
 }
</style>

