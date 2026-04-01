'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Currency = 'INR' | 'USD' | 'EUR'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  convert: (amountINR: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011
}

const SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€'
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('INR')

  useEffect(() => {
    const saved = localStorage.getItem('currency') as Currency
    if (saved && ['INR', 'USD', 'EUR'].includes(saved)) {
      setCurrencyState(saved)
    }
  }, [])

  const setCurrency = (c: Currency) => {
    setCurrencyState(c)
    localStorage.setItem('currency', c)
  }

  const convert = (amountINR: number) => {
    const converted = amountINR * RATES[currency]
    return `${SYMBOLS[currency]}${converted.toFixed(currency === 'INR' ? 0 : 2)}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
