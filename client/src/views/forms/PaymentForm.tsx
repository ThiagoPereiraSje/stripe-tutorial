import { useState } from 'react'
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

import CardPayment from './CardPayment'
import CardPayment2 from './CardPayment2'
import BoletoPayment from './BoletoPayment'

enum PaymentType {
  CARD = 1,
  BOLETO = 2,
  CARD2 = 3
}

export default function PaymentForm() {
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.CARD)
  let template: any

  switch (paymentType) {
    case PaymentType.CARD:
      template = <CardPayment />
      break

    case PaymentType.CARD2:
      template = <CardPayment2 />
      break

    case PaymentType.BOLETO:
      template = <BoletoPayment />
      break

    default:
      break
  }

  return (
    <Box>
      <Box sx={{ marginBottom: 4 }}>
        <FormControl fullWidth>
          <InputLabel id='payment-label'>Pagamento</InputLabel>
          <Select
            fullWidth
            labelId='payment-label'
            label='Pagamento'
            value={paymentType}
            onChange={e => setPaymentType(Number(e.target.value))}
          >
            <MenuItem value={PaymentType.CARD}>CARTAO</MenuItem>
            <MenuItem value={PaymentType.CARD2}>CARTAO2</MenuItem>
            <MenuItem value={PaymentType.BOLETO}>BOLETO</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {template}
    </Box>
  )
}
