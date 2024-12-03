// components
import { X } from 'lucide-react'

// utils
import { useState, useEffect, useRef } from 'react'

// types
import { EditEntryType, EntityObj } from '@/types'

interface PillList {
  editEntry: EditEntryType
  entity: unknown
  index: number
  listFieldSize: number[]
  requiredMark: string
  setEntity: React.Dispatch<unknown>
  setListFieldSize: React.Dispatch<React.SetStateAction<number[]>>
}

interface PillListInput {
  defaultValue: string
  editEntry: EditEntryType
  entity: unknown
  i: number
  index: number
  listFieldSize: number[]
  setEntity: React.Dispatch<unknown>
  setListFieldSize: React.Dispatch<React.SetStateAction<number[]>>
}

/**
 * Based on previous TextList implementation.
 * Inputs are mapped from the length, and the entity is updated based on edits and deletes
 */

export const PillList: React.FC<PillList> = ({
  editEntry,
  requiredMark,
  listFieldSize,
  index,
  setListFieldSize,
  entity,
  setEntity,
}) => {
  return (
    <div key={editEntry.attribute} className="col-span-6">
      <div className="relative py-5">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>
      <div className="col-span-6 pb-2">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {editEntry.attributeName + requiredMark}
        </h3>
      </div>
      <div className="p-1 flex items-center flex-wrap gap-2 relative min-h-[42px]">
        <button
          className="absolute top-0 left-0 w-full h-full transition-colors border-[1px] rounded-md hover:border-blue-500 focus:border-blue-500"
          onClick={(e) => {
            e.preventDefault()
            const newListFieldSize = [...listFieldSize]
            newListFieldSize[index] = Math.min(10, newListFieldSize[index] + 1)
            setListFieldSize(newListFieldSize)
          }}
        ></button>

        {Array.from(Array(listFieldSize[index]).keys()).map((i) => {
          const defaultValue =
            (entity as EntityObj) &&
            ((entity as EntityObj)[editEntry.attribute] as string[]) &&
            ((entity as EntityObj)[editEntry.attribute] as string[])[i]
              ? ((entity as EntityObj)[editEntry.attribute] as string[])[i]
              : ''

          return (
            <PillListInput
              key={i}
              editEntry={editEntry}
              i={i}
              index={index}
              listFieldSize={listFieldSize}
              defaultValue={defaultValue}
              setListFieldSize={setListFieldSize}
              entity={entity}
              setEntity={setEntity}
            />
          )
        })}
      </div>
    </div>
  )
}

const PillListInput: React.FC<PillListInput> = ({
  editEntry,
  index,
  i,
  listFieldSize,
  defaultValue,
  setListFieldSize,
  entity,
  setEntity,
}) => {
  const typedEntity = entity as EntityObj
  const typedEntityAttribute = (entity as EntityObj)[
    editEntry.attribute
  ] as string[]

  const spanEl = useRef<HTMLSpanElement>(null)
  const inputEl = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState<boolean>(!defaultValue)

  useEffect(() => {
    const inputElCurrent = inputEl.current

    // Update input width based on span width
    const inputElCallback = (event: Event) => {
      const el = event.target as HTMLInputElement
      if (spanEl.current) {
        spanEl.current.innerHTML = el.value
        el.style.width = spanEl.current.offsetWidth + 'px'
      }
    }

    // When component mounts, if input and span, focus on the input
    if (inputElCurrent && spanEl.current) {
      inputElCurrent.focus()
      inputElCurrent.style.width = spanEl.current.offsetWidth + 'px'
      inputElCurrent.addEventListener('input', inputElCallback)
    }

    // Remove event listeners on component unmount
    return () => inputElCurrent?.removeEventListener('input', inputElCallback)
  }, [isEditing])

  // When not editing, return a button to change state and mount input
  if (!isEditing) {
    return (
      <div
        key={i}
        className="transition-colors p-1 border-[1px] rounded-md flex gap-1 items-center relative z-20 bg-white"
      >
        <button
          className="text-blue-700 hover:bg-slate-100 focus:bg-slate-100 break-all text-left"
          onClick={(e) => {
            e.preventDefault()
            setIsEditing(true)
          }}
        >
          {typedEntityAttribute[i]}
        </button>
        <button
          className="text-slate-500 hover:text-blue-700 focus:text-blue-700"
          onClick={(e) => {
            e.preventDefault()

            // Shorten field size
            const newListFieldSize = [...listFieldSize]
            newListFieldSize[index] = Math.max(0, newListFieldSize[index] - 1)
            setListFieldSize(newListFieldSize)

            // Update entity in state
            typedEntityAttribute.splice(i, 1)
            setEntity(typedEntity)
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // When editing, render input
  return (
    <div key={i} className="p-1 border-[1px] rounded-md relative z-20 bg-white">
      <input
        ref={inputEl}
        id={editEntry.attribute + '_listfieldsingleidx_' + i}
        name={editEntry.attribute + '_listfieldsingleidx_' + i}
        type="text"
        className="w-2 max-w-[300px] rounded-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-transparent"
        defaultValue={typedEntityAttribute[i]}
        onBlur={(e) => {
          e.preventDefault()

          // No input value, decrease field size and remove input
          if (!e.target.value) {
            const newListFieldSize = [...listFieldSize]
            newListFieldSize[index] = Math.max(1, newListFieldSize[index] - 1)
            setListFieldSize(newListFieldSize)
            return
          }

          // Update if value already present, otherwise add to entity
          if (typedEntityAttribute[i]) {
            typedEntityAttribute.splice(i, 1, e.target.value)
          } else {
            typedEntityAttribute.push(e.target.value)
          }

          setEntity(typedEntity)
          setIsEditing(false)
          return
        }}
      />
      <span
        ref={spanEl}
        className="absolute -left-[9999px] inline-block min-w-2"
      >
        {typedEntityAttribute[i]}
      </span>
    </div>
  )
}
