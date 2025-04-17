"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"

type AudioContextType = {
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  currentSound: string
  setCurrentSound: (sound: string) => void
  playSound: (sound: string) => void
  stopAllSounds: () => void
  volume: number
  setVolume: (volume: number) => void
  audioError: boolean
}

const AudioContext = createContext<AudioContextType>({
  soundEnabled: true,
  setSoundEnabled: () => {},
  currentSound: "ambient",
  setCurrentSound: () => {},
  playSound: () => {},
  stopAllSounds: () => {},
  volume: 0.3,
  setVolume: () => {},
  audioError: false,
})

// Instead of using external URLs that might be blocked by CORS,
// we'll use simple audio synthesis for different moods
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [currentSound, setCurrentSound] = useState("ambient")
  const [volume, setVolume] = useState(0.3)
  const [initialized, setInitialized] = useState(false)
  const [audioError, setAudioError] = useState(false)

  // Use AudioContext for browser audio synthesis
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<Record<string, OscillatorNode | null>>({})
  const gainsRef = useRef<Record<string, GainNode | null>>({})

  // Initialize audio context and settings
  useEffect(() => {
    // Check if localStorage has sound preferences
    try {
      const savedSoundEnabled = localStorage.getItem("sound-enabled")
      if (savedSoundEnabled !== null) {
        setSoundEnabled(savedSoundEnabled === "true")
      }

      const savedCurrentSound = localStorage.getItem("current-sound")
      if (savedCurrentSound) {
        setCurrentSound(savedCurrentSound)
      }

      const savedVolume = localStorage.getItem("sound-volume")
      if (savedVolume !== null) {
        setVolume(Number.parseFloat(savedVolume))
      }
    } catch (error) {
      console.error("Error loading audio settings:", error)
    }

    // Initialize Web Audio API if it's available
    try {
      if (typeof window !== "undefined" && window.AudioContext) {
        audioContextRef.current = new AudioContext()
      }
    } catch (error) {
      console.error("Web Audio API not supported:", error)
      setAudioError(true)
    }

    setInitialized(true)

    // Cleanup function
    return () => {
      stopAllSounds()

      // Close audio context
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(console.error)
      }
    }
  }, [])

  // Save sound preferences when they change
  useEffect(() => {
    if (!initialized) return
    localStorage.setItem("sound-enabled", soundEnabled.toString())

    // If sound is disabled, stop all sounds
    if (!soundEnabled) {
      stopAllSounds()
    } else if (currentSound && currentSound !== "success") {
      // If sound is enabled and we have a current sound, play it
      playSound(currentSound)
    }
  }, [soundEnabled, initialized])

  useEffect(() => {
    if (!initialized) return
    localStorage.setItem("current-sound", currentSound)

    // When current sound changes, play it if sound is enabled
    if (soundEnabled && currentSound && currentSound !== "success") {
      playSound(currentSound)
    }
  }, [currentSound, initialized])

  // Update volume
  useEffect(() => {
    if (!initialized) return
    localStorage.setItem("sound-volume", volume.toString())

    // Update all active gain nodes
    Object.values(gainsRef.current).forEach((gain) => {
      if (gain) {
        gain.gain.value = volume * 0.2 // Keep volume moderate
      }
    })
  }, [volume, initialized])

  const stopAllSounds = () => {
    // Stop all oscillators
    Object.entries(oscillatorsRef.current).forEach(([key, osc]) => {
      if (osc) {
        try {
          osc.stop()
          osc.disconnect()
          oscillatorsRef.current[key] = null
        } catch (error) {
          // Ignore errors when stopping already stopped oscillators
        }
      }
    })
  }

  const createSuccessSound = () => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    // Create a gain node for volume control
    const gain = ctx.createGain()
    gain.gain.value = volume * 0.2
    gain.connect(ctx.destination)

    // Create a short success sound
    const osc = ctx.createOscillator()
    osc.type = "sine"
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.1)
    osc.connect(gain)

    osc.start()
    osc.stop(now + 0.15)
  }

  const playSound = (sound: string) => {
    if (!soundEnabled || !audioContextRef.current || audioError) return

    // For one-shot sounds like "success", create a simple success sound
    if (sound === "success") {
      createSuccessSound()
      return
    }

    // Stop any currently playing sounds
    stopAllSounds()

    try {
      const ctx = audioContextRef.current

      // Create a gain node for volume control
      const gain = ctx.createGain()
      gain.gain.value = volume * 0.2 // Keep volume moderate
      gain.connect(ctx.destination)
      gainsRef.current[sound] = gain

      // Create an oscillator with different characteristics based on the sound type
      const osc = ctx.createOscillator()

      // Configure oscillator based on the sound type
      switch (sound) {
        case "ambient":
          osc.type = "sine"
          osc.frequency.value = 220
          break
        case "rain":
          osc.type = "triangle"
          osc.frequency.value = 100
          break
        case "dreamy":
          osc.type = "sine"
          osc.frequency.value = 330
          break
        case "dark":
          osc.type = "triangle"
          osc.frequency.value = 55
          break
        case "calm":
          osc.type = "sine"
          osc.frequency.value = 174
          break
        default:
          osc.type = "sine"
          osc.frequency.value = 220
      }

      // Add a slight modulation for more interesting sounds
      const lfo = ctx.createOscillator()
      lfo.type = "sine"
      lfo.frequency.value = 0.5 // Slow modulation

      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 10 // Modulation depth

      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)

      osc.connect(gain)
      lfo.start()
      osc.start()

      // Store the oscillator for later stopping
      oscillatorsRef.current[sound] = osc
    } catch (error) {
      console.error("Error creating audio:", error)
      setAudioError(true)
    }
  }

  return (
    <AudioContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        currentSound,
        setCurrentSound,
        playSound,
        stopAllSounds,
        volume,
        setVolume,
        audioError,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => useContext(AudioContext)
