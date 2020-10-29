export const throttle = <Fn extends (...params: unknown[]) => void>(
  fn: Fn,
  ms: number,
): ((...params: Parameters<Fn>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (...params: Parameters<Fn>) => {
    if (timeoutId != null) {
      return
    }

    timeoutId = setTimeout(() => {
      clearTimeout(timeoutId!)
      timeoutId = null
    }, ms)
    fn(...params)
  }
}

export const formatBytes = (bytes: number) =>
  `${(bytes / 1_000_000).toFixed(0)}MB`
