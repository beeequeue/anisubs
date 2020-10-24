import { registerDecorator, ValidationOptions } from "class-validator"
import { BaseEntity } from "typeorm"

const timestampRegex = /^\d{2}:\d{2}:\d{2}$/

export const IsTimestamp = (validationOptions?: ValidationOptions) => (
  obj: BaseEntity,
  propertyName: string,
) => {
  registerDecorator({
    name: "isTimestamp",
    target: obj.constructor,
    propertyName,
    options: validationOptions,
    validator: {
      validate: (value: unknown) =>
        typeof value === "string" && timestampRegex.test(value),
    },
  })
}
