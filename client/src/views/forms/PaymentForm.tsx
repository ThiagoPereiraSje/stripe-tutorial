import { useState } from 'react'
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

import CardPayment from './CardPayment'
import BoletoPayment from './BoletoPayment'

enum PaymentType {
  CARD = 1,
  BOLETO = 2
}

export default function PaymentForm() {
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.CARD)

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
            <MenuItem value={PaymentType.BOLETO}>BOLETO</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {paymentType === PaymentType.CARD ? <CardPayment /> : <BoletoPayment />}
    </Box>
  )
}
