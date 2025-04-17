"use client"

import { useEffect, useState } from "react"

const quotes = [
  {
    text: "The quieter you become, the more you can hear.",
    author: "Ram Dass",
  },
  {
    text: "In the journal I do not just express myself more openly than I could to any person; I create myself.",
    author: "Susan Sontag",
  },
  {
    text: "What you seek is seeking you.",
    author: "Rumi",
  },
  {
    text: "The most valuable possession you can own is an open heart.",
    author: "Carlos Santana",
  },
  {
    text: "The unexamined life is not worth living.",
    author: "Socrates",
  },
  {
    text: "Between stimulus and response there is a space. In that space is our power to choose our response.",
    author: "Viktor E. Frankl",
  },
  {
    text: "We write to taste life twice, in the moment and in retrospect.",
    author: "Anaïs Nin",
  },
]

export function Quote() {
  const [quote, setQuote] = useState(quotes[0])

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])
  }, [])

  return (
    <div className="max-w-md text-center">
      <p className="text-xl text-white/90 italic mb-2 font-serif">"{quote.text}"</p>
      <p className="text-white/70">— {quote.author}</p>
    </div>
  )
}
