"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useJournal } from "@/components/journal-provider"
import { useAudio } from "@/components/audio-provider"
import { ChevronLeft, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

const memoryPrompts = [
  {
    id: "solitude",
    title: "Solitude",
    prompt: "Write about a time you felt completely alone.",
    mood: "dark",
    color: "from-slate-800 to-slate-900",
    icon: "🌑",
  },
  {
    id: "wonder",
    title: "Wonder",
    prompt: "Describe something that recently filled you with awe.",
    mood: "dreamy",
    color: "from-purple-800 to-indigo-900",
    icon: "✨",
  },
  {
    id: "serenity",
    title: "Serenity",
    prompt: "Recall a moment of perfect peace in your life.",
    mood: "calm",
    color: "from-blue-800 to-cyan-900",
    icon: "🌊",
  },
  {
    id: "nostalgia",
    title: "Nostalgia",
    prompt: "What memory brings you the most comfort when you revisit it?",
    mood: "dreamy",
    color: "from-pink-800 to-purple-900",
    icon: "🕰️",
  },
  {
    id: "growth",
    title: "Growth",
    prompt: "Reflect on how you've changed in the past year.",
    mood: "calm",
    color: "from-emerald-800 to-teal-900",
    icon: "🌱",
  },
  {
    id: "shadow",
    title: "Shadow",
    prompt: "Explore a part of yourself that you usually keep hidden.",
    mood: "dark",
    color: "from-gray-800 to-slate-900",
    icon: "👤",
  },
  {
    id: "gratitude",
    title: "Gratitude",
    prompt: "What are you most thankful for right now?",
    mood: "calm",
    color: "from-amber-800 to-yellow-900",
    icon: "🙏",
  },
  {
    id: "dream",
    title: "Dream",
    prompt: "Describe a recurring dream or a dream that has stayed with you.",
    mood: "dreamy",
    color: "from-violet-800 to-purple-900",
    icon: "💭",
  },
]

export default function MemoriesPage() {
  const router = useRouter()
  const { setCurrentPrompt, setCurrentEntry } = useJournal()
  const { playSound, audioError } = useAudio()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Only try to play sound if there's no audio error
    if (!audioError) {
      playSound("ambient")
    }
  }, [playSound, audioError])

  const handleSelectPrompt = (prompt: (typeof memoryPrompts)[0]) => {
    setCurrentPrompt(prompt.prompt)
    setCurrentEntry("")
    document.documentElement.className = prompt.mood

    // Only try to play sound if there's no audio error
    if (!audioError) {
      playSound(prompt.mood)
    }

    router.push("/journal")
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 to-transparent"></div>
      <div className="noise-texture absolute inset-0 opacity-[0.03]"></div>

      <motion.div
        className="container mx-auto px-4 py-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Home
          </Button>

          {audioError && (
            <div className="flex items-center text-amber-400 text-sm">
              <VolumeX className="h-4 w-4 mr-1" />
              <span>Audio unavailable</span>
            </div>
          )}
        </div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-serif text-white mb-4">Memories</h1>
            <p className="text-white/70 max-w-md mx-auto">
              Select a card to explore a new dimension of your thoughts and feelings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {memoryPrompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                className="memory-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                onClick={() => handleSelectPrompt(prompt)}
              >
                <div
                  className={cn(
                    "h-60 rounded-xl p-6 flex flex-col justify-between bg-gradient-to-br border border-white/10 shadow-lg",
                    prompt.color,
                  )}
                >
                  <div className="text-4xl">{prompt.icon}</div>
                  <div>
                    <h3 className="text-xl font-serif text-white mb-2">{prompt.title}</h3>
                    <p className="text-white/70 text-sm">{prompt.prompt}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
