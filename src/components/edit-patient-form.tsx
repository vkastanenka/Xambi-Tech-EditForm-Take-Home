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

const editEntries = [
  {
    attribute: 'prescriptions',
    attributeName: 'prescriptions',
    type: EditEntryEnum.TextList,
    isRequired: true,
    validations: [ValidationEnum.TextLengthBelow50],
  },
] as EditEntryType[]

const entity = {
  id: '1234-5678',
  name: 'Susan Person',
  age: '37',
  prescriptions: ['protein', 'sulfur', 'omega-3'],
}

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
