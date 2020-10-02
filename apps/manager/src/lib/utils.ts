import { Response } from "superagent"

export type RequestSuccess<B extends Record<string, unknown> | null> = {
  status: 200 | 204
  ok: true
  body: B
} & Response

export type RequestError<
  B extends Record<string, unknown> | null = Record<string, unknown>
> = {
  status: 200 | 400 | 401 | 404 | 500 | 502 | 429
  ok: false
  body: B
} & Response

export type RequestResponse<
  D extends Record<string, unknown> = Record<string, unknown>,
  E extends Record<string, unknown> = Record<string, unknown>
> = RequestSuccess<D> | RequestError<E>

export const responseIsError = (
  res: RequestResponse | null,
): res is RequestError | null => {
  if (!res) return true

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return !!res?.body?.error || !!res?.error
}
