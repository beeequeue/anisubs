import { isIP, isPort, registerDecorator, ValidationOptions } from "class-validator"
import { BaseEntity } from "typeorm"

export const IsHost = (validationOptions?: ValidationOptions) => (
  obj: BaseEntity,
  propertyName: string,
) => {
  registerDecorator({
    name: "isHost",
    target: obj.constructor,
    propertyName,
    options: validationOptions,
    validator: {
      validate: (value: unknown) => {
        if (typeof value !== "string") return false

        const parts = value.split(":")

        if (parts.length !== 2) return false

        return isIP(parts[0]) && isPort(parts[1])
      }
    },
  })
}
