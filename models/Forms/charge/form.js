export default{
  formData: {
    lineCode: "",
    orderNo: "",
    machineCode: "",
    slotNo: "",
  },
  formList: [
    {
      label: "线别",
      props: "lineCode",
      type: "select",
      selectShow: false,
      disabled: true,
      optionList: [],
    },
    {
      label: "工单",
      props: "orderNo",
      type: "input",
      disabled: true,
    },
    {
      label: "设备",
      props: "machineCode",
      type: "input",
      suffixIcon: "scan",
    },
    {
      label: "插槽",
      props: "slotNo",
      type: "input",
      suffixIcon: "scan",
    },
  ],
}