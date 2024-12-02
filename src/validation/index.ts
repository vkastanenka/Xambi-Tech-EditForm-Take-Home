import { ValidationEnum } from '@/types'

export const validateValue = (
  value: unknown,
  attributeName: string,
  validationType: ValidationEnum
) => {
  switch (validationType) {
    case ValidationEnum.Email:
      if (value && (value.length > 100 || !/\S+@\S+\.\S+/.test(value))) {
        // toast.error(`Error for "${attributeName}"\n\nEmail format is invalid.`)
        return false
      }
      break
    case ValidationEnum.PhoneNumber:
      if (
        value &&
        (!value.match(/\d/g) || ![10, 11].includes(value.match(/\d/g).length))
      ) {
        // toast.error(
        //   `Error for "${attributeName}"\n\nPhone number format is invalid.`
        // )
        return
      }
      break
    case ValidationEnum.UserName:
      if (typeof value === 'string' || value instanceof String) {
        // toast.error('Invalid User name')
        return false
      }
      if (!/^[a-z0-9_]+$/.test(value)) {
        // toast.error('User name can only contain "a~z", number and "_".')
        return false
      }
      break
    case ValidationEnum.CheckboxChecked:
      if (!value) {
        // toast.error(`Error for "${attributeName}"\n\nPlease check the box.`)
        return false
      }
      break

    case ValidationEnum.RequiredField:
      if (!value) {
        // toast.error(attributeName + ' is required!')
        return false
      }
      break
    case ValidationEnum.TextLengthBelow30:
      if (!value) return true
      if (
        !(typeof value === 'string' || value instanceof String) ||
        value.length > 30
      ) {
        // toast.error(
        //   `Error for "${attributeName}"\n\nNeeds to be shorter than 30 characters`
        // )
        return false
      }
      break
    case ValidationEnum.TextLengthBelow50:
      if (!value) return true
      if (
        !(typeof value === 'string' || value instanceof String) ||
        value.length > 50
      ) {
        // toast.error(
        //   `Error for "${attributeName}"\n\nNeeds to be shorter than 50 characters`
        // )
        return false
      }
      break

    case ValidationEnum.TextLengthBelow100:
      if (!value) return true
      if (
        !(typeof value === 'string' || value instanceof String) ||
        value.length > 100
      ) {
        // toast.error(
        //   `Error for "${attributeName}"\n\nNeeds to be shorter than 100 characters`
        // )
        return false
      }
      break
    case ValidationEnum.TextLengthBelow200:
      if (!value) return true
      if (
        !(typeof value === 'string' || value instanceof String) ||
        value.length > 200
      ) {
        // toast.error(
        //   `Error for "${attributeName}"\n\nNeeds to be shorter than 200 characters`
        // )
        return false
      }
      break
    case ValidationEnum.TextLengthBelow300:
      if (!value) return true
      if (
        !(typeof value === 'string' || value instanceof String) ||
        value.length > 300
      ) {
        // toast.error(
        //   `Error for "${attributeName}"\n\nNeeds to be shorter than 300 characters`
        // )
        return false
      }
      break
    case ValidationEnum.TextLengthBelow400:
      if (!value) return true
      if (
        !(typeof value === 'string' || value instanceof String) ||
        value.length > 400
      ) {
        // toast.error(
        //   `Error for "${attributeName}"\n\nNeeds to be shorter than 400 characters`
        // )
        return false
      }
      break
    case ValidationEnum.Price:
      if (value && (value.length > 100 || !/^\d*\.?\d*$/.test(value))) {
        // toast.error(
        //   attributeName +
        //     ' is invalid. Please enter a valid number with only digits or a decimal.'
        // )
        return false
      }
      if (value && value.split('.')[1] && value.split('.')[1].length > 2) {
        // toast.error(
        //   attributeName +
        //     ' is invalid. Please enter a valid number with only digits or a decimal.'
        // )
        return false
      }
      const price = parseFloat(value)
      if (price <= 0 || price > 9999.0) {
        // toast.error(
        //   `Error for "${attributeName}"\n\nPlease enter a number between 0-9999`
        // )
        return false
      }

      break
    case ValidationEnum.Number:
      if (value && (value.length > 10 || !/^\d*\.?\d*$/.test(value))) {
        // toast.error(attributeName + ' is invalid. Please enter a valid number')
        return false
      }
      const number = parseInt(value, 10)
      if (number <= 0 || number > 999.0) {
        // toast.error(
        //   `Error for "${attributeName}"\n\nPlease enter a number between 0-999`
        // )
        return false
      }
      break
    default:
      break
  }
  return true
}
