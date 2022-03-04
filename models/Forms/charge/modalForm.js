export default{
  formData: {
    // device: "",
    slotNo: "",
    matCode: "",
    matSFC: "",
  },
  formList: [
    {
      label: "插槽",
      props: "slotNo",
      type: "input",
      disabled: true,
    },
    {
      label: "物料",
      props: "matCode",
      type: "input",
      disabled: true,
    },
    {
      label: "料号",
      props: "matSFC",
      type: "input",
      suffixIcon: "scan",
      borderBottom: false,
    },
  ],
  rules: {
    matSFC:[
      {
        required: true,
        message: "不能为空",
        trigger: "blur,change",
      }
    ]
  }
}