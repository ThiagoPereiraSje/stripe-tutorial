import { useState, FormEvent } from 'react'
import { useStripe } from '@stripe/react-stripe-js'
import { Box, Typography } from '@mui/material'

type Address = {
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

type Client = {
  name: string
  email: string
  taxId: string
} & Address

const url = '/create-payment'

const mRequest: RequestInit = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}

export default function BoletoPayment() {
  const [client, setClient] = useState<Client>({
    name: 'Jenny Rosen',
    email: 'jr@example.com',
    taxId: '000.000.000-00',
    address: 'Av Angelica 2491, Conjunto 91E',
    city: 'Sao Paulo',
    state: 'SP',
    postalCode: '01227-200',
    country: 'BR'
  })

  const [amount, setAmount] = useState<number>(500)

  const [messages, setMessages] = useState<string[]>([])
  const stripe = useStripe()

  const handleClean = () => {
    setMessages([])
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!stripe) {
      setMessages(m => [...m, 'Stripe nao foi carregado ainda!'])

      return
    }

    // Create payment intent on the server
    const { error: backendError, clientSecret } = await fetch(url, {
      ...mRequest,
      body: JSON.stringify({
        paymentMethod: 'boleto',
        amount: amount,
        currency: 'brl'
      })
    }).then(r => r.json())

    if (backendError) {
      setMessages(m => [...m, backendError?.message || 'Oops!'])

      return
    }

    // Confirm payment intent on the client
    const { error: stripeError, paymentIntent } = await stripe?.confirmBoletoPayment(clientSecret, {
      payment_method: {
        billing_details: {
          address: {
            line1: client.address,
            city: client.city,
            country: client.country,
            postal_code: client.postalCode,
            state: client.state
          },
          name: client.name,
          email: client.email
        },
        boleto: {
          tax_id: client.taxId
        }
      }
    })

    if (stripeError) {
      setMessages(m => [...m, stripeError?.message || 'Oops!'])

      return
    }

    setMessages(m => [...m, `Payment intent id: ${paymentIntent?.id}, status: ${paymentIntent?.status}`])
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          <Box sx={{ mb: 4 }}>
            <label htmlFor='name'>Nome:</label> <br />
            <input
              id='name'
              type='text'
              value={client.name}
              onChange={e => setClient(d => ({ ...d, name: e.target.value }))}
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <label htmlFor='email'>E-mail:</label> <br />
            <input
              id='email'
              type='text'
              value={client.email}
              onChange={e => setClient(d => ({ ...d, email: e.target.value }))}
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <label htmlFor='taxId'>CPF/CNPJ:</label> <br />
            <input
              id='taxId'
              type='text'
              value={client.taxId}
              onChange={e => setClient(d => ({ ...d, taxId: e.target.value }))}
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <label htmlFor='address'>Rua:</label> <br />
            <input
              id='address'
              type='text'
              value={client.address}
              onChange={e => setClient(d => ({ ...d, address: e.target.value }))}
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <label htmlFor='city'>Cidade:</label> <br />
            <input
              id='city'
              type='text'
              value={client.city}
              onChange={e => setClient(d => ({ ...d, city: e.target.value }))}
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <label htmlFor='state'>Estado:</label> <br />
            <input
              id='state'
              type='text'
              value={client.state}
              onChange={e => setClient(d => ({ ...d, state: e.target.value }))}
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <label htmlFor='postalCode'>CEP:</label> <br />
            <input
              id='postalCode'
              type='text'
              value={client.postalCode}
              onChange={e => setClient(d => ({ ...d, postalCode: e.target.value }))}
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <label htmlFor='country'>Pais:</label> <br />
            <input
              id='country'
              type='text'
              value={client.country}
              onChange={e => setClient(d => ({ ...d, country: e.target.value }))}
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <label htmlFor='amount'>Valor:</label> <br />
            <input id='amount' type='number' value={amount} onChange={e => setAmount(Number(e.target.value))} />
          </Box>
        </Box>
        <button>Gerar Boleto</button> &nbsp;
        <button type='button' onClick={handleClean}>
          Limpar
        </button>
      </form>

      <Box sx={{ marginTop: '2rem' }}>
        {!!messages &&
          messages.map((message, key) => (
            <Typography key={key} sx={{ color: 'red' }}>
              {message}
            </Typography>
          ))}
      </Box>
    </>
  )
}
