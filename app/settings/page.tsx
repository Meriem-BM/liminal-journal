"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "next-themes"
import { useAudio } from "@/components/audio-provider"
import { ChevronLeft, Sun, Volume2, VolumeX } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { soundEnabled, setSoundEnabled, currentSound, setCurrentSound, playSound, volume, setVolume, audioError } =
    useAudio()
  const [mounted, setMounted] = useState(false)
  const [fontFamily, setFontFamily] = useState("serif")

  useEffect(() => {
    setMounted(true)

    // Load font preference from localStorage
    const savedFont = localStorage.getItem("font-family")
    if (savedFont) {
      setFontFamily(savedFont)
      document.body.className = savedFont === "serif" ? "font-serif" : "font-sans"
    }
  }, [])

  const handleSoundChange = (value: string) => {
    setCurrentSound(value)
    if (soundEnabled && !audioError) {
      playSound(value)
    }
  }

  const handleFontChange = (value: string) => {
    setFontFamily(value)
    document.body.className = value === "serif" ? "font-serif" : "font-sans"
    localStorage.setItem("font-family", value)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
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
        </div>

        <motion.div
          className="max-w-md mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-serif text-white mb-4">Settings</h1>
            <p className="text-white/70">Customize your journaling experience.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl p-6 space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-serif text-white">Theme</h2>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sun className="h-5 w-5 text-white/70" />
                  <Label htmlFor="theme-mode" className="text-white/70">
                    Dark Mode
                  </Label>
                </div>
                <Switch
                  id="theme-mode"
                  checked={theme === "dark" || theme === "dreamy" || theme === "calm"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>

              <div className="pt-2">
                <Label htmlFor="theme-select" className="text-sm text-white/70 mb-2 block">
                  Vibe
                </Label>
                <RadioGroup
                  defaultValue={theme === "dark" ? "dark" : theme === "dreamy" ? "dreamy" : "calm"}
                  onValueChange={(value) => {
                    setTheme(value)
                    document.documentElement.className = value
                    if (soundEnabled && !audioError) {
                      playSound(value)
                    }
                  }}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark" className="text-white/90">
                      Dark
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dreamy" id="theme-dreamy" />
                    <Label htmlFor="theme-dreamy" className="text-white/90">
                      Dreamy
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="calm" id="theme-calm" />
                    <Label htmlFor="theme-calm" className="text-white/90">
                      Calm
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-serif text-white">Typography</h2>

              <div className="pt-2">
                <Label htmlFor="font-select" className="text-sm text-white/70 mb-2 block">
                  Font Style
                </Label>
                <RadioGroup
                  defaultValue={fontFamily}
                  onValueChange={handleFontChange}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="serif" id="font-serif" />
                    <Label htmlFor="font-serif" className="text-white/90 font-serif">
                      Serif (Playfair Display)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sans" id="font-sans" />
                    <Label htmlFor="font-sans" className="text-white/90 font-sans">
                      Sans-serif (Inter)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif text-white">Sound</h2>
                {audioError && (
                  <div className="flex items-center text-amber-400 text-sm">
                    <VolumeX className="h-4 w-4 mr-1" />
                    <span>Audio unavailable</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sound-toggle" className="text-white/70">
                  Enable Sounds
                </Label>
                <Switch
                  id="sound-toggle"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                  disabled={audioError}
                />
              </div>

              <div className="pt-2">
                <Label htmlFor="sound-select" className="text-sm text-white/70 mb-2 block">
                  Background Sound
                </Label>
                <Select value={currentSound} onValueChange={handleSoundChange} disabled={!soundEnabled || audioError}>
                  <SelectTrigger id="sound-select" className="w-full bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select sound" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ambient">Ambient</SelectItem>
                    <SelectItem value="rain">Rain</SelectItem>
                    <SelectItem value="dreamy">Dreamy Chimes</SelectItem>
                    <SelectItem value="dark">Dark Atmosphere</SelectItem>
                    <SelectItem value="calm">Ocean Waves</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="volume-slider" className="text-sm text-white/70">
                    Volume
                  </Label>
                  <Volume2 className="h-4 w-4 text-white/70" />
                </div>
                <Slider
                  id="volume-slider"
                  defaultValue={[volume]}
                  max={1}
                  step={0.01}
                  disabled={!soundEnabled || audioError}
                  onValueChange={handleVolumeChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-serif text-white">Data</h2>

              <Button
                variant="destructive"
                className="w-full bg-red-900/50 hover:bg-red-900 text-white"
                onClick={() => {
                  if (confirm("Are you sure you want to clear all journal entries? This cannot be undone.")) {
                    localStorage.removeItem("journal-entries")
                    localStorage.removeItem("journal-draft")
                    alert("All journal entries have been cleared.")
                    router.push("/")
                  }
                }}
              >
                Clear All Journal Entries
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
