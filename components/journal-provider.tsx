"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type JournalEntry = {
  id: string
  content: string
  date: Date
  mood: string
  prompt?: string
}

type JournalContextType = {
  entries: JournalEntry[]
  addEntry: (entry: JournalEntry) => void
  deleteEntry: (id: string) => void
  updateEntry: (id: string, updatedEntry: Partial<JournalEntry>) => void
  currentEntry: string
  setCurrentEntry: (content: string) => void
  currentPrompt: string
  setCurrentPrompt: (prompt: string) => void
  editingEntryId: string | null
  setEditingEntryId: (id: string | null) => void
  resetEditor: () => void
}

const JournalContext = createContext<JournalContextType>({
  entries: [],
  addEntry: () => {},
  deleteEntry: () => {},
  updateEntry: () => {},
  currentEntry: "",
  setCurrentEntry: () => {},
  currentPrompt: "",
  setCurrentPrompt: () => {},
  editingEntryId: null,
  setEditingEntryId: () => {},
  resetEditor: () => {},
})

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState("")
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  // Load entries from localStorage on mount
  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem("journal-entries")
      if (savedEntries) {
        const parsedEntries = JSON.parse(savedEntries)
        // Convert string dates back to Date objects
        const processedEntries = parsedEntries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
        }))
        setEntries(processedEntries)
      }

      // Load draft if exists
      const savedDraft = localStorage.getItem("journal-draft")
      if (savedDraft) {
        const draft = JSON.parse(savedDraft)
        setCurrentEntry(draft.content || "")
        setCurrentPrompt(draft.prompt || "")
      }

      setInitialized(true)
    } catch (error) {
      console.error("Error loading journal data:", error)
      setInitialized(true)
    }
  }, [])

  // Save draft as user types
  useEffect(() => {
    if (!initialized) return

    try {
      const draft = {
        content: currentEntry,
        prompt: currentPrompt,
        lastUpdated: new Date().toISOString(),
      }
      localStorage.setItem("journal-draft", JSON.stringify(draft))
    } catch (error) {
      console.error("Error saving draft:", error)
    }
  }, [currentEntry, currentPrompt, initialized])

  const addEntry = (entry: JournalEntry) => {
    try {
      const newEntries = [...entries, entry]
      setEntries(newEntries)
      localStorage.setItem("journal-entries", JSON.stringify(newEntries))

      // Clear draft after saving
      localStorage.removeItem("journal-draft")
    } catch (error) {
      console.error("Error saving entry:", error)
    }
  }

  const deleteEntry = (id: string) => {
    try {
      const newEntries = entries.filter((entry) => entry.id !== id)
      setEntries(newEntries)
      localStorage.setItem("journal-entries", JSON.stringify(newEntries))

      // If we're deleting the entry we're currently editing, reset the editor
      if (editingEntryId === id) {
        resetEditor()
      }
    } catch (error) {
      console.error("Error deleting entry:", error)
    }
  }

  const updateEntry = (id: string, updatedEntry: Partial<JournalEntry>) => {
    try {
      const newEntries = entries.map((entry) => (entry.id === id ? { ...entry, ...updatedEntry } : entry))
      setEntries(newEntries)
      localStorage.setItem("journal-entries", JSON.stringify(newEntries))
    } catch (error) {
      console.error("Error updating entry:", error)
    }
  }

  const resetEditor = () => {
    setCurrentEntry("")
    setCurrentPrompt("")
    setEditingEntryId(null)
    localStorage.removeItem("journal-draft")
  }

  return (
    <JournalContext.Provider
      value={{
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
      }}
    >
      {children}
    </JournalContext.Provider>
  )
}

export const useJournal = () => useContext(JournalContext)
