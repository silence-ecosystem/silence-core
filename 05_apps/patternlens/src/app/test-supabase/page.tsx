'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function TestPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔗 Testowanie połączenia z Supabase...')
        console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...')

        const supabase = createClient()
        const { data, error } = await supabase.from('profiles').select('*').limit(1)

        if (error) {
          console.error('❌ Błąd Supabase:', error.message)
          setStatus('error')
          setMessage(error.message)
        } else {
          console.log('✅ Połączenie z Supabase OK!')
          console.log('Dane:', data)
          setStatus('success')
          setMessage('Połączenie z Supabase działa poprawnie')
        }
      } catch (err) {
        console.error('❌ Krytyczny błąd:', err)
        setStatus('error')
        setMessage(String(err))
      }
    }

    testConnection()
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h1>🧪 Test połączenia Supabase</h1>
      <p>Sprawdź konsolę przeglądarki (F12 → Console)</p>
      <p>
        {status === 'loading' && 'Ładowanie...'}
        {status === 'success' && `✅ ${message}`}
        {status === 'error' && `❌ Błąd: ${message}`}
      </p>
      <button onClick={() => window.location.href = '/'}>← Wróć do dashboard</button>
    </div>
  )
}
