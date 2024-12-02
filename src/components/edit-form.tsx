'use client'

// utils
import { classNames } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { validateValue } from '@/validation'
// import toast from 'react-hot-toast'

// types
import {
  AddressType,
  Article,
  DoubleTextListValue,
  EditEntryEnum,
  EditEntryType,
} from '@/types'

/**
 * Edit form - React functional client component
 * 
 * @param {string} props.title - Form title.
 * @param {string} props.description - Form description.
 * @param {string} props.buttonText - Form button text.
 * @param {editEntries} props.editEntries[] - Variable form inputs.
 * @param {unknown} props.entityObj - Model object form is updating.
 * @param {onSubmitSuccess} props.onSubmitSuccess - Form success callback.

 * @returns {React.FC<EditFormProps>} Modular form accepting multiple input types.
 */

interface EntityObj {
  [key: string]: unknown
}

interface EditFormProps {
  title: string
  description: string
  buttonText?: string
  editEntries: [EditEntryType]
  entityObj: unknown
  onSubmitSuccess: (entity: EntityObj) => void
}

export const EditForm: React.FC<EditFormProps> = (props: EditFormProps) => {
  const [entity, setEntity] = useState<unknown>(props.entityObj)
  const [characterCounts, setCharacterCounts] = useState<{
    [key: string]: number
  }>({})

  // Set entity object to state on page load
  useEffect(() => {
    setEntity(props.entityObj)
  }, [props.entityObj])

  // Determine size of array field entry types in editEntries
  const [listFieldSize, setListFieldSize] = useState<number[]>([])
  useEffect(() => {
    const currListFieldSize = props.editEntries.map((entry) => {
      const typedEntityObj = props.entityObj as EntityObj
      // Check if entry is an array field
      const isArrField =
        (props.entityObj as EntityObj) &&
        (entry.type === EditEntryEnum.TextList ||
          entry.type === EditEntryEnum.DoubleTextList)
      // If is populated array and entity object has the entry attribute field key
      if (isArrField) {
        const entryObjAttribute =
          entry.attribute in typedEntityObj && typedEntityObj[entry.attribute]
        const entryObjAttributeIsArr = Array.isArray(entryObjAttribute)
        if (entryObjAttributeIsArr) return Object.keys(entryObjAttribute).length
      }
      return 0
    })
    setListFieldSize(currListFieldSize)
  }, [props.editEntries, props.entityObj])

  // Sets form radio field values from editEntries
  const [radioFieldValue, setRadioFieldValue] = useState<string[]>([])
  useEffect(() => {
    const currRadioFieldValue = props.editEntries.map((entry) => {
      const typedEntityObj = props.entityObj as EntityObj
      const isRadioField = typedEntityObj && entry.type === EditEntryEnum.Radio
      return isRadioField ? (typedEntityObj[entry.attribute] as string) : ''
    })
    setRadioFieldValue(currRadioFieldValue)
  }, [props.editEntries, props.entityObj])

  // Sets form checkbox field value from editEntries
  const [checkboxFieldValue, setCheckboxFieldValue] = useState<
    (boolean | null)[]
  >([])
  useEffect(() => {
    const currCheckboxFieldValue = props.editEntries.map((entry) => {
      const typedEntityObj = props.entityObj as EntityObj
      const isCheckboxField =
        typedEntityObj && entry.type === EditEntryEnum.Checkbox
      return isCheckboxField
        ? (typedEntityObj[entry.attribute] as boolean)
        : null
    })
    setCheckboxFieldValue(currCheckboxFieldValue)
  }, [props.editEntries, props.entityObj])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative lg:pt-5 text-left">
      <form
        className="space-y-8 divide-y divide-gray-200"
        onSubmit={(event) => {
          event.preventDefault()
          const typedEntityObj = entity as EntityObj

          // Prevent submit and alert if no entity object or if no id
          if (!typedEntityObj || !typedEntityObj['id']) {
            // toast.error("Unknown error.");
            return
          }

          // entityObj attributes to be updated
          const updateTargets = new Set(
            props.editEntries.map((editEntry) => editEntry.attribute)
          )

          // Index and attribute name of each input
          const editEntryIdx = Object.fromEntries(
            props.editEntries.map((editEntry, index) => [
              editEntry.attribute,
              index,
            ])
          )

          // Loops through each input element of the form
          for (const inputElement of event.target as HTMLFormElement) {
            const target = inputElement as HTMLInputElement
            if (!target.name) continue

            // Update entity value to input value if name is included in update targets
            if (updateTargets.has(target.name)) {
              // if target is radio button, only update if it is checked
              if (target.type === 'radio' && !target.checked) continue
              setEntity((prevState: EntityObj) => ({
                ...prevState,
                [target.name]: target.value,
              }))
            }

            // TextLists
            else if (
              target.name.includes('_') &&
              updateTargets.has(target.name.split('_')[0])
            ) {
              // Attribute name
              const entity_field = target.name.split('_')[0]
              // List field index (e.g., listfieldidx_0_0)
              const entity_sub_field = target.name.split('_').slice(1).join('_')

              // DoubleTextList implementation
              if (entity_sub_field.includes('listfieldidx_')) {
                // Attribute array index
                const entity_curr_idx = Number(entity_sub_field.split('_')[1])
                // Attribute array subindex
                const entity_sub_sub_field = entity_sub_field
                  .split('_')
                  .slice(2)[0]

                // Maximum loop amount
                const max_idx_to_take =
                  listFieldSize[editEntryIdx[entity_field]]
                if (entity_curr_idx >= max_idx_to_take) continue

                // Set entityObj DoubleTextList attribute to empty array if not in entity
                if (!typedEntityObj[entity_field]) {
                  setEntity((prevState: EntityObj) => ({
                    ...prevState,
                    [entity_field]: [],
                  }))
                }

                // Set entityObj DoubleTextList attribute array index to empty array if doesn't exist
                if (
                  !(typedEntityObj[entity_field] as DoubleTextListValue[])[
                    entity_curr_idx
                  ]
                ) {
                  setEntity((prevState: EntityObj) => ({
                    ...prevState,
                    [entity_field]: (
                      prevState[entity_field] as DoubleTextListValue[]
                    ).map((value, idx) => {
                      if (idx === entity_curr_idx) return []
                      return value
                    }),
                  }))
                }

                // Set entityObj DoubleTextList attribute array index subarray index to target value
                setEntity((prevState: EntityObj) => ({
                  ...prevState,
                  [entity_field]: (
                    prevState[entity_field] as DoubleTextListValue[]
                  ).map((value, idx) => {
                    if (idx === entity_curr_idx) {
                      value[entity_sub_sub_field] = target.value
                      return value
                    }
                    return value
                  }),
                }))
              }

              // TextList implementation
              else if (entity_sub_field.includes('listfieldsingleidx_')) {
                // Attribute array index
                const entity_curr_idx = Number(entity_sub_field.split('_')[1])

                // Maximum loop amount
                const max_idx_to_take =
                  listFieldSize[editEntryIdx[entity_field]]
                if (entity_curr_idx >= max_idx_to_take) continue

                // Set entityObj TextList attribute to empty array if not in entity
                if (!typedEntityObj[entity_field]) {
                  setEntity((prevState: EntityObj) => ({
                    ...prevState,
                    [entity_field]: [],
                  }))
                }

                setEntity((prevState: EntityObj) => ({
                  ...prevState,
                  [entity_field]: (prevState[entity_field] as string[]).map(
                    (value, idx) => {
                      if (idx === entity_curr_idx) return target.value
                      return value
                    }
                  ),
                }))

                console.log(
                  (entity as EntityObj)[entity_field],
                  (entity as EntityObj)['badges'],
                  entity
                )
              }

              // Article implementation
              else {
                if (!typedEntityObj[entity_field]) {
                  typedEntityObj[entity_field] = {}
                }

                if (
                  typeof target.value === 'string' &&
                  (target.value.includes('\n') ||
                    (entity_sub_field === 'content' && target.value))
                ) {
                  setEntity((prevState: EntityObj) => ({
                    ...prevState,
                    [entity_field]: {
                      entity_sub_field: target.value
                        .split('\n')
                        .filter((e) => !!e),
                    },
                  }))
                } else {
                  setEntity((prevState: EntityObj) => ({
                    ...prevState,
                    [entity_field]: {
                      entity_sub_field: target.value,
                    },
                  }))
                }
              }
            }
          }

          for (const editEntry of props.editEntries) {
            if (editEntry.isRequired) {
              if (!typedEntityObj[editEntry.attribute]) {
                // toast.error(`Field is required: "${editEntry.attributeName}"`)
                return
              }
            }

            if (editEntry.type === EditEntryEnum.Checkbox) {
              const editEntryIdx = props.editEntries.indexOf(editEntry)

              if (editEntryIdx > -1) {
                setEntity((prevState: EntityObj) => ({
                  ...prevState,
                  [editEntry.attribute]: checkboxFieldValue[editEntryIdx],
                }))
              }
            }

            // For Article fields
            if (editEntry.type === EditEntryEnum.Article) {
              const article = typedEntityObj[editEntry.attribute] as Article

              const filledCount = [
                article['title'],
                article['content'],
                article['image_url'],
                article['subtitle'],
                article['button_link'],
              ].filter((e) => e).length

              const mandatoryFilledCount = [
                article['title'],
                article['content'],
                article['image_url'],
              ].filter((e) => e).length

              if (filledCount > 0 && mandatoryFilledCount < 3) {
                console.log(
                  filledCount,
                  mandatoryFilledCount,
                  article['title'],
                  article['content'],
                  article['image_url']
                )
                // toast.error(
                //   'Title, Content, and Photo are required for ' +
                //     editEntry.attributeName +
                //     '.'
                // )
                return
              }
              if (!article['title'] && !article['content']) {
                setEntity((prevState: EntityObj) => ({
                  ...prevState,
                  [editEntry.attribute]: {},
                }))
              }
            }

            // For TextList fields
            // const max_idx_to_take =
            //   listFieldSize[editEntryIdx[editEntry.attribute]]
            // if (max_idx_to_take > 0) {
            //   setEntity((prevState: EntityObj) => ({
            //     ...prevState,
            //     [editEntry.attribute]: Object.fromEntries(
            //       Object.entries((entity as EntityObj)[editEntry.attribute]).filter(
            //         ([k, v]) =>
            //           parseInt(k, 10) < max_idx_to_take && v['0'] && v['1']
            //       )
            //     ),
            //   }))
            // }

            if (editEntry.validations) {
              for (const validation of editEntry.validations) {
                if (
                  !validateValue(
                    (entity as EntityObj)[editEntry.attribute],
                    editEntry.attributeName,
                    validation
                  )
                ) {
                  return
                }
              }
            }
          }

          if (props.onSubmitSuccess) {
            try {
              props.onSubmitSuccess(entity as EntityObj)
              // toast.success('Successfully submitted!')
            } catch (error) {
              console.log(error)
            }
          }
        }}
      >
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div>
              <h3 className="text-3xl font-medium leading-6 text-gray-900">
                {props.title}
              </h3>
              <p className="my-2 text-sm text-gray-500">{props.description}</p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {props.editEntries.map((editEntry: EditEntryType, index) => {
                if (editEntry.condition != null && !editEntry.condition) return

                const requiredMark = editEntry.isRequired ? '*' : ''

                const defaultStringValue =
                  entity &&
                  ((entity as EntityObj)[editEntry.attribute] as string)
                    ? ((entity as EntityObj)[editEntry.attribute] as string)
                    : ''

                if (!editEntry.type || editEntry.type == EditEntryEnum.Text) {
                  return (
                    <div
                      key={editEntry.attribute}
                      className="col-span-6 sm:col-span-3"
                    >
                      <label
                        htmlFor={editEntry.attribute}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {editEntry.attributeName + requiredMark}
                        {editEntry.subName && (
                          <span className="block text-xs text-gray-500">
                            {editEntry.subName}
                          </span>
                        )}
                      </label>
                      <div className="my-2">
                        <input
                          id={editEntry.attribute}
                          name={editEntry.attribute}
                          type="text"
                          autoComplete={editEntry.attribute}
                          defaultValue={defaultStringValue}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      {editEntry.info && (
                        <p className="text-sm text-gray-500">
                          {editEntry.info}
                        </p>
                      )}
                    </div>
                  )
                } else if (
                  editEntry.type == EditEntryEnum.Select &&
                  editEntry.options &&
                  editEntry.options?.length > 0
                ) {
                  return (
                    <div
                      key={editEntry.attribute}
                      className="col-span-6 sm:col-span-3"
                    >
                      <label
                        htmlFor={editEntry.attribute}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {editEntry.attributeName + requiredMark}
                        {editEntry.subName && (
                          <span className="block text-xs text-gray-500">
                            {editEntry.subName}
                          </span>
                        )}
                      </label>
                      <div className="my-2">
                        <select
                          id={editEntry.attribute}
                          name={editEntry.attribute}
                          autoComplete={editEntry.attribute}
                          defaultValue={defaultStringValue}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {editEntry.options.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </div>
                    </div>
                  )
                } else if (editEntry.type == EditEntryEnum.Date) {
                  return (
                    <div
                      key={editEntry.attribute}
                      className="col-span-6 sm:col-span-3"
                    >
                      <label
                        htmlFor={editEntry.attribute}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {editEntry.attributeName + requiredMark}
                        {editEntry.subName && (
                          <span className="block text-xs text-gray-500">
                            {editEntry.subName}
                          </span>
                        )}
                      </label>
                      <div className="my-2">
                        <input
                          id={editEntry.attribute}
                          name={editEntry.attribute}
                          type="text"
                          autoComplete={editEntry.attribute}
                          defaultValue={defaultStringValue}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  )
                } else if (editEntry.type == EditEntryEnum.TextList) {
                  return (
                    <div key={editEntry.attribute} className="col-span-6">
                      <div className="relative py-5">
                        <div
                          className="absolute inset-0 flex items-center"
                          aria-hidden="true"
                        >
                          <div className="w-full border-t border-gray-300" />
                        </div>
                      </div>
                      <div className="col-span-6 pb-2">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          {editEntry.attributeName + requiredMark}
                        </h3>
                      </div>
                      {Array.from(Array(listFieldSize[index]).keys()).map(
                        (i) => {
                          const defaultStringArrValue =
                            entity &&
                            ((entity as EntityObj)[
                              editEntry.attribute
                            ] as string[]) &&
                            (
                              (entity as EntityObj)[
                                editEntry.attribute
                              ] as string[]
                            )[i]
                              ? (
                                  (entity as EntityObj)[
                                    editEntry.attribute
                                  ] as string[]
                                )[i]
                              : ''

                          return (
                            <div key={editEntry.attribute} className="my-2">
                              <input
                                id={
                                  editEntry.attribute +
                                  '_listfieldsingleidx_' +
                                  i
                                }
                                name={
                                  editEntry.attribute +
                                  '_listfieldsingleidx_' +
                                  i
                                }
                                type="text"
                                defaultValue={defaultStringArrValue}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          )
                        }
                      )}
                      <div className="flex">
                        <button
                          type="button"
                          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={() => {
                            const newListFieldSize = [...listFieldSize]
                            newListFieldSize[index] = Math.min(
                              10,
                              newListFieldSize[index] + 1
                            )
                            setListFieldSize(newListFieldSize)
                          }}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          className="ml-3 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={() => {
                            const newListFieldSize = [...listFieldSize]
                            newListFieldSize[index] = Math.max(
                              1,
                              newListFieldSize[index] - 1
                            )
                            setListFieldSize(newListFieldSize)
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                } else if (editEntry.type == EditEntryEnum.DoubleTextList) {
                  return (
                    <div key={editEntry.attribute} className="col-span-6">
                      <div className="relative py-5">
                        <div
                          className="absolute inset-0 flex items-center"
                          aria-hidden="true"
                        >
                          <div className="w-full border-t border-gray-300" />
                        </div>
                      </div>
                      <div className="col-span-6 pb-2">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          {editEntry.attributeName + requiredMark}
                        </h3>
                        {editEntry.subName && (
                          <p className="text-sm text-gray-500">
                            {editEntry.subName}
                          </p>
                        )}
                      </div>
                      {Array.from(Array(listFieldSize[index]).keys()).map(
                        (i) => {
                          const defaultStringArrQuestionValue =
                            entity &&
                            ((entity as EntityObj)[editEntry.attribute] as [
                              string[]
                            ]) &&
                            (
                              (entity as EntityObj)[editEntry.attribute] as [
                                string[]
                              ]
                            )[i]
                              ? (
                                  (entity as EntityObj)[
                                    editEntry.attribute
                                  ] as [string[]]
                                )[i][0]
                              : ''

                          const defaultStringArrAnswerValue =
                            entity &&
                            ((entity as EntityObj)[editEntry.attribute] as [
                              string[]
                            ]) &&
                            (
                              (entity as EntityObj)[editEntry.attribute] as [
                                string[]
                              ]
                            )[i]
                              ? (
                                  (entity as EntityObj)[
                                    editEntry.attribute
                                  ] as [string[]]
                                )[i][1]
                              : ''

                          return (
                            <>
                              <label
                                htmlFor={editEntry.attribute}
                                className="block text-sm font-medium text-gray-700"
                              >
                                {'Question ' + (i + 1).toString()}
                              </label>
                              <div className="my-2">
                                <input
                                  id={
                                    editEntry.attribute +
                                    '_listfieldidx_' +
                                    i +
                                    '_0'
                                  }
                                  name={
                                    editEntry.attribute +
                                    '_listfieldidx_' +
                                    i +
                                    '_0'
                                  }
                                  type="text"
                                  defaultValue={defaultStringArrQuestionValue}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                              <label
                                htmlFor={editEntry.attribute}
                                className="block text-sm font-medium text-gray-700"
                              >
                                {'Answer ' + (i + 1).toString()}
                              </label>
                              <div className="my-2">
                                <input
                                  id={
                                    editEntry.attribute +
                                    '_listfieldidx_' +
                                    i +
                                    '_1'
                                  }
                                  name={
                                    editEntry.attribute +
                                    '_listfieldidx_' +
                                    i +
                                    '_1'
                                  }
                                  type="text"
                                  defaultValue={defaultStringArrAnswerValue}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                            </>
                          )
                        }
                      )}
                      <div className="flex">
                        <button
                          type="button"
                          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={() => {
                            const newListFieldSize = [...listFieldSize]
                            newListFieldSize[index] = Math.min(
                              10,
                              newListFieldSize[index] + 1
                            )
                            setListFieldSize(newListFieldSize)
                          }}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          className="ml-3 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={() => {
                            const newListFieldSize = [...listFieldSize]
                            newListFieldSize[index] = Math.max(
                              1,
                              newListFieldSize[index] - 1
                            )
                            setListFieldSize(newListFieldSize)
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                } else if (editEntry.type == EditEntryEnum.Checkbox) {
                  return (
                    <div
                      key={editEntry.attribute}
                      className="col-span-6 relative flex items-start"
                    >
                      <div className="flex h-5 items-center">
                        <input
                          type="checkbox"
                          id={editEntry.attribute}
                          name={editEntry.attribute}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={(e) => {
                            const currCheckboxFieldValue = [
                              ...checkboxFieldValue,
                            ]
                            currCheckboxFieldValue[index] =
                              !!e.currentTarget.value
                            setCheckboxFieldValue(currCheckboxFieldValue)
                          }}
                        />
                      </div>
                      <div className="ml-2 text-sm">
                        <label
                          htmlFor={editEntry.attribute}
                          className="font-medium text-gray-700"
                        >
                          {editEntry.attributeName}
                        </label>
                        <p className="text-gray-500">{editEntry.subName}</p>
                      </div>
                    </div>
                  )
                } else if (
                  editEntry.type == EditEntryEnum.Radio &&
                  editEntry.options &&
                  editEntry.options?.length > 0
                ) {
                  return (
                    <div key={editEntry.attribute} className="col-span-6">
                      <label
                        htmlFor={editEntry.attribute}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {editEntry.attributeName + requiredMark}
                        {editEntry.subName && (
                          <span className="block text-xs text-gray-500">
                            {editEntry.subName}
                          </span>
                        )}
                      </label>
                      <fieldset className="mt-4">
                        <div className="space-y-4">
                          {editEntry.options.map((option) => (
                            <div key={option} className="flex items-center">
                              <input
                                name={editEntry.attribute}
                                type="radio"
                                checked={
                                  String(radioFieldValue[index]) === option
                                }
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                value={option}
                                onChange={(e) => {
                                  const currRadioFieldValue = [
                                    ...radioFieldValue,
                                  ]
                                  currRadioFieldValue[index] =
                                    e.currentTarget.value
                                  setRadioFieldValue(currRadioFieldValue)
                                }}
                              />
                              <label className="ml-3 block text-sm font-medium text-gray-700">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  )
                } else if (editEntry.type == EditEntryEnum.TextArea) {
                  return (
                    <div key={editEntry.attribute} className="col-span-6">
                      <label
                        htmlFor="company_description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {editEntry.attributeName + requiredMark}
                        {editEntry.subName && (
                          <span className="block text-xs text-gray-500">
                            {editEntry.subName}
                          </span>
                        )}
                      </label>
                      <div className="my-2">
                        <textarea
                          id={editEntry.attribute}
                          name={editEntry.attribute}
                          rows={3}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          defaultValue={defaultStringValue}
                          onChange={(event) => {
                            const characterCount = event.target.value.length
                            setCharacterCounts({
                              ...characterCounts,
                              [editEntry.attribute]: characterCount,
                            })
                          }}
                        />
                        {editEntry.characterCount && (
                          <p
                            className={classNames(
                              'mt-3 text-sm',
                              characterCounts[editEntry.attribute] &&
                                characterCounts[editEntry.attribute] >
                                  editEntry.characterCount
                                ? 'text-red-500'
                                : 'text-gray-500'
                            )}
                          >
                            Character Count:{' '}
                            {characterCounts[editEntry.attribute]
                              ? characterCounts[editEntry.attribute]
                              : 0}
                            /{editEntry.characterCount}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                } else if (editEntry.type == EditEntryEnum.Address) {
                  const entityAddress =
                    entity &&
                    ((entity as EntityObj)[editEntry.attribute] as AddressType)
                      ? ((entity as EntityObj)[
                          editEntry.attribute
                        ] as AddressType)
                      : null

                  return (
                    <div key={editEntry.attribute} className="col-span-6">
                      <div className="relative my-5">
                        <div
                          className="absolute inset-0 flex items-center"
                          aria-hidden="true"
                        >
                          <div className="w-full border-t border-gray-300" />
                        </div>
                      </div>
                      <div className="col-span-6 py-2">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          {editEntry.attributeName}
                        </h3>
                      </div>
                      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="col-span-6">
                          <label
                            htmlFor="first-name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Street Address
                          </label>
                          <div className="my-2">
                            <input
                              type="text"
                              name={editEntry.attribute + '_street_address'}
                              id={editEntry.attribute + '_street_address'}
                              defaultValue={
                                entityAddress
                                  ? entityAddress['street_address']
                                  : ''
                              }
                              autoComplete="street-address"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="last-name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            City/Town
                          </label>
                          <div className="my-2">
                            <input
                              type="text"
                              name={editEntry.attribute + '_city'}
                              id={editEntry.attribute + '_city'}
                              defaultValue={
                                entityAddress ? entityAddress['city'] : ''
                              }
                              autoComplete="city"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="last-name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            State
                          </label>
                          <div className="my-2">
                            <input
                              type="text"
                              name={editEntry.attribute + '_province'}
                              id={editEntry.attribute + '_province'}
                              defaultValue={
                                entityAddress ? entityAddress['province'] : ''
                              }
                              autoComplete="province"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Country*
                          </label>
                          <div className="my-2">
                            <select
                              id={editEntry.attribute + '_country'}
                              name={editEntry.attribute + '_country'}
                              autoComplete="country-name"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                              <option
                                selected={
                                  (entityAddress &&
                                    entityAddress['country'] ===
                                      'United States') ||
                                  false
                                }
                              >
                                United States
                              </option>
                              <option
                                selected={
                                  (entityAddress &&
                                    entityAddress['country'] === 'Canada') ||
                                  false
                                }
                              >
                                Canada
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="last-name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Postal Code
                          </label>
                          <div className="my-2">
                            <input
                              type="text"
                              name={editEntry.attribute + '_postal_code'}
                              id={editEntry.attribute + '_postal_code'}
                              defaultValue={
                                entityAddress
                                  ? entityAddress['postal_code']
                                  : ''
                              }
                              autoComplete="postal-code"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
              })}
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {props.buttonText ? props.buttonText : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
