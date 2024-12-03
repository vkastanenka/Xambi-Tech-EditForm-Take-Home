// form input types
export enum EditEntryEnum {
  Address = 'Address',
  Article = 'Article',
  Checkbox = 'Checkbox',
  Date = 'Date',
  DoubleTextList = 'DoubleTextList',
  File = 'File',
  FilePhoto = 'FilePhoto',
  Photo = 'Photo',
  ProfilePhoto = 'ProfilePhoto',
  Radio = 'Radio',
  Select = 'Select',
  Showcase = 'Showcase',
  Text = 'Text',
  TextArea = 'TextArea',
  TextList = 'TextList',
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
  characterCount?: number
  condition: unknown
  extraParam: unknown
  info?: string
  isRequired: boolean
  options?: string[]
  subName?: string
  type: EditEntryEnum
  validations: ValidationEnum[]
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
