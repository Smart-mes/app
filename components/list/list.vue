<template>
  <view 
    class="ex-list" 
    :class="{'ex-link':isLink}"  
    :style="{...customStyle}">
    <!-- title -->
    <view class="title" v-if="title">
      <view class="title-left">
        <text class="title-text">{{title}}</text>
      </view>
       <view class="title-Right">
         <slot name="titleRight"></slot>
      </view>
    </view>
    <!--list-->
    <view 
      class="list" 
      :class="{'link-list':isLink}">
        <div 
          v-for="item in data" :key="item[keyId]"
          class="list-row" 
          :class="{'border-top':borderTop,'link-list-row':isLink,'list-row-hover':hover}"  
          :style="{...customItemStyle}">
            <view class="list-row-left">
                  <u-row style="flex-wrap: wrap;">
                      <block v-for="(value,key) in lableDict" :key="key" v-if="key">
                        <block v-if="typeof(value)==='object'">
                              <block v-for="(val,vkey) in value" :key="vkey" v-if="lableDict[key][vkey]">
                                <u-col span="12">
                                    <view class="list-col">
                                        <view class="list-col-name" :style="{width:labelWidth,textAlign:labelAlign}">
                                          {{val}}：
                                        </view>
                                        <view class="list-col-content" v-if="slotName&&slotName[key]&&slotName[key][vkey]">
                                          <slot :name="`${key}-${vkey}`" :data="item"></slot>
                                        </view>
                                        <view class="list-col-content" v-else>
                                          {{getVal(key,vkey,item)}}
                                        </view> 
                                    </view>
                                </u-col>                 
                            </block>   
                          </block>
                          <block v-else>
                              <u-col span="12">
                                  <view class="list-col">
                                      <view class="list-col-name" :style="{width:labelWidth,textAlign:labelAlign}">
                                        {{value}}：
                                      </view>                   
                                      <view class="list-col-content" v-if="slotName&&slotName[key]">
                                        <slot :name="key" :data="item"></slot>
                                      </view>
                                      <view class="list-col-content" v-else>
                                        {{getValue(key,item)}}
                                      </view>
                                  </view>
                              </u-col>                            
                          </block> 
                    </block>
                    <u-col span="12">
                        <slot name="bottom" :data="item"></slot>
                    </u-col> 
                </u-row>              
            </view>  
            <view class="list-row-right">
                <slot name="right" :data="item"></slot>
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
    customStyle:{type:Object,default:null},
    customItemStyle:{type:Object,default:null},
    labelWidth:{type:String,default:'140rpx'},
    labelAlign:{type:String,default:'right'}, 
    data:{type:Array,default:()=>[]},
    lableDict:{type:Object,default:null},
    valueDict:{type:Object,default:null},
    keyId:{type:String,default:'id'},
    slotName:{type:Object,default:null},
    type:{type:String,default:''},
    hover:{type:Boolean,default:false},
    borderTop:{type:Boolean,default:false},
  },
  computed: {
    isLink:function(){
      return this.type==='link';
    }
  },
  methods: {
    getVal(key,vkey,item){
      if(item[key]){
          if(this.valueDict&&this.valueDict[key]&&this.valueDict[key][vkey]){
            return this.valueDict[key][vkey][item[key][vkey]];
         }else{
            return item[key][vkey]||'无';
         }  
      }    
    },
    getValue(key,item){
      // if(item[key]){
        if(this.valueDict&&this.valueDict[key]){
          return this.valueDict[key][item[key]];
        }else{
          return item[key]||'无';
        }
      }
    // }
  }
}
</script>
<style lang="scss" scoped>
.title-text{ display:block;font-weight: bold; font-size: 32rpx; margin:0 0 20rpx 0;}
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
    font-size: 28rpx;
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
          margin-right:10rpx;
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
     .border-top{border-top: 1px dashed #ddd;}
    } 

}

.ex-link{
  margin-top: 0;
  padding: 0;
  background-color: initial;
  .title{margin: 0 15rpx;}
  .link-list{
      margin:15rpx;
      background-color:initial;
      margin:'15rpx';padding:'0';
      &-row{
        border-radius:10rpx;
        margin:15rpx 0;
        padding:30rpx
      }
  }  
}
</style>