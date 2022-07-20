import { FormEvent, useRef, useState } from 'react'
import {
  StripeCardNumberElement,
  StripeCardExpiryElement,
  StripeCardCvcElement,
  StripeCardNumberElementChangeEvent
} from '@stripe/stripe-js'
import { useElements, useStripe, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'

import { Typography, Box, TextField, InputAdornment, Button } from '@mui/material'
import { CleaveNumber, numberFormat, numberInterFormat } from '../components/CleaveInput'

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
  const cardNumber = useRef<StripeCardNumberElement>()
  const cardExpiry = useRef<StripeCardExpiryElement>()
  const cardCvc = useRef<StripeCardCvcElement>()

  const [name, setName] = useState('')
  const [amount, setAmount] = useState<number | undefined>()
  const [messages, setMessages] = useState<string[]>([])

  const handleClean = () => {
    setName('')
    setAmount(undefined)
    cardNumber.current?.clear()
    cardExpiry.current?.clear()
    cardCvc.current?.clear()
    setMessages([])
  }

  const handleCardNumberChange = (e: StripeCardNumberElementChangeEvent) => {
    console.log(e)

    // const el = document.querySelector('.InputElement .is-invalid .Input') as HTMLInputElement

    // console.log(el)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!elements || !stripe) return

    if (!name) {
      setMessages(m => [...m, 'O nome do Cliente nao foi informado!'])

      return
    }

    if (!amount) {
      setMessages(m => [...m, 'O valor a pagar nao foi informado!'])

      return
    }

    setMessages(m => [...m, 'Criando uma intencao de pagamento...'])

    // Create payment intent on the server
    const { error: backendError, clientSecret } = await fetch(url, {
      ...mRequest,
      body: JSON.stringify({
        paymentMethod: 'card',
        amount: amount! * 100,
        currency: 'brl'
      })
    }).then(r => r.json())

    if (backendError) {
      setMessages(m => [...m, backendError?.message || 'Oops!'])

      return
    }

    setMessages(m => [...m, 'Intencao de pagamento foi criada...'])

    // Confirm the payment on the client
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumber.current!,
        billing_details: {
          name: name
        }
      }
    })

    if (stripeError) {
      setMessages(m => [...m, stripeError?.message || 'Oops!'])

      return
    }

    setMessages(m => [...m, `Pagamento id: ${paymentIntent?.id}, status: ${paymentIntent?.status}`])
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 4 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr', columnGap: 4 }}>
            <CardNumberElement
              options={{
                placeholder: '0000 0000 0000 0000',
                classes: { base: 'card-elements-style' },
                showIcon: true,
                iconStyle: 'solid'
              }}
              onReady={el => (cardNumber.current = el)}
              onChange={handleCardNumberChange}
            />

            <CardExpiryElement
              options={{ classes: { base: 'card-elements-style' } }}
              onReady={el => (cardExpiry.current = el)}
            />

            <CardCvcElement
              options={{ classes: { base: 'card-elements-style' } }}
              onReady={el => (cardCvc.current = el)}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label='Nome'
              name='name'
              placeholder='Digite seu nome'
              value={name}
              onChange={e => setName(e.target.value.toUpperCase())}
              InputProps={{
                startAdornment: <InputAdornment position='start'></InputAdornment>
              }}
            />
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

                inputComponent: props => <CleaveNumber {...props} />
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

/*
<Box>
  <CardElement options={{ classes: { base: 'input-card-style' } }} />
</Box>
*/
