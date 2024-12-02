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
    validations: [ValidationEnum.TextLengthBelow200],
  },
] as EditEntryType[]

const entity = {
  id: '1234-5678',
  name: 'Susan Person',
  age: '37',
}

const onSubmitSuccess = (entity: EntityObj) => {
  console.log(`Updated ${entity.name}'s prescription!`, entity)
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
