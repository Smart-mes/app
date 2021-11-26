<template>
  <view id="assetDetails">
    <u-navbar
      :title="navbar.title"
      :height="navbar.height"
      :is-back="navbar.isBack"
      :background="navbar.background"
    />
    <!-- nav -->
    <u-tabs
      name="cate_name"
      count="cate_count"
      :list="tabList"
      :current="current"
      @change="change"
    ></u-tabs>
    <!-- tabs -->
    <view class="kpi" v-show="current===0">
      <view class="kpi-charts">
        <image
          class="img"
          src="@/static/images/asset/kpi1.jpg"
          mode="heightFix"
        ></image>
      </view>
      <view class="kpi-charts">
        <image
          class="img"
          src="@/static/images/asset/kpi2.jpg"
          mode="heightFix"
        ></image>
      </view>
      <view class="kpi-charts">
        <image
          class="img"
          src="@/static/images/asset/kpi3.jpg"
          mode="heightFix"
        ></image>
      </view>
      <view class="kpi-charts">
        <image
          class="img"
          src="@/static/images/asset/kpi4.jpg"
          mode="heightFix"
        ></image>
      </view>
      <view class="kpi-daily">
         <scroll-view class="daily-scroll" scroll-x="true">
          <image
            class="img"
            src="@/static/images/asset/kpi8.jpg"
            mode="heightFix"
          ></image>
        </scroll-view>
      </view>
      <!-- kpi-daily -->
      <view class="kpi-week">
        <scroll-view class="week-charts" scroll-x="true">
          <image
            class="img"
            src="@/static/images/asset/kpi5.jpg"
            mode="heightFix"
          ></image>
        </scroll-view>
      </view>
			<!-- kpi-week -->
			<view class="kpi-util">
        <image
          class="img"
          src="@/static/images/asset/kpi6.jpg"
          mode="heightFix"
        ></image>
      </view>
      <!-- kpi-util -->
			<view class="kpi-downtime">
        <scroll-view class="week-downtime" scroll-x="true">
          <image
            class="img"
            src="@/static/images/asset/kpi7.jpg"
            mode="heightFix"
          ></image>
        </scroll-view>
      </view>
    </view>
    <!-- KPI -->
		<view class="keynote" v-show="current===1">
			 <view class="keynote-charts">
        <image
          class="img"
          src="@/static/images/asset/keynote1.jpg"
          mode="heightFix"
        ></image>
      </view>
			<view class="keynote-title">
			  <u-section
            title="监控的属性"
						sub-title="第 1 - 7 个属性，共 7 个"
            font-size="30"
            :show-line="false"
						:arrow="false"
          />
			</view>	
			<view class="keynote-charts h">
					<scroll-view class="keynote-scroll" scroll-x="true">
							<image
								class="img"
								src="@/static/images/asset/keynote2.jpg"
								mode="heightFix"
							></image>
					</scroll-view> 
      </view>
			<view class="keynote-charts h">
					<scroll-view class="keynote-scroll" scroll-x="true">
						<image
							class="img"
							src="@/static/images/asset/keynote3.jpg"
							mode="heightFix"
						></image>
					</scroll-view> 
      </view>
		</view>
		<!-- 重点参数 -->
		<view class="upkeep" v-show="current===2">
       <view class="upkeep-table" v-show="upkeepType==='upkeep'">
          <u-table>
            <u-tr>
              <u-th>保养等级</u-th>
              <u-th>
                 <u-dropdown height="50">
                   <u-dropdown-item v-model="upkeepValue" title="保养状态" :options="upkeepOptions"></u-dropdown-item>
                </u-dropdown>
              </u-th>
              <u-th>保养日期</u-th>
            </u-tr>
            <u-tr v-for="(upkeep,i) in filterUpkeepList" :key="i">
              <u-td><text @click="upkeepClick(upkeep)">{{upkeep.grade}}</text></u-td>
              <u-td><text @click="upkeepClick(upkeep)">{{upkeep.state}}</text></u-td>
              <u-td><text @click="upkeepClick(upkeep)">{{upkeep.date}}</text></u-td>
            </u-tr>
          </u-table>
      </view>
      <view class="upkeep-info" v-show="upkeepType==='info'">
          <view class="upkeep-btn">
            <view><u-button size="mini" @click="upkeepGoBack">返回<u-icon name="arrow-right"></u-icon></u-button></view>
        </view>
         <view class="info-item">
           <text class="name">保养项目：</text>
           <text>上油、钻孔、升级</text>
           </view>
         <view class="info-item">
           <text class="name">保养说明：</text>
           <text></text>
        </view>
         <view class="info-item">
           <text class="name">保养时间：</text>
           <text>2020-05-09</text>
        </view>
        <view  class="info-item">
            <text class="name">保养人：</text>
            <text>管理员</text>
        </view>
      </view>
		</view>
		<!-- 维保 -->
		<view class="spare" v-show="current===3">
			<u-table>
				<u-tr>
					<u-th>配件编号</u-th>
					<u-th>配件名称</u-th>
					<u-th>安装日期</u-th>
					<u-th>使用程度</u-th>
				</u-tr>
				<u-tr v-for="(upkeep,i) in spareList" :key="i">
					<u-td>{{upkeep.serial}}</u-td>
					<u-td>{{upkeep.name}}</u-td>
					<u-td>{{upkeep.date}}</u-td>
					<u-td>
              <u-line-progress active-color="#2979ff" :percent="upkeep.progress"></u-line-progress>     
          </u-td>
			  </u-tr>
			</u-table>
		</view>
		<!-- 备品备件 -->
     <view class="mould" v-show="current===4">
      <u-table>
				<u-tr>
					<u-th>模具编号</u-th>
					<u-th>模具名称</u-th>
					<u-th>安装日期</u-th>
					<u-th>使用程度</u-th>
				</u-tr>
				<u-tr v-for="(upkeep,i) in mouldList" :key="i">
					<u-td>{{upkeep.serial}}</u-td>
					<u-td>{{upkeep.name}}</u-td>
					<u-td>{{upkeep.date}}</u-td>
					<u-td><u-line-progress active-color="#2979ff" :percent="upkeep.progress"></u-line-progress></u-td>
			  </u-tr>
			</u-table>
		 </view>
		<!-- 工装磨具 -->
		<view class="task" v-show="current===5">
       <view v-if="taskType==='task'">
         <scroll-view class="task-scroll" scroll-x="true">
           <view class="task-table">
            <u-table>
                <u-tr>
                  <u-th>工单</u-th>
                  <u-th>型号</u-th>
                  <u-th>状态</u-th>                
                  <u-th>达成</u-th>
                </u-tr>
                <u-tr v-for="(mould,i) in taskList" :key="i">
                  <u-td><text @click="mouldClick(i)">{{mould.order}}</text></u-td>
                  <u-td><text @click="mouldClick(i)">{{mould.serial}}</text></u-td>
                  <u-td><text @click="mouldClick(i)">{{mould.state}}</text></u-td>
                  <u-td><u-line-progress active-color="#2979ff" :percent="mould.progress"></u-line-progress></u-td>      
                </u-tr>
            </u-table>
           </view>
         </scroll-view>
       </view>
       <!-- table -->
      <view class="product" v-if="taskType==='product'">
        <view class="product-btn">
            <view><u-button size="mini" @click="taskGoBack">返回<u-icon name="arrow-right"></u-icon></u-button></view>
        </view>
				<view class="product-item">
					<view class="product-hd">
						<view class="row">
							<view class="col col-info">
								<view class="hd-item">
									<text class="name">产线：</text>
									<text>{{ product.lineName }}</text>
								</view>
								<view class="hd-item">
									<text class="name">工单：</text>
									<text>{{ product.orderNo }}</text>
								</view>
								<view class="hd-item ellipsis">
									<text class="name">产品：</text>
									<text>{{ product.productName }}</text>
								</view>
							</view>
							<view class="col col-progress">
								<u-circle-progress class="progress" type="primary" width="132" border-width="6" duration="1000" :percent="product.percent">
									{{product.percent === 0? "未生产": product.percent === 100? "已完成": "生产中"}}
									{{ product.percent }}%
								</u-circle-progress>
							</view>
						</view>
					</view>
					<!--hd -->
					<view class="prouct-bd">
						<u-line color="#ccc" />
						<view class="prouct-info">
							<u-row>
								<u-col span="6">
									<view class="info-item">
										<text class="info-name">完&ensp;成&ensp;数：</text>
										<text class="info-text text-dec">{{ product.cpltQty}}</text>
									</view>
									<view class="info-item">
										<text class="info-name">良&emsp;&emsp;率：</text>
										<text class="info-text text-dec">{{ product.yield }}%</text>
									</view>
									<view class="info-item">
										<text class="info-name">客&emsp;&emsp;户：</text>
										<text class="info-text">{{ product.customer }}</text>
									</view>
								</u-col>
								<u-col span="6">
									<view class="info-item">
										<text class="info-name">计&ensp;划&ensp;数：</text>
										<text class="info-text text-dec">{{ product.qty }}</text>
									</view>
									<view class="info-item">
										<text class="info-name">备&emsp;&emsp;料：</text>
										<text class="info-text text-dec">0%</text>
									</view>
									<view class="info-item">
										<text class="info-name">版&emsp;&emsp;本：</text>
										<text class="info-text">{{ product.bomVersion }}</text>
									</view>
								</u-col>
							</u-row>
						</view>
						<u-line color="#ccc" border-style="dashed" />
						<view class="prouct-assist">
							<view>
								<text class="assist-name">工&emsp;&emsp;艺：</text>
								<text class="assist-text">{{ product.flowName }}</text>
							</view>
							<view class="ellipsis">
								<text class="assist-name">备&emsp;&emsp;注：</text>
								<text class="assist-text">{{ product.remarks }}</text>
							</view>
							<view>
								<text class="assist-name">计划时间：</text>
								<text class="assist-time">
									{{product.plannedTime}}
									<!-- {{ $moment().format('YYYY-MM-DD HH:mm:ss')}}===00 -->
								</text>
							</view>
						</view>
					</view>
					<!-- bd -->
				</view>
			</view>
      <!-- product -->
    </view>
		<!-- task -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      name: "AssetDetails",
      // nav
      navbar: {
        title: "资产详情",
        height: 50,
        background: {
          backgroundColor: "#ffffff",
        },
        isBack: true,
      },
      tabList: [
        { name: "KPI" },
        { name: "关键参数" },
        { name: "维保" },
        { name: "备件" },
        { name: "工装" },
        { name: "任务" },
      ],
      current:0,
			// 保养
			upkeepList:[
				{grade:'一级保养',state:'未保养',date:'2020-04-09'},
        {grade:'二级保养',state:'未保养',date:'2020-06-10'},
        {grade:'一级保养',state:'未保养',date:'2020-08-01'},
				{grade:'二级保养',state:'完成保养',date:'2020-05-09'},
				{grade:'一级保养',state:'保养中',date:'2020-06-11'}
			],
      upkeepValue: 1,
			upkeepOptions: [
          {	label: '未保养',	value: 1,	},
					{label: '完成保养',	value: 2,	},
          {	label: '保养中',	value: 3,	}
			],
			// 备品备件
			spareList:[
				{serial:'PJ01',name:'	P01磨具切片',date:'2020-06-11',progress:50},
        {serial:'PJ02',name:'	P8磨刀垫片',date:'2020-06-10',progress:30},
        {serial:'JJ01',name:'	T01夹具',date:'2020-05-11',progress:40},
        {serial:'JJ02',name:'	T02夹具',date:'2020-05-1',progress:0},
			],
			// 工装磨具
			mouldList:[
				{serial:'MJ01',name:'	连续冲压1',date:'2020-07-21',progress:30},
        {serial:'MJ02',name:'	连续冲压2',date:'2020-05-01',progress:50},
        {serial:'MJ-009',name:'单冲设备',date:'2020-05-23',progress:0},
        {serial:'MJ03',name:'复合冲压1',date:'2020-04-07',progress:11}
			],
			// 任务
     	taskType:'task',
      taskIndex:0,
			taskList:[
        {order:'W198988',serial:'FL-210728-3',state:'待完成',progress:0},
        {order:'WO1228',serial:'FL-210728-2',state:'待完成',progress:0},
        {order:'WO-XP-001', serial:'FL-210728-1',state:'进行中',progress:89}
			],
      productList:[
   {
        "lineName": "包装1线",
        "orderNo": "W198988",
        "productName": "TZ228XS68H-374永磁同步电动机",
        "bomVersion": "A01",
        "flowName": "374电机工艺",
        "customer": "联合光电",
        "remarks": "",
        "plannedTime": "2020-01-07 12:00:00",
        "qty": 99,
        "cpltQty": 0,
        "failQty": 0,
        "reach": 0,
        "visible": true,
        "yield": 100,
        "percent": 0
    },
    {
        "lineName": "包装1线",
        "orderNo": "WO1228",
        "productName": "TZ228XS68H-374永磁同步电动机",
        "bomVersion": "A01",
        "flowName": "374电机工艺",
        "customer": "联合光电",
        "remarks": "",
        "plannedTime": "2019-12-28 12:00:00",
        "qty": 100,
        "cpltQty": 0,
        "failQty": 0,
        "reach": 0,
        "visible": false,
        "yield": 100,
        "percent": 0
    },
    {
        "lineName": "包装1线",
        "orderNo": "WO-XP-001",
        "productName": "TZ228XS68H-374永磁同步电动机",
        "bomVersion": "A01",
        "flowName": "374电机工艺",
        "customer": "联合光电",
        "remarks": "",
        "plannedTime": "2019-12-12 12:00:00",
        "qty": 100,
        "cpltQty": 89,
        "failQty": 0,
        "reach": 89,
        "visible": false,
        "yield": 100,
        "percent": 89
    }
      ],
      upkeepType:'upkeep'
    };
  },
  computed: {
    upkeepDict(){
      let obj={};
      this.upkeepOptions.forEach(({label,value}) => obj[value]=label);
      return obj;
    },
    filterUpkeepList(){
      const state=this.upkeepDict[this.upkeepValue]
      return this.upkeepList.filter(upkeep=>upkeep.state===state);
    },
    product(){
      const [product]=this.productList.filter((item,i)=>i===this.taskIndex)
      return product||{}
    }
  },
  onLoad(option){
    this.navbar.title=option.device;
  },
  methods: {
    change(index) {
      this.current = index;
    },
    mouldClick(i){
      this.taskIndex=i;
      this.taskType='product';
    },
    taskGoBack(){
      this.taskType='task';
    },
    upkeepGoBack(){
      this.upkeepType='upkeep'
    },
    upkeepClick({state}){
      if(state==='完成保养')
        this.upkeepType='info'
    }
  },
};
</script>

