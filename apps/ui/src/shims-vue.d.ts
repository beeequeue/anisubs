declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: DefineComponent<unknown, unknown, unknown>
  // eslint-disable-next-line import/no-default-export
  export default component
}
