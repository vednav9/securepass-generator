import { useState, useCallback, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [length, setLength] = useState(8)
  const [numberAllowed, setNumberAllowed] = useState(false)
  const [charAllowed, setCharAllowed] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [strength, setStrength] = useState('')

  const passwordRef = useRef(null)

  const calculateStrength = (password) => {
    let score = 0
    if (password.length >= 8) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (password.length >= 12) score++

    if (score <= 1) return 'Weak'
    else if (score === 2) return 'Medium'
    else return 'Strong'
  }

  const generatePassword = useCallback(() => {
    let pass = ''
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

    if (numberAllowed) str += '0123456789'
    if (charAllowed) str += '!@#$%^&*()_+'

    for (let i = 1; i < length; i++) {
      const char = Math.floor(Math.random() * str.length + 1)
      pass += str.charAt(char)
    }

    setPassword(pass)
    setStrength(calculateStrength(pass))
  }, [length, numberAllowed, charAllowed])

  const copyPasswordToClipboard = () => {
    window.navigator.clipboard.writeText(password)
    passwordRef.current?.select()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    generatePassword()
  }, [length, numberAllowed, charAllowed])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md shadow-xl rounded-2xl px-6 py-6 text-white border border-white/20 relative">
        <h1 className="text-3xl font-semibold text-center text-cyan-400 mb-6">🔐 Password Generator</h1>

        <div className="flex rounded-lg overflow-hidden mb-5">
          <input
            type="text"
            value={password}
            className="w-full py-2 px-4 text-lg bg-white/10 backdrop-blur-md text-white placeholder-white/50 outline-none"
            placeholder="Password"
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={copyPasswordToClipboard}
            className="bg-cyan-600 hover:bg-cyan-700 transition-all px-4 text-white font-medium"
          >
            Copy
          </button>
        </div>

        {/* Copy Toast */}
        {copied && (
          <div className="absolute top-3 right-5 bg-green-500 text-white px-3 py-1 rounded-md text-sm shadow-md animate-fade">
            Copied!
          </div>
        )}

        {/* Strength Indicator */}
        <div className="text-sm mb-4 text-center">
          Strength:{' '}
          <span
            className={`font-bold ${
              strength === 'Weak'
                ? 'text-red-500'
                : strength === 'Medium'
                ? 'text-yellow-400'
                : 'text-green-400'
            }`}
          >
            {strength}
          </span>
        </div>

        {/* Controls */}
        <div className="space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <label htmlFor="length" className="text-sm text-gray-300">
              Length: {length}
            </label>
            <input
              id="length"
              type="range"
              min={6}
              max={100}
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-2/3 accent-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="numbers" className="text-sm text-gray-300">
              Include Numbers
            </label>
            <input
              id="numbers"
              type="checkbox"
              checked={numberAllowed}
              onChange={() => setNumberAllowed((prev) => !prev)}
              className="w-5 h-5 accent-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="symbols" className="text-sm text-gray-300">
              Include Symbols
            </label>
            <input
              id="symbols"
              type="checkbox"
              checked={charAllowed}
              onChange={() => setCharAllowed((prev) => !prev)}
              className="w-5 h-5 accent-cyan-500"
            />
          </div>
        </div>

        {/* Manual Regenerate Button */}
        <button
          onClick={generatePassword}
          className="w-full mt-3 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-all font-semibold"
        >
          Regenerate Password
        </button>
      </div>
    </div>
  )
}

export default App
