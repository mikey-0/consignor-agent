'use client'

import { useState } from 'react'

export default function OnboardingPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    org: '',
    lang: 'English',
    role: 'user' // default role
  })

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const res = await fetch('/api/notion-onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', org: '', lang: 'English', role: 'user' })
      } else {
        throw new Error('Submission failed')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center text-gray-800">Onboarding</h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-3 rounded-md"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-3 rounded-md"
        />

        <input
          type="text"
          name="org"
          placeholder="Organization"
          value={form.org}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-md"
        />

        <select
          name="lang"
          value={form.lang}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-md"
        >
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="Spanish">Spanish</option>
        </select>

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-md"
        >
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
          <option value="contractor">Contractor</option>
          <option value="property">Property</option>
          <option value="booking">Booking</option>
          <option value="task">Task</option>
          <option value="finance">Finance</option>
          <option value="guest">Guest</option>
          <option value="owner">Owner/Manager</option>
          <option value="report">Report</option>
          <option value="message">Guest Message</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit'}
        </button>

        {status === 'success' && (
          <p className="text-green-600 text-center">Form submitted successfully!</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 text-center">Something went wrong. Please try again.</p>
        )}
      </form>
    </main>
  )
}

