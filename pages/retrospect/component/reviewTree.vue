<template>
  <view>
    <u-empty
      v-if="!treeData.length"
      margin-top="50"
      icon-size="100"
      text="数据为空"
      mode="data"
    />
    <scroll-view  v-if="treeData.length" scroll-x="true" class="review-scroll">
      <ly-tree
        node-key="id"
        :ready="ready"
        :props="props"
        :tree-data="treeData"
        @node-click="loadNodes"
        @icon-click="iconClick"
      />
    </scroll-view>
  </view>
</template>

<script>
 import moment from "moment";
import LyTree from "@/components/ly-tree/ly-tree.vue";

var _self;
export default {
  name: "ReviewTree",
  props: {
    productMap: {
      type: Object,
      default: {},
      required: true,
    },
    materialMap: {
      type: Object,
      default: {},
      required: true,
    },
    processMap: {
      type: Object,
      default: {},
      required: true,
    },
    stepMap: {
      type: Object,
      default: {},
      required: true,
    },
    empMap: {
      type: Object,
      default: {},
      required: true,
    },
  },
  components: {
    LyTree,
  },
  data() {
    return {
      ready: true,
      props: {
        label: "title",
        children: "children",
      },
      //tree数据
      emptyText: "请查询数据",
      treeData: [],
      processData: [],
    };
  },
 
  methods: {
    date(val) {
      return moment().format('YYYY-MM-DD')
    },
    // tree树形
    fetchData(form) {
      this.ready = false;
      this.treeData = [];

      return this.$http
        .request({
          url: `/api/MaterialTraceability/By${
            form.isMaterial ? "Material" : "Product"
          }`,
          method: "GET",
          data: form,
        })
        .then((res) => {
          this.ready = true;
          this.treeData = this._buildTree(res);
          this.processData = res.processData.map((item) => {
            return {
              '工单': item.orderNo,
              '批次号': item.sfc,
              '产品编号': item.productCode,
              '产品名称': this.productMap[item.productCode],
              '顺序': item.idx,
              '工步名称': this.stepMap[item.stepId],
              '工步类型': item.stepType,
              '值': item.val,
              '物料编号': item.matCode,
              '数量': item.qty,
              '时间': item.inputTime,
              '班别编号': item.classCode,
              '车间编号': item.workshop,
              '工位编号': item.stationCode,
              '员工编号': item.empCode,
            };
          });
        })
        .catch(() => {
          this.ready = true;
        });
    },
    // 第一层
    _buildTree(data) {
      const ioMap = this._createIoMap(data);
      return data.state.map((item) => {
        const node = {
          id: `${Date.parse(new Date())}${Math.random() * 5}`,
          title: `产品【${this.productMap[item.matCode]}】 ${item.sfc}`,
        };
        if (ioMap[item.sfc]) {
          node.children = ioMap[item.sfc];
        }
        return node;
      });
    },
    // 第四层
    _createIoMap(data) {
      const dataMap = data.processData.reduce((dict, item) => {
        if (!item.ioGuid) {
          return dict;
        }
        if (!dict[item.ioGuid]) {
          dict[item.ioGuid] = [];
        }
        dict[item.ioGuid].push(this._toNode(item));
        return dict;
      }, {});
      return data.ioLog.reduce((dict, item) => {
        if (!dict[item.sfc]) {
          dict[item.sfc] = [];
        }
        const node = {
          id: `${Date.parse(new Date())}${Math.random() * 5}`,
          title: `工序【${this.processMap[item.processCode]}】 ${this.date(item.inputTime)} 【${this.empMap[item.empCode] || item.empCode}】`,
        };
        if (dataMap[item.ioGuid]) {
          node.children = dataMap[item.ioGuid];
        }
        dict[item.sfc].push(node);
        return dict;
      }, {});
    },
    _toNode(item) {
      return {
        id: `${Date.parse(new Date())}${Math.random() * 5}`,
        // title: `${this.stepMap[item.stepId]} - ${item.stepType === '料' ? `【${this.productMap[item.matCode] || this.materialMap[item.matCode]}】` : ''}${item.val}`,
        title: `${this.stepMap[item.stepId]} - ${
          item.stepType === "料" ? `【${item.matCode}】` : ""
        }${item.val} ${item.runResult ? "✔" : "❌"}`,
        isAsync: !!this.productMap[item.matCode],
        iconClass:item.stepType && !!item.stepType && item.matCode ? "custom-icon-search" : "",
        rawData: item,
      };
    },
    loadNodes(node) {
      const {
        data: { isAsync, children, rawData },
      } = node;
      const isChildren = children && children.length > 0;

      if (isAsync && !isChildren) {
        uni.showLoading({
          title: "加载中",
          mask: true,
        });
        this.$http
          .request({
            url: "/api/MaterialTraceability/Nodes",
            method: "GET",
            data: {
              sfc: rawData.val,
            },
          })
          .then((res) => {
            uni.hideLoading();
            const children = this._createIoMap(res)[rawData.val];
            this.$set(node, "expanded", true);
            this.$set(node.data, "children", children);
          })
          .catch(() => {
            uni.hideLoading();
          });
      }
    },
    iconClick(node) {
      const {
        data: {
          rawData: { matCode, val },
        },
      } = node;
      const form = {
        isMaterial: true,
        matCode,
        matSfc: val,
      };
      this.$emit("materialData", form);
      this.fetchData(form);
    },
  },
};
</script>
<style lang="scss" scoped>
.review-scroll {
  width: 720upx;
}
</style>
