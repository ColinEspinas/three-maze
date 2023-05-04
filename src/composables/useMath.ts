export function useMath() {
  const degToRad = (deg: number) => deg * (Math.PI / 180)

  return {
    degToRad,
  }
}
