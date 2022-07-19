import { Box } from '@mui/material'
import { useState } from 'react'

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

export default function BoletoPayment() {
  const [client, setClient] = useState<Client>({
    name: 'Thiago Pereira',
    email: 'thiago@gmail.com',
    taxId: '123',
    address: 'Rua 1',
    city: 'Amazonas',
    state: 'Sao Paulo',
    postalCode: '000100',
    country: 'BR'
  })

  return (
    <form>
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
        <label htmlFor='taxid'>Tax Id:</label> <br />
        <input
          id='taxid'
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
      <button>Gerar Boleto</button>
    </form>
  )
}
