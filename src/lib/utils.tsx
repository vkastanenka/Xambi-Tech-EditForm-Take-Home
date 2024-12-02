// filter falsy values from array
export const classNames = (...classes: unknown[]) => {
    return classes.filter(Boolean).join(' ')
}