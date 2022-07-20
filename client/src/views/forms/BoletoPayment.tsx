import { useState, FormEvent } from 'react'
import { useStripe } from '@stripe/react-stripe-js'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button
} from '@mui/material'

import { AccountOutline, EmailOutline } from 'mdi-material-ui'
import { CleaveCEP, CleaveCPF, CleaveNumber, numberFormat, numberInterFormat } from '../components/CleaveInput'

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

  const [amount, setAmount] = useState<number>(5)

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
        amount: amount * 100,
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
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          <Box>
            <TextField
              fullWidth
              label='Nome'
              placeholder='Leonard Carter'
              value={client.name}
              onChange={e => setClient(d => ({ ...d, name: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AccountOutline />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              type='email'
              label='Email'
              placeholder='carterleonard@gmail.com'
              helperText='Voce pode usar letras e numeros'
              value={client.email}
              onChange={e => setClient(d => ({ ...d, email: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <EmailOutline />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label='CPF/CNPJ'
              placeholder='000.000.000-00'
              value={client.taxId}
              onBlur={e => setClient(d => ({ ...d, taxId: e.target.value }))}
              InputProps={{
                startAdornment: <InputAdornment position='start'></InputAdornment>,
                inputComponent: props => <CleaveCPF {...props} />
              }}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label='Endereco'
              placeholder='Av., Rua, Rodovia, etc'
              value={client.address}
              onChange={e => setClient(d => ({ ...d, address: e.target.value }))}
              InputProps={{
                startAdornment: <InputAdornment position='start'></InputAdornment>
              }}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label='Cidade'
              placeholder='Nome da Cidade aqui'
              value={client.city}
              onChange={e => setClient(d => ({ ...d, city: e.target.value }))}
              InputProps={{
                startAdornment: <InputAdornment position='start'></InputAdornment>
              }}
            />
          </Box>
          <Box>
            <FormControl fullWidth>
              <InputLabel id='state-label'>Estado</InputLabel>
              <Select
                fullWidth
                labelId='state-label'
                label='Estado'
                value={client.state}
                onChange={e => setClient(d => ({ ...d, state: e.target.value }))}
              >
                <MenuItem value='SP'>SAO PAULO</MenuItem>
                <MenuItem value='MG'>MINAS GERAIS</MenuItem>
                <MenuItem value='RJ'>RIO DE JANEIRO</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <TextField
              fullWidth
              label='CEP'
              placeholder='Digite o CEP aqui'
              value={client.postalCode}
              onBlur={e => setClient(d => ({ ...d, postalCode: e.target.value }))}
              InputProps={{
                startAdornment: <InputAdornment position='start'></InputAdornment>,

                inputComponent: props => <CleaveCEP {...props} />
              }}
            />
          </Box>
          <Box>
            <FormControl fullWidth>
              <InputLabel id='country-label'>Pais</InputLabel>
              <Select
                fullWidth
                labelId='country-label'
                label='Pais'
                value={client.country}
                onChange={e => setClient(d => ({ ...d, country: e.target.value }))}
              >
                <MenuItem value='BR'>BRASIL</MenuItem>
              </Select>
            </FormControl>
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
        </Box>
        <Box sx={{ marginTop: '1rem' }}>
          <Button type='submit' variant='contained' size='large'>
            Gerar Boleto
          </Button>
          &nbsp;
          <Button size='large' variant='outlined' onClick={handleClean}>
            Limpar
          </Button>
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
    </>
  )
}
