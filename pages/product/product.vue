<template>
  <view>
    <u-navbar 
    :is-back="navbar.isBack" 
    :background="navbar.background"
    :height="50">
      <view class="navbar-left m-l35">
        <view class="title">生产详情</view>
      </view>
      <view class="navbar-right" slot="right">
        <view class="navbar-icon">
          <u-icon
            class="icon-item"
            name="grid"
            color="#333"
            size="45"
            @click.native="handleMenu"
          />
          <u-icon
            class="icon-item"
            name="reload"
            color="#333"
            size="45"
            @click.native="handleRefresh"
          />
        </view>
      </view>
    </u-navbar>
    <!-- nav -->
    <view class="u-page">
      <view class="nav-subTitle">{{ wsName }}</view>
      <view class="product">
        <view class="product-item" v-for="(product, i) in productList" :key="i">
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
                <u-circle-progress
                  class="progress"
                  type="primary"
                  width="132"
                  border-width="6"
                  duration="1000"
                  :percent="product.percent"
                >
                  {{
                    product.percent === 0
                      ? "未生产"
                      : product.percent === 100
                      ? "已完成"
                      : "生产中"
                  }}
                  {{ product.percent }}%
                </u-circle-progress>
              </view>
              <view class="col col-icon">
                <u-icon
                  :name="product.visible ? 'arrow-up-fill' : 'arrow-down-fill'"
                  color="#ccc"
                  size="22"
                  @tap="accordion(product)"
                />
              </view>
            </view>
          </view>
          <!--hd -->
          <view class="prouct-bd" v-show="product.visible">
            <u-line color="#ccc" />
            <view class="prouct-info">
              <u-row>
                <u-col span="6">
                  <view class="info-item">
                    <text class="info-name">完&ensp;成&ensp;数：</text>
                    <text class="info-text text-dec">{{
                      product.cpltQty
                    }}</text>
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
                <text class="assist-time">{{
                  $formatdate(product.plannedTime)
                }}</text>
              </view>
            </view>
          </view>
          <!-- bd -->
        </view>
      </view>
      <u-empty
        v-if="!productList.length"
        margin-top="30"
        icon-size="100"
        text="数据为空"
        mode="data"
      />
    </view>
    <!-- page -->
    <popup ref="popup" @getWorkShop="getWorkShop" />
    <!-- popup -->
    <u-tabbar
	  :icon-size="nav.iconSize"
      :list="nav.list"
      :mid-button="nav.isMid"
      :active-color="nav.activeColor"
      :inactive-color="nav.inactiveolor"
    />
  </view>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "Product",
  data() {
    return {
      navbar: {
        background: {
          backgroundColor: "#ffffff",
        },
        isBack: false,
      },
      // 车间
      wsName: "车间列表",
      wsCode: "",
      productList: [],
    };
  },
  computed: {
    ...mapState(["nav"]),
  },
  methods: {
    handleMenu() {
      this.$refs.popup.visible = true;
    },
    handleRefresh() {
      this.productAjax();
    },
    getWorkShop(item) {
      const { wsName, wsCode } = item;
      this.wsName = wsName;
      this.wsCode = wsCode;
      this.productAjax();
    },
    productAjax() {
      uni.showLoading({
        title: "加载中",
        mask: true,
      });

      return this.$http
        .request({
          url: "/api/ProduceReport/wsCodeProduct",
          method: "GET",
          data: {
            wsCode: this.wsCode,
          },
        })
        .then(({ productList }) => {
          uni.hideLoading();
          this.setProduct(productList);
        })
        .catch(() => {
          uni.hideLoading();
        });
    },
    setProduct(productList) {
      this.productList = productList.map((product, i) => {
        if (product) {
          product.visible = i ? false : true;
          // 良率
          let total = product.cpltQty + product.failQty;
          let yieldNum = product.cpltQty / total;
          product.yield = total === 0 ? 100 : Math.round(yieldNum * 100);
          // nameline百分比
          let percentNum = product.cpltQty / product.qty;
          product.percent = Math.round(percentNum * 100);
          return product;
        }
      });
    },
    accordion(item) {
      this.$set(item, "visible", !item.visible);
    },
  },
  onload(){
      uni.startPullDownRefresh();
  },
  onPullDownRefresh() {
    this.productAjax().then(() => {
      uni.stopPullDownRefresh();
    });
  },
};
</script>
<style lang="scss" scoped>
// 产线
.product {
  .product-item {
    margin: 0 15rpx 20rpx 15rpx;
    border-radius: 10rpx;
    background-color: $white-color;
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
</style>
