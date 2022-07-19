import { FormEvent, useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'

import { Typography, Box } from '@mui/material'

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

  const [amount, setAmount] = useState<number>()
  const [messages, setMessages] = useState<string[]>([])

  const handleClean = () => {
    const cardElement = elements?.getElement(CardElement)

    setAmount(0)
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
        amount: amount,
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
        <Box>
          <Box sx={{ mb: 2 }}>
            <label htmlFor='payment-value'>Valor: </label>
            <br />
            <input id='payment-value' type='number' value={amount} onChange={e => setAmount(Number(e.target.value))} />
          </Box>
          <Box sx={{ mb: 2 }}>
            <label htmlFor='card-element'>Cartao:</label>
            <CardElement id='card-element' />
          </Box>
          <button disabled={!amount}>Pagar</button> &nbsp;
          <button type='button' onClick={handleClean}>
            Limpar
          </button>
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
