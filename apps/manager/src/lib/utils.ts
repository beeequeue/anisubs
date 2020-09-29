import { Response } from "superagent"

export type RequestSuccess<B extends {} | null> = {
  status: 200 | 204
  ok: true
  body: B
} & Response

export type RequestError<B extends object | null> = {
  status: 200 | 400 | 401 | 404 | 500 | 502 | 429
  ok: false
  body: B
} & Response

export type RequestResponse<D extends object = any, E extends object = any> =
  | RequestSuccess<D>
  | RequestError<E>

export const responseIsError = (
  res: RequestResponse | null,
): res is RequestError<any> | null => {
  if (!res) return true

  return !!(res as any)?.body?.error || !!res?.error
}
