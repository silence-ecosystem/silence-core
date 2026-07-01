'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// Crisis keywords for detection
const CRISIS_KEYWORDS = [
  'samobójstwo', 'zabić się', 'nie chcę żyć', 'koniec życia', 'skończyć z tym',
  'samookaleczenie', 'nie ma sensu', 'jestem bezwartościowy', 'jestem bezwartościowa',
  'suicide', 'kill myself', 'end it all', 'self harm', 'worthless',
  'chcę umrzeć', 'nie dam rady', 'nie wytrzymam'
]

interface CreateObjectProps {
  onCrisisDetected: () => void
  remainingObjects?: number
}

export default function CreateObject({ onCrisisDetected, remainingObjects = 2 }: CreateObjectProps) {
  const [activeTab, setActiveTab] = useState<'voice' | 'text'>('voice')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [textInput, setTextInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const checkForCrisis = useCallback((text: string): boolean => {
    const lowerText = text.toLowerCase()
    return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword))
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording])

  // Auto-stop at 60 seconds
  useEffect(() => {
    if (recordingTime >= 60) {
      stopRecording()
    }
  }, [recordingTime, stopRecording])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop())
        // Here you would send to Whisper API
        setIsProcessing(true)
        setTimeout(() => {
          setIsProcessing(false)
          setRecordingTime(0)
        }, 2000)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (err) {
      console.error('Microphone access denied:', err)
      alert('Nie można uzyskać dostępu do mikrofonu. Sprawdź uprawnienia przeglądarki.')
    }
  }

  const handleTextSubmit = () => {
    if (textInput.length < 50) {
      alert('Minimum 50 znaków wymagane.')
      return
    }
    
    if (checkForCrisis(textInput)) {
      onCrisisDetected()
      return
    }
    
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setTextInput('')
    }, 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isDisabled = remainingObjects <= 0

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-dark-800 to-primary-400/5 border-2 border-primary-400/30 rounded-lg p-6">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-radial from-primary-400/10 to-transparent rounded-full" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">📸 Utwórz Nowy Object</h2>
          <span className="badge badge-primary">Szybkie Wprowadzanie</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-primary-400/20 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('voice')}
            className={`text-sm font-medium pb-3 border-b-2 transition-all ${
              activeTab === 'voice'
                ? 'text-primary-400 border-primary-400'
                : 'text-slate-400 border-transparent hover:text-primary-400'
            }`}
          >
            🎤 Voice Dump
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`text-sm font-medium pb-3 border-b-2 transition-all ${
              activeTab === 'text'
                ? 'text-primary-400 border-primary-400'
                : 'text-slate-400 border-transparent hover:text-primary-400'
            }`}
          >
            ✍️ Tekst
          </button>
        </div>

        {/* Voice Tab */}
        {activeTab === 'voice' && (
          <div>
            {isProcessing ? (
              <div className="relative overflow-hidden bg-dark-700 rounded-lg p-6 text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-400/10 to-transparent animate-shimmer" />
                <div className="relative">
                  <div className="text-4xl mb-3">⚡</div>
                  <p className="text-slate-300">Przetwarzanie nagrania...</p>
                </div>
              </div>
            ) : (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isDisabled}
                className={`relative overflow-hidden w-full py-4 rounded-lg font-semibold text-lg transition-all touch-target ${
                  isDisabled
                    ? 'bg-dark-700 text-slate-500 cursor-not-allowed'
                    : isRecording
                      ? 'bg-danger text-white glow-danger'
                      : 'btn-primary'
                }`}
              >
                {!isRecording && !isDisabled && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                )}
                <span className="relative flex items-center justify-center gap-3">
                  {isDisabled ? (
                    '🔒 Limit wyczerpany'
                  ) : isRecording ? (
                    <>
                      <span className="w-3 h-3 bg-white rounded-full animate-recording" />
                      <span>Nagrywanie... {formatTime(recordingTime)}</span>
                      <span className="text-sm opacity-75">(kliknij aby zatrzymać)</span>
                    </>
                  ) : (
                    <>🎤 Rozpocznij Nagrywanie</>
                  )}
                </span>
              </button>
            )}
            
            <p className="text-center text-sm text-slate-300 mt-4">
              <strong>Max 60 sekund</strong> • Minimum 50 znaków (po transkrypcji)
            </p>
          </div>
        )}

        {/* Text Tab */}
        {activeTab === 'text' && (
          <div>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isDisabled || isProcessing}
              placeholder="Opisz sytuację, wzorzec lub moment który chcesz zrozumieć strukturalnie..."
              className="w-full h-32 bg-dark-700 border border-dark-600 rounded-lg p-4 text-slate-200 placeholder-slate-500 resize-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all disabled:opacity-50"
            />
            
            <div className="flex items-center justify-between mt-4">
              <span className={`text-sm ${textInput.length < 50 ? 'text-slate-400' : 'text-success'}`}>
                {textInput.length}/50 min znaków
              </span>
              <button
                onClick={handleTextSubmit}
                disabled={isDisabled || textInput.length < 50 || isProcessing}
                className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Przetwarzanie...' : 'Analizuj →'}
              </button>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="flex gap-3 bg-primary-400/10 border border-primary-400/20 rounded-lg p-4 mt-6">
          <span className="text-xl">💡</span>
          <p className="text-sm text-slate-200">
            Opisz sytuację, wzorzec lub moment który chcesz zrozumieć strukturalnie. 
            PatternLens nie udziela porad - analizuje strukturę Twojego doświadczenia.
          </p>
        </div>
      </div>
    </div>
  )
}