<style lang="scss" scoped>
.kpi {
 	margin: 15rpx;
  .kpi-charts {
    overflow: hidden;
    margin: 20rpx 0;
    width: 720rpx;
    height: 350rpx;
    text-align: center;
    background: #fff;
		.img {height: 350rpx;}
  }
	.kpi-util{
    overflow: hidden;
    margin: 20rpx 0;
    width: 720rpx;
    height:1150rpx;
    text-align: center;
    background: #fff;
		.img {height:1150rpx;}
  }
  .kpi-daily{
    overflow: hidden;
    margin: 20rpx 0;
    height: 600rpx;
    background: #fff;
    .daily-scroll {
      height: 600rpx;
    }
		.img {height: 600rpx;}

  }
  .kpi-week {
    overflow: hidden;
    margin: 20rpx 0;
    height: 700rpx;
      background: #fff;
    .week-charts {
      height: 700rpx;
    }
		.img {height: 700rpx;}
  }
	.kpi-downtime {
    overflow: hidden;
    margin: 20rpx 0;
    height: 850;
     background: #fff;
    .week-kpi-downtime {
      height: 850rpx;
    }
		.img {height: 850rpx;}
  }	
}
.keynote{
	overflow: hidden;
	margin:0 15rpx;
	.keynote-title{padding-top: 20rpx;}
	.keynote-charts {
    overflow: hidden;
    margin: 20rpx 0;
    width: 720rpx;
    height: 430rpx;
    text-align: center;
    background: #ffffff;
		.img {height: 430rpx;}
  }
  .h{
		height: 650rpx;
		.keynote-scroll{
			height: 650rpx;
		}
		.img{height: 650rpx;}
	} 
}
.upkeep{
  overflow: hidden;
	margin:20rpx 15rpx;
  .upkeep-progress{
    display: flex;
    flex-direction: row;
    background: blueviolet;
    border: 1px solid #aaa;
    .progress{flex:1}
    .text{width:40rpx; background: blue;}
  }
}
.spare{
	overflow: hidden;
	margin:20rpx 15rpx;
	background:#fff;
}
.mould{
	overflow: hidden;
	margin:20rpx 15rpx;
	background:#fff;

}
.task{
  	margin:20rpx 15rpx;
    .task-scroll{
      width: 720rpx;
     .task-table{ width: 920rpx;}
     }
}
.upkeep-table{min-height: 235rpx;}
/deep/.u-cell{padding: 3rpx 8rpx;}
// 产线
.product {
    margin: 20rpx 0;
    padding: 20rpx 0;
    background-color: $white-color;
    .product-btn{
      display: flex;
      flex-direction: row;
      justify-content:flex-end;
      padding: 0 20rpx;
       }
    .progress {
      font-size: 20rpx;
      color: $font-light-gray;
    }

    .product-hd {
      padding: 25rpx;
      line-height: 1.8;

      .name {
        color: $font-gray;
      }

      .row {
        display: flex;
        flex-direction: row;

        .col-info {
          width: 500rpx;
        }

        .col-progress {
          margin: 10rpx 5rpx 0 20rpx;
          width: 132rpx;
        }

        .col-icon {
          flex: 1;
          line-height: initial;
          text-align: right;
        }
      }
    }

    .prouct-bd {
      padding: 0 25rpx 20rpx 25rpx;
      line-height: 1.5;

      text {
        font-size: $font-26;
      }

      .text-dec {
        text-decoration: underline;
      }

      .prouct-info {
        padding: 15rpx 0 15rpx 0;
      }

      .prouct-assist {
        padding: 15rpx 5rpx 0 5rpx;
      }

      .info-name,
      .assist-name {
        color: $font-light-gray;
      }
      .info-text,
      .assist-text {
        color: #3333cc;
      }

      .assist-time {
        color: #ee8216;
      }
  }
}
.upkeep-info{
    margin: 20rpx 0;
    padding: 20rpx;
    background:#fff;
   .upkeep-btn{
      display: flex;
      flex-direction: row;
      justify-content:flex-end;
      padding: 0 20rpx;
    }
  .info-item{
    display: flex;
    flex-direction: row;
    padding: 4rpx 0;
    .name{width: 140rpx; color: #666;}
    }
}
</style>
