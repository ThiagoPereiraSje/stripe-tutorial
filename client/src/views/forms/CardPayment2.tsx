import { useState } from 'react'

import { Box, TextField, InputAdornment, Button } from '@mui/material'

import Cards, { Focused } from 'react-credit-cards'
import CardWrapper from 'src/@core/styles/libs/react-credit-cards'

import Payment from 'payment'
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format'

import 'react-credit-cards/es/styles-compiled.css'

export default function CardPayment2() {
  const [cvc, setCvc] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [focus, setFocus] = useState<string>('')
  const [expiry, setExpiry] = useState<string>('')
  const [cardNumber, setCardNumber] = useState<string>('')

  const handleClean = () => {
    setCvc('')
    setName('')
    setFocus('')
    setExpiry('')
    setCardNumber('')
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 4 }}>
      <CardWrapper sx={{ margin: '0.5rem auto' }}>
        <Cards
          placeholders={{ name: 'DIGITE SEU NOME' }}
          locale={{ valid: 'VALIDADE' }}
          cvc={cvc}
          focused={focus as Focused}
          expiry={expiry}
          name={name}
          number={cardNumber}
        />
      </CardWrapper>
      <form>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 4 }}>
          <Box>
            <TextField
              fullWidth
              name='number'
              label='Numero do cartao'
              placeholder='0000 0000 0000 0000'
              value={cardNumber}
              onChange={e => setCardNumber(formatCreditCardNumber(e.target.value, Payment))}
              onFocus={e => setFocus(e.target.name)}
              InputProps={{
                startAdornment: <InputAdornment position='start'></InputAdornment>
              }}
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
              onFocus={e => setFocus(e.target.name)}
              InputProps={{
                startAdornment: <InputAdornment position='start'></InputAdornment>
              }}
            />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 4 }}>
            <Box>
              <TextField
                fullWidth
                name='expiry'
                label='Data Expiracao'
                placeholder='MM/YY'
                value={expiry}
                onChange={e => setExpiry(formatExpirationDate(e.target.value))}
                onFocus={e => setFocus(e.target.name)}
                InputProps={{
                  startAdornment: <InputAdornment position='start'></InputAdornment>
                }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                name='cvc'
                label='CVC'
                placeholder='000'
                value={cvc}
                onChange={e => setCvc(formatCVC(e.target.value, cardNumber, Payment))}
                onFocus={e => setFocus(e.target.name)}
                InputProps={{
                  startAdornment: <InputAdornment position='start'></InputAdornment>
                }}
              />
            </Box>
          </Box>
          <Box>
            <Button variant='contained' size='large'>
              Pagar
            </Button>
            &nbsp;
            <Button size='large' variant='outlined' onClick={handleClean}>
              Limpar
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  )
}
