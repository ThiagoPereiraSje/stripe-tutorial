import Cleave from 'cleave.js/react'
import { Props } from 'cleave.js/react/props'

// import { Box, Typography, TextField, InputAdornment } from '@mui/material'

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
