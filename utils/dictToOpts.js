function dictToOpts (dict, valueType = 'string') {
  if (Object.prototype.toString.call(dict) !== '[object Object]') {
    console.error('dictToOpts第一个参数必须是Object类型')
    return []
  }
  return Object.entries(dict).map(([value, label]) => {
    return {
      value: valueType === 'number' ? +value : value,
      label
    }
  })
}

export default dictToOpts
