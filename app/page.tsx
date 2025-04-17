"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Quote } from "@/components/quote"
import { ThemeProvider } from "@/components/theme-provider"
import { JournalProvider } from "@/components/journal-provider"
import { AudioProvider } from "@/components/audio-provider"
import Link from "next/link"
import { VolumeX } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [audioError, setAudioError] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if audio context is available
    try {
      if (typeof window !== "undefined") {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        if (!audioContext) {
          setAudioError(true)
        }
      }
    } catch (error) {
      setAudioError(true)
    }
  }, [])

  if (!mounted) return null

  return (
    <ThemeProvider defaultTheme="dark" storageKey="liminal-theme">
      <JournalProvider>
        <AudioProvider>
          <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 to-transparent"></div>
            <div className="noise-texture absolute inset-0 opacity-[0.03]"></div>

            <motion.div
              className="flex flex-col items-center justify-center min-h-screen px-4 text-center relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              {audioError && (
                <motion.div
                  className="absolute top-4 right-4 flex items-center text-amber-400 text-sm bg-black/20 px-3 py-1 rounded-full"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  <VolumeX className="h-4 w-4 mr-1" />
                  <span>Audio unavailable</span>
                </motion.div>
              )}

              <motion.h1
                className="text-6xl md:text-8xl font-serif font-bold text-white mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Liminal
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-white/80 mb-12 max-w-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Not everything needs to be shared. Some thoughts are just for you.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="mb-16"
              >
                <Quote />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  onClick={() => router.push("/journal")}
                  className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full transition-all duration-300 backdrop-blur-sm"
                >
                  Begin your journey
                </Button>

                <Button
                  onClick={() => router.push("/memories")}
                  className="text-lg px-8 py-6 bg-transparent hover:bg-white/10 text-white/80 hover:text-white border border-white/10 rounded-full transition-all duration-300"
                >
                  Explore memories
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                className="absolute bottom-8"
              >
                <Link
                  href="/settings"
                  className="text-white/50 hover:text-white/80 transition-colors duration-300 text-sm"
                >
                  Settings
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </AudioProvider>
      </JournalProvider>
    </ThemeProvider>
  )
}
