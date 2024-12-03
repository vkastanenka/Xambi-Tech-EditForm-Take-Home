// types
import { ValidationEnum } from '@/types'

export const validateValue = (
  value: unknown,
  attributeName: string,
  validationType: ValidationEnum
) => {
  switch (validationType) {
    case ValidationEnum.Email:
      if (
        value &&
        ((value as string).length > 100 ||
          !/\S+@\S+\.\S+/.test(value as string))
      ) {
        window.alert(`Error for "${attributeName}"\n\nEmail format is invalid.`)
        return false
      }
      break
    case ValidationEnum.PhoneNumber:
      if (
        value &&
        (!(value as string).match(/\d/g) ||
          ![10, 11].includes((value as string).match(/\d/g)?.length || 0))
      ) {
        window.alert(
          `Error for "${attributeName}"\n\nPhone number format is invalid.`
        )
        return
      }
      break
    case ValidationEnum.UserName:
      if (typeof value === 'string' || value instanceof String) {
        window.alert('Invalid User name')
        return false
      }
      if (!/^[a-z0-9_]+$/.test(value as string)) {
        window.alert('User name can only contain "a~z", number and "_".')
        return false
      }
      break
    case ValidationEnum.CheckboxChecked:
      if (!value) {
        window.alert(`Error for "${attributeName}"\n\nPlease check the box.`)
        return false
      }
      break

    case ValidationEnum.RequiredField:
      if (!value) {
        window.alert(attributeName + ' is required!')
        return false
      }
      break
    case ValidationEnum.TextLengthBelow30:
      if (!value) return true
      if (
        !(typeof value === 'string' || value instanceof String) ||
        value.length > 30
      ) {
        window.alert(
          `Error for "${attributeName}"\n\nNeeds to be shorter than 30 characters`
        )
        return false
      }
      break
    case ValidationEnum.TextLengthBelow50:
      if (!value) return true
      if (
        !(typeof value === 'string' || value instanceof String) ||
        value.length > 50
      ) {
        window.alert(
          `Error for "${attributeName}"\n\nNeeds to be shorter than 50 characters`
        )
        return false
      }
      break

    case ValidationEnum.TextLengthBelow100:
      if (!value) return true
      if (
        !(typeof value === 'string' || value instanceof String) ||
        value.length > 100
      ) {
        window.alert(
          `Error for "${attributeName}"\n\nNeeds to be shorter than 100 characters`
        )
        return false
      }
      break
    case ValidationEnum.TextLengthBelow200:
      if (!value) return true
      if (
        !(typeof value === 'string' || value instanceof String) ||
        value.length > 200
      ) {
        window.alert(
          `Error for "${attributeName}"\n\nNeeds to be shorter than 200 characters`
        )
        return false
      }
      break
    case ValidationEnum.TextLengthBelow300:
      if (!value) return true
      if (
        !(typeof value === 'string' || value instanceof String) ||
        value.length > 300
      ) {
        window.alert(
          `Error for "${attributeName}"\n\nNeeds to be shorter than 300 characters`
        )
        return false
      }
      break
    case ValidationEnum.TextLengthBelow400:
      if (!value) return true
      if (
        !(typeof value === 'string' || value instanceof String) ||
        value.length > 400
      ) {
        window.alert(
          `Error for "${attributeName}"\n\nNeeds to be shorter than 400 characters`
        )
        return false
      }
      break
    case ValidationEnum.Price:
      if (
        value &&
        ((value as string).length > 100 || !/^\d*\.?\d*$/.test(value as string))
      ) {
        window.alert(
          attributeName +
            ' is invalid. Please enter a valid number with only digits or a decimal.'
        )
        return false
      }
      if (
        value &&
        (value as string).split('.')[1] &&
        (value as string).split('.')[1].length > 2
      ) {
        window.alert(
          attributeName +
            ' is invalid. Please enter a valid number with only digits or a decimal.'
        )
        return false
      }
      const price = parseFloat(value as string)
      if (price <= 0 || price > 9999.0) {
        window.alert(
          `Error for "${attributeName}"\n\nPlease enter a number between 0-9999`
        )
        return false
      }

      break
    case ValidationEnum.Number:
      if (
        value &&
        ((value as string).length > 10 || !/^\d*\.?\d*$/.test(value as string))
      ) {
        window.alert(attributeName + ' is invalid. Please enter a valid number')
        return false
      }
      const number = parseInt(value as string, 10)
      if (number <= 0 || number > 999.0) {
        window.alert(
          `Error for "${attributeName}"\n\nPlease enter a number between 0-999`
        )
        return false
      }
      break
    default:
      break
  }
  return true
}
