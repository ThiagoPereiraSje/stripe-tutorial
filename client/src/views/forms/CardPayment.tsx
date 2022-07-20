import { FormEvent, useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'

import { Typography, Box, TextField, InputAdornment, Button } from '@mui/material'
import { CleaveCurrency, numberFormat, numberInterFormat } from '../components/CleaveInput'

const url = '/create-payment'

const mRequest: RequestInit = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}

export default function CardPayment() {
  const elements = useElements()
  const stripe = useStripe()

  const [amount, setAmount] = useState<number | undefined>(10)
  const [messages, setMessages] = useState<string[]>([])

  const handleClean = () => {
    const cardElement = elements?.getElement(CardElement)

    setAmount(undefined)
    cardElement?.clear()
    setMessages([])
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!elements || !stripe) return

    setMessages(m => [...m, 'Creating payment intent...'])

    // Create payment intent on the server
    const { error: backendError, clientSecret } = await fetch(url, {
      ...mRequest,
      body: JSON.stringify({
        paymentMethod: 'card',
        amount: amount! * 100,
        currency: 'usd'
      })
    }).then(r => r.json())

    if (backendError) {
      setMessages(m => [...m, backendError?.message || 'Oops!'])

      return
    }

    setMessages(m => [...m, 'Payment intent created...'])

    // Confirm the payment on the client
    const cardElement: any = elements?.getElement(CardElement)

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement
      }
    })

    if (stripeError) {
      setMessages(m => [...m, stripeError?.message || 'Oops!'])

      return
    }

    setMessages(m => [...m, `Payment intent id: ${paymentIntent?.id}, status: ${paymentIntent?.status}`])
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 4 }}>
          <Box>
            <CardElement options={{ classes: { base: 'input-card-style' } }} />
          </Box>
          <Box>
            <TextField
              fullWidth
              label='Valor'
              placeholder='0,00'
              value={numberFormat(amount)}
              onBlur={e => setAmount(numberInterFormat(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position='start'>R$</InputAdornment>,

                inputComponent: props => <CleaveCurrency {...props} />
              }}
            />
          </Box>
          <Box>
            <Button type='submit' variant='contained' size='large'>
              Pagar
            </Button>
            &nbsp;
            <Button size='large' variant='outlined' onClick={handleClean}>
              Limpar
            </Button>
          </Box>
        </Box>
      </form>

      <Box sx={{ marginTop: '2rem' }}>
        {!!messages &&
          messages.map((message, key) => (
            <Typography key={key} sx={{ color: 'red' }}>
              {message}
            </Typography>
          ))}
      </Box>
    </div>
  )
}
