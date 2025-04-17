"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useJournal } from "@/components/journal-provider"
import { useAudio } from "@/components/audio-provider"
import { useTheme } from "next-themes"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ChevronLeft, Save, Trash2, X, VolumeX } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function JournalPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const {
    entries,
    addEntry,
    deleteEntry,
    updateEntry,
    currentEntry,
    setCurrentEntry,
    currentPrompt,
    setCurrentPrompt,
    editingEntryId,
    setEditingEntryId,
    resetEditor,
  } = useJournal()
  const { playSound, audioError } = useAudio()
  const [mounted, setMounted] = useState(false)
  const [mood, setMood] = useState("dreamy")

  useEffect(() => {
    setMounted(true)

    // Only try to play sound if there's no audio error
    if (!audioError) {
      playSound("ambient")
    }

    // Set initial mood based on theme
    if (theme) {
      setMood(theme)
      document.documentElement.className = theme
    }
  }, [playSound, theme, audioError])

  const handleSave = () => {
    if (currentEntry.trim()) {
      if (editingEntryId) {
        // Update existing entry
        updateEntry(editingEntryId, {
          content: currentEntry,
          mood: mood,
          prompt: currentPrompt,
        })
      } else {
        // Add new entry
        addEntry({
          id: Date.now().toString(),
          content: currentEntry,
          date: new Date(),
          mood: mood,
          prompt: currentPrompt,
        })
      }

      // Only try to play sound if there's no audio error
      if (!audioError) {
        playSound("success")
      }

      resetEditor()
    }
  }

  const handleMoodChange = (value: string) => {
    setMood(value)
    setTheme(value)
    document.documentElement.className = value

    // Only try to play sound if there's no audio error
    if (!audioError) {
      playSound(value)
    }
  }

  const handleEditEntry = (entry: any) => {
    setCurrentEntry(entry.content)
    setCurrentPrompt(entry.prompt || "")
    setEditingEntryId(entry.id)
    setMood(entry.mood)
    document.documentElement.className = entry.mood
    setTheme(entry.mood)

    // Only try to play sound if there's no audio error
    if (!audioError) {
      playSound(entry.mood)
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCancelEdit = () => {
    resetEditor()
  }

  if (!mounted) return null

  return (
    <div
      className={cn(
        "min-h-screen w-full overflow-hidden transition-colors duration-1000",
        mood === "dreamy"
          ? "bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-950"
          : mood === "dark"
            ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
            : "bg-gradient-to-br from-blue-950 via-cyan-900 to-blue-950",
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 to-transparent"></div>
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

          <div className="flex items-center gap-4">
            {audioError && (
              <div className="flex items-center text-amber-400 text-sm">
                <VolumeX className="h-4 w-4 mr-1" />
                <span>Audio unavailable</span>
              </div>
            )}

            <Select value={mood} onValueChange={handleMoodChange}>
              <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dreamy">Dreamy</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="calm">Calm</SelectItem>
              </SelectContent>
            </Select>

            {editingEntryId ? (
              <>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!currentEntry.trim()}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Update
                </Button>
              </>
            ) : (
              <Button
                onClick={handleSave}
                disabled={!currentEntry.trim()}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            )}
          </div>
        </div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-serif text-white mb-2">{format(new Date(), "MMMM d, yyyy")}</h1>
            {currentPrompt && <p className="text-white/70 italic">"{currentPrompt}"</p>}
            {editingEntryId && <p className="text-white/70 mt-2">Editing entry</p>}
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl overflow-hidden">
            <Textarea
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              placeholder="Begin writing your thoughts..."
              className="journal-textarea font-serif text-white/90"
            />
          </div>

          {entries.length > 0 && (
            <motion.div
              className="mt-12"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h2 className="text-xl font-serif text-white/80 mb-4">Previous entries</h2>
              <div className="space-y-4">
                {entries
                  .slice()
                  .reverse()
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className={cn(
                        "p-4 rounded-lg border transition-all duration-300",
                        entry.mood === "dreamy"
                          ? "bg-purple-900/20 border-purple-500/30"
                          : entry.mood === "dark"
                            ? "bg-slate-900/20 border-slate-500/30"
                            : "bg-blue-900/20 border-blue-500/30",
                      )}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70 text-sm">
                          {format(new Date(entry.date), "MMMM d, yyyy • h:mm a")}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              entry.mood === "dreamy"
                                ? "bg-purple-500/20 text-purple-300"
                                : entry.mood === "dark"
                                  ? "bg-slate-500/20 text-slate-300"
                                  : "bg-blue-500/20 text-blue-300",
                            )}
                          >
                            {entry.mood}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-white/10"
                            onClick={() => handleEditEntry(entry)}
                          >
                            <Save className="h-4 w-4 text-white/70" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10">
                                <Trash2 className="h-4 w-4 text-white/70" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-900 border-white/20 text-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                                <AlertDialogDescription className="text-white/70">
                                  Are you sure you want to delete this entry? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-transparent text-white border-white/20 hover:bg-white/10">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-900 hover:bg-red-800 text-white"
                                  onClick={() => deleteEntry(entry.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <div className="text-white/90 font-serif cursor-pointer" onClick={() => handleEditEntry(entry)}>
                        <p className="line-clamp-3">{entry.content}</p>
                      </div>
                      {entry.prompt && <p className="text-white/50 text-sm italic mt-2">"{entry.prompt}"</p>}
                    </div>
                  ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
