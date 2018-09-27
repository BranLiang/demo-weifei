export const maxWasteChangeRate = (data) => {
  let max = 0
  let prev = 0
  let changeRate = 0
  let absChangeRate = 0
  data.forEach((current, i) => {
    if (i === 0) {
      return;
    }
    prev = data[i - 1]
    changeRate = (current.waste - prev.waste) / prev.waste * 100
    absChangeRate = Math.abs(changeRate)
    if (absChangeRate > max) {
      max = absChangeRate
    }
  })
  return max
}

export const maxWDEChangeRate = (data) => {
  let max = 0
  let prev = 0
  let changeRate = 0
  let absChangeRate = 0
  data.forEach((current, i) => {
    if (i === 0) {
      return;
    }
    prev = data[i - 1]
    changeRate = (current.waste / current.electricity - prev.waste / prev.electricity) * 100 / (prev.waste / prev.electricity)
    absChangeRate = Math.abs(changeRate)
    if (absChangeRate > max) {
      max = absChangeRate
    }
  })
  return max
}

export const maxWDWChangeRate = (data) => {
  let max = 0
  let prev = 0
  let changeRate = 0
  let absChangeRate = 0
  data.forEach((current, i) => {
    if (i === 0) {
      return;
    }
    prev = data[i - 1]
    changeRate = (current.waste / current.water - prev.waste / prev.water) * 100 / (prev.waste / prev.water)
    absChangeRate = Math.abs(changeRate)
    if (absChangeRate > max) {
      max = absChangeRate
    }
  })
  return max
}

export const hasWarning = (data, warningPoint) => {
  if (maxWasteChangeRate(data) > warningPoint) {
    return true
  }

  if (maxWDEChangeRate(data) > warningPoint) {
    return true
  }

  if (maxWDWChangeRate(data) > warningPoint) {
    return true
  }

  return false
}

export const hasError = (data, errorPoint) => {
  if (maxWasteChangeRate(data) > errorPoint) {
    return true
  }

  if (maxWDEChangeRate(data) > errorPoint) {
    return true
  }

  if (maxWDWChangeRate(data) > errorPoint) {
    return true
  }

  return false
}