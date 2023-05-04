export function useDataPoint(options: { data: number[]; range: number }) {
  const data = ref(options.data)
  const range = ref(options.range)

  // Get the average of the last n data points
  const result = computed(() => {
    return data.value.slice(-range.value).reduce((a, b) => a + b, 0) / range.value
  })

  const rounded = computed(() => {
    return Math.round(result.value)
  })

  // Push a new data point
  const push = (value: number) => {
    data.value.push(value)
    // Remove the first data point if we have more than n
    if (data.value.length > range.value)
      data.value.shift()
  }

  return {
    result,
    range,
    push,
    rounded,
  }
}
