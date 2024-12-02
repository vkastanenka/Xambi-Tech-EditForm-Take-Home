'use client'

export const TestForm = () => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()

        if (event.target instanceof HTMLFormElement) {
          console.log(event.target.length)
          console.log((event.target[0] as HTMLInputElement).name)
        }
      }}
    >
      Test Form
      <input
        id={'attribute-1'}
        name={'attribute-1'}
        type="text"
        autoComplete={'attribute-1'}
        defaultValue={'Attribute 1 Value'}
      />
      <input
        id={'attribute-2'}
        name={'attribute-2'}
        type="text"
        autoComplete={'attribute-2'}
        defaultValue={'Attribute 2 Value'}
      />
      <input
        id={'attribute-3'}
        name={'attribute-3'}
        type="text"
        autoComplete={'attribute-3'}
        defaultValue={'Attribute 3 Value'}
      />
      <button type="submit">Save</button>
    </form>
  )
}
