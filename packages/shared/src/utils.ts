import { URL } from "url"

import { RedisOptions } from "ioredis"

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

export const cleanTimestamp = (str: string) => {
  // eslint-disable-next-line prefer-const
  let [rest, ms] = str.split(".")

  rest = rest.replace(/^(?:00:)?(\d{2}:\d{2})/, "$1")

  if (ms != null) {
    ms = ms.replace(/0+$/, "")

    if (ms === "") return rest

    return `${rest}.${ms}`
  }

  return rest
}

export const compareTimestamps = <T extends { timestamp: string }>(
  one: T,
  two: T,
) => one.timestamp.localeCompare(two.timestamp)

export const getRedisConfig = (redisUrl: string) => (
  name: string,
): RedisOptions => {
  const { hostname, port, /*username,*/ password } = new URL(redisUrl)

  return {
    name,
    connectionName: name,
    host: hostname,
    port: Number(port),
    // username: username || undefined,
    password: password || undefined,
  }
}
