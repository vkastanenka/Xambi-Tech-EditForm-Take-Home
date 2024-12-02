// form input types
export enum EditEntryEnum {
  Text = 'Text',
  TextList = 'TextList',
  DoubleTextList = 'DoubleTextList',
  TextArea = 'TextArea',
  File = 'File',
  Address = 'Address',
  Photo = 'Photo',
  ProfilePhoto = 'ProfilePhoto',
  FilePhoto = 'FilePhoto',
  Radio = 'Radio',
  Checkbox = 'Checkbox',
  Article = 'Article',
  Date = 'Date',
  Select = 'Select',
  Showcase = 'Showcase',
}

// form input validation types
export enum ValidationEnum {
  Email = 'Email',
  PhoneNumber = 'PhoneNumber',
  UserName = 'UserName',
  CheckboxChecked = 'CheckboxChecked',
  RequiredField = 'RequiredField',
  TextLengthBelow30 = 'TextLengthBelow30',
  TextLengthBelow50 = 'TextLengthBelow50',
  TextLengthBelow100 = 'TextLengthBelow100',
  TextLengthBelow200 = 'TextLengthBelow200',
  TextLengthBelow300 = 'TextLengthBelow300',
  TextLengthBelow400 = 'TextLengthBelow400',
  Number = 'Number',
  Price = 'Price',
}

// form input
export interface EditEntryType {
  attribute: string
  attributeName: string
  subName?: string
  info?: string
  type: EditEntryEnum
  isRequired: boolean
  validations: ValidationEnum[]
  extraParam: unknown
  condition: unknown
  options?: string[]
  characterCount?: number
}

export interface AddressType {
  street_address: string
  city: string
  province: string
  country: string
  postal_code: string
}

export interface DoubleTextListValue {
  [x: string]: string
}

export interface Article {
  title: string
  content: string
  image_url: string
  subtitle?: string
  button_link?: string
}

export interface EntityObj {
  [key: string]: unknown
}
