function listToDict (list, valueKey, labelKey) {
  const dict = {}
  if (typeof labelKey === 'function') {
    list.forEach(item => {
      dict[item[valueKey]] = labelKey(item)
    })
  } else {
    list.forEach(item => {
      dict[item[valueKey]] = item[labelKey]
    })
  }
  return dict
}

export default listToDict
