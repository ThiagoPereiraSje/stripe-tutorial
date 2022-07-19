import Cleave from 'cleave.js/react'
import { Props } from 'cleave.js/react/props'

type CleaveInputProps = {
  inputRef: any
} & Omit<Props, 'options'>

export function CleaveCard({ inputRef, ...rest }: CleaveInputProps) {
  return <Cleave ref={inputRef} options={{ creditCard: true }} {...rest} />
}
