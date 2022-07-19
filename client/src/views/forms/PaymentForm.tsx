import { useState } from 'react'
import { Box } from '@mui/material'

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
      <Box sx={{ mb: 4 }}>
        <label htmlFor='payment-type'>Pagamento:</label>
        <br />
        <select id='payment-type' value={paymentType} onChange={e => setPaymentType(Number(e.target.value))}>
          <option value={PaymentType.CARD}>CARTAO</option>
          <option value={PaymentType.BOLETO}>BOLETO</option>
        </select>
      </Box>

      {paymentType === PaymentType.CARD ? <CardPayment /> : <BoletoPayment />}
    </Box>
  )
}
