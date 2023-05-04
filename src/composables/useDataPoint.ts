export function useDataPoint(options: { data: number[]; range: number }) {
  const data = ref(options.data)
  const range = ref(options.range)
  const max = ref(0)
  const min = ref(0)

  // Get the average of the last n data points
  const result = computed(() => {
    return data.value.slice(-range.value).reduce((a, b) => a + b, 0) / range.value
  })

  const rounded = computed(() => {
    return Math.round(result.value)
  })

  // Push a new data point
  const push = (value: number) => {
    if (value !== null) {
      data.value.push(value)
      // Get if the new data point is the max or min
      if (value > max.value)
        max.value = value
      if (value < min.value)
        min.value = value

      // Remove the first data point if we have more than n
      if (data.value.length > range.value)
        data.value.shift()
    }
  }

  return {
    result,
    range,
    push,
    rounded,
    max,
    min,
  }
}
