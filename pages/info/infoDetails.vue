<template>
  <view class="infoDetails">
    <navBar :title="navBar.title" :is-back="navBar.isBack" />
    <!-- nav -->
    <view class="info">
      <view class="info-title">{{notify.title}}</view>
      <view class="article-meta">
        <text class="article-author">{{notify.empCode}}</text>
        <text class="article-text">发表于</text>
        <text class="article-time">{{notify.time}}</text>
      </view>
      <!-- 标题 -->
      <view class="article-content">
       {{notify.content}}
      </view>
    </view>
    <!-- 发表的内容 -->
  </view>
</template>

<script>
import { mapState,mapMutations } from "vuex";
import moment from "moment";
export default {
  name: "infoDetails",
  data() {
    return {
      navBar: {
        title: "我的消息详情",
        isBack: true,
      },
      notify:{}
    };
  },
  
  onLoad(option) {
    this.minus_unreadCount();
    this.notifyAjax(option.id);
    this.readAjax(option.id);
  },
  computed: {
     ...mapState(["userInfo"]),
  },
  methods: {
     ...mapMutations(["minus_unreadCount"]),
    notifyAjax(id) {
      	uni.showLoading({title: "加载中",mask: true});
        return this.$http
        .request({
          url:`/api/SNotify/${id}`,
          method: "GET",
        })
        .then((res) => {
           uni.hideLoading();         
           res.time=moment(res.createdAt).format('YYYY-MM-DD HH:mm:ss');
           this.notify=res;
        })
        .catch(() => uni.hideLoading());
    },
    readAjax(id){
      this.$http
        .request({
          url:"/api/SNotify/Read",
          method: "POST",
          data:{
            notifyId:id,
            recipientEmp: this.userInfo.empCode,
          }
        })
    }
  },
};
</script>

<style lang="scss" scoped>
.infoDetails {
  overflow: hidden;
  min-height: 100%;
  background-color: $white-color;
}
.info {
  padding: 30rpx;
  .info-title {
    font-size: 40rpx;
  }

  .article-meta {
    padding: 10rpx 0 30rpx 0;
    font-size: $font-24;
    color: $font-light-gray;

    text {
      padding-right: 30upx;
    }
  }

  .article-content {
    margin-bottom: 30upx;
    line-height: 2;
    font-size: $font-30;
  }
}
</style>
