export default {
  formData: { lineCode: "",stationCode:"",event:"", closeComment: "" },
  formList: [
    {
      label: "产线",
      props: "lineCode",
      type: "select",
      selectShow: false,
      disabled: true,
      optionList: [],
    },
    {
      label: "工位",
      props: "stationCode",
      type: "select",
      selectShow: false,
      disabled: true,
      optionList: [],
    },
    {
      label: "事件",
      props: "event",
      type: "select",
      selectShow: false,
      disabled: true,
      optionList: [],
    },
    { label: "关闭说明", props: "closeComment", type: "textarea" },
  ],
  rules: {
    closeComment: [
      { required: true, message: "不能为空", trigger: "blur,change", }
    ],
  }
}