import { Response } from "got"

type BadResponse<T> = Response<T> & {
  statusCode: 200 | 400 | 401 | 404 | 500 | 502 | 429
}

export const responseIsError = <T>(
  res: Response<T> | null,
): res is BadResponse<T> | null => {
  if (res == null || res.statusCode > 299) return true

  return res.body == null
}
