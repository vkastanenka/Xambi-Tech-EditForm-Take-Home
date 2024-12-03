'use client'

// components
import { EditForm } from '@/components/edit-form'

// types
import {
  EditEntryEnum,
  ValidationEnum,
  EditEntryType,
  EntityObj,
} from '@/types'

// Hypothetical editEntries
const editEntries = [
  {
    attribute: 'prescriptions',
    attributeName: 'prescriptions',
    type: EditEntryEnum.TextList,
    isRequired: true,
    validations: [ValidationEnum.TextLengthBelow50],
  },
] as EditEntryType[]

// Hypothetical entity
const entity = {
  id: '1234-5678',
  name: 'Susan Person',
  age: '37',
  prescriptions: ['Pill Label', 'Pill Label'],
}

// Hypothetical onSubmitSuccess
const onSubmitSuccess = (entity: EntityObj) => {
  window.alert(
    `Updated ${entity.name}'s prescription!\n${entity.prescriptions}`
  )
}

export const EditPatientForm = () => {
  return (
    <EditForm
      title="Victoria Form"
      description="Xambi Tech take home form implementation."
      editEntries={editEntries}
      entityObj={entity}
      onSubmitSuccess={onSubmitSuccess}
    />
  )
}
