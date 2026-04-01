'use client'

import { useCurrency } from './CurrencyContext'
import { useEffect, useState } from 'react'

export function PriceDisplay({ amountINR, className = '' }: { amountINR: number, className?: string }) {
  const { convert } = useCurrency()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className={className}>₹{amountINR}</span>
  }

  return <span className={className}>{convert(amountINR)}</span>
}
