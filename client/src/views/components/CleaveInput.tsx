import Cleave from 'cleave.js/react'
import { Props } from 'cleave.js/react/props'

type CleaveInputProps = {} & Omit<Props, 'options'>

// export function CleaveCard({ inputRef, ...rest }: CleaveInputProps) {
//   return <Cleave ref={inputRef} options={{ creditCard: true }} {...rest} />
// }

export function CleaveCPF({ ...rest }: CleaveInputProps) {
  return (
    <Cleave
      options={{
        delimiters: ['.', '.', '-'],
        blocks: [3, 3, 3, 2],
        numericOnly: true
      }}
      {...rest}
    />
  )
}

export function CleaveCEP({ ...rest }: CleaveInputProps) {
  return (
    <Cleave
      options={{
        delimiter: '-',
        blocks: [5, 3],
        numericOnly: true
      }}
      {...rest}
    />
  )
}

export function CleaveNumber({ ...rest }: CleaveInputProps) {
  return (
    <Cleave
      options={{
        numeral: true,
        numeralDecimalMark: ',',
        numeralDecimalScale: 2,
        delimiter: '.',
        numeralPositiveOnly: true
      }}
      {...rest}
    />
  )
}

export function numberFormat(value: any): string {
  if (!value || isNaN(value)) return ''

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

export function numberInterFormat(value: string): number {
  if (!value) return 0

  const formated = value?.replaceAll('.', '')?.replace(',', '.')
  const newNumber = Number(formated)

  if (isNaN(newNumber)) return 0

  return newNumber
}
