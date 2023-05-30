<template>
  <view 
    class="ex-list" 
    :class="{'ex-link':type==='link'}"  
    :style="{...customStyle}">
    <!-- title -->
    <view class="title">
      <view class="title-left"><text>{{title}}</text></view>
       <view class="title-Right">
        <slot name="titleRight"></slot>
      </view>
    </view>
    <!--list-->
    <view 
      class="list" 
      :class="{'link-list':type==='link'}"  
      :style="{flexDirection:(layout==='horizontal'?'row':'column')}" >
        <div 
          class="list-row" 
          :class="{'border-bottom':borderBottom,'link-list-row':type==='link','list-row-hover':hover}"  
          :style="{...customItemStyle}" 
          v-for="item in data" :key="item[keyId]" >
           <view class="list-row-left">
                <u-row>
                    <block v-for="(value,key,i) in item"  :key="key">
                       <block v-if="keyShow.includes(key)">
                          <u-col v-if="typeof(value)==='string'"  span="12">
                              <view class="list-col">
                                  <view class="list-col-name" :style="{width:labelWidth,textAlign:labelAlign}">
                                    {{dict[key]?dict[key]:key}}：
                                  </view>
                                  <view class="list-col-ontent">{{value}}</view>        
                              </view>
                          </u-col>
                          <block v-else>
                            <block v-for="(val,vkey,i) in value" >
                                <u-col  span="12">
                                    <view class="list-col">
                                        <view class="list-col-name" :style="{width:labelWidth,textAlign:labelAlign}">
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
          <view class="list-row-right">
              <slot name="right"></slot>
          </view>                  
        </div>
      </view>
      <u-empty
        v-show="!data.length"
        margin-top="30"
        icon-size="100"
        text="数据为空"
        mode="data"
      />
  </view>
</template>
<script>
export default {
  name:'List',
  props:{
    title:{type:String,default:''},
    layout:{type:String,default:'horizontal'},    //horizontal | vertical
    customStyle:{type:Object,default:()=>({})},
    customItemStyle:{type:Object,default:null},
    labelWidth:{type:String,default:'140rpx'},
    labelAlign:{type:String,default:'right'}, 
    data:{type:Array,default:()=>[]},
    dict:{type:Object,default:null},
    borderBottom:{type:Boolean,default:false},
    keyShow:{type:Array,default:()=>[]},
    keyId:{type:String,default:'id'},
    type:{type:String,default:'default'},
    hover:{type:Boolean,default:false}
  }
}
</script>
<style lang="scss" scoped>
 .ex-list{
  margin: 15rpx 0;
  padding:30rpx;background-color: #fff;
  .title{
     display:flex;
     align-items: center;
     justify-content: center;
    .title-left{
      flex: 1;
      box-sizing: border-box;
      font-size: 32rpx;
      font-weight: bold;      
    } 
  }
  .list{
    line-height: 1.7;
    word-break:break-all;
    .list-row-hover:hover{background-color: #f9f9f9;}
    &-row{
      display: flex;
      align-items: center;
      justify-content: center;
      padding:15rpx 0;
      background-color: #fff;
      &-left{flex:1;}
    }
    &-col{
      display: flex;
      &-name{
          text-align: right;
          overflow: hidden; 
          margin-right:20rpx;
          color: #999;
        }
        &-content{
          flex: 1;
          overflow:hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }      
    }

     &-item{display: flex;}
     .border-bottom{border-bottom: 1px dashed #ddd;}
    } 

}

.ex-link{
  background-color: initial;
  padding: 0;
  .title{margin: 0 15rpx;}
  .link-list{
      margin:15rpx;
      background-color:initial;
      margin:'15rpx';padding:'0';
      &-row{
        border-radius:10rpx;
        margin:15rpx 0;
        padding:15rpx
      }
  }  
}
</style>