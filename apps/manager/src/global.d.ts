declare type KoaContext = { requestId: string }

declare type Context = Pick<import("koa").ParameterizedContext<KoaContext>, "req" | "res" | "state">
