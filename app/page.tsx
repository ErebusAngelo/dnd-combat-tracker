"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Dice1, RefreshCcw, SkipForward } from 'lucide-react'
import { CharacterCard } from "@/components/character-card"
import { NewCharacterForm } from "@/components/new-character-form"
import { type Character, DICE_TYPES } from "@/types"

export default function CombatTracker() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [currentTurn, setCurrentTurn] = useState(0)
  const [round, setRound] = useState(1)
  const [diceResult, setDiceResult] = useState<string>("")

  const addCharacter = (character: Omit<Character, "id" | "conditions" | "log" | "inspiration" | "concentration">) => {
    const newChar = {
      ...character,
      id: Math.random().toString(36).substr(2, 9),
      conditions: [],
      log: [],
      inspiration: false,
      concentration: false,
    }

    const index = characters.findIndex((char) => char.initiative < newChar.initiative)

    if (index === -1) {
      setCharacters([...characters, newChar])
    } else {
      setCharacters([...characters.slice(0, index), newChar, ...characters.slice(index)])
    }

    if (characters.length === 0 || newChar.initiative > characters[currentTurn]?.initiative) {
      setCurrentTurn(index === -1 ? characters.length : index)
    }
  }

  const removeCharacter = (id: string) => {
    setCharacters(characters.filter((char) => char.id !== id))
  }

  const addToLog = (charId: string, action: string) => {
    setCharacters(
      characters.map((char) =>
        char.id === charId
          ? {
              ...char,
              log: [...char.log, `[Ronda ${round}] ${action}`],
            }
          : char,
      ),
    )
  }

  const nextTurn = () => {
    let nextIndex = -1
    let highestInitiative = Number.NEGATIVE_INFINITY

    for (let i = 0; i < characters.length; i++) {
      if (
        characters[i].initiative < characters[currentTurn].initiative &&
        characters[i].initiative > highestInitiative
      ) {
        highestInitiative = characters[i].initiative
        nextIndex = i
      }
    }

    if (nextIndex === -1) {
      highestInitiative = Number.NEGATIVE_INFINITY
      for (let i = 0; i < characters.length; i++) {
        if (characters[i].initiative > highestInitiative) {
          highestInitiative = characters[i].initiative
          nextIndex = i
        }
      }
      setRound(round + 1)
    }

    setCurrentTurn(nextIndex)
  }

  const resetRound = () => {
    setCurrentTurn(0)
    setRound(1)
    setCharacters(characters.map((char) => ({ ...char, log: [] })))
  }

  const rollDice = (sides: number) => {
    const result = Math.floor(Math.random() * sides) + 1
    setDiceResult(`d${sides}: ${result}`)
  }

  const updateInitiative = (charId: string, newInitiative: number) => {
    const currentChar = characters.find((c) => c.id === charId)
    if (!currentChar) return

    const otherChars = characters.filter((c) => c.id !== charId)
    const newChar = { ...currentChar, initiative: newInitiative }

    const index = otherChars.findIndex((char) => char.initiative < newInitiative)

    let newChars
    if (index === -1) {
      newChars = [...otherChars, newChar]
    } else {
      newChars = [...otherChars.slice(0, index), newChar, ...otherChars.slice(index)]
    }

    const oldIndex = characters.findIndex((c) => c.id === charId)
    const newIndex = index === -1 ? newChars.length - 1 : index

    if (currentTurn === oldIndex) {
      setCurrentTurn(newIndex)
    } else if (oldIndex < currentTurn && newIndex >= currentTurn) {
      setCurrentTurn(currentTurn - 1)
    } else if (oldIndex > currentTurn && newIndex <= currentTurn) {
      setCurrentTurn(currentTurn + 1)
    }

    setCharacters(newChars)
  }

  return (
    <div className="min-h-screen bg-[#111827] p-6 text-white">
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-[#ffd700] mb-6">D&D Combat Tracker</h1>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-4">
            {DICE_TYPES.map((sides) => (
              <Button key={sides} onClick={() => rollDice(sides)} className="bg-[#34495e] hover:bg-[#2c3e50]">
                <Dice1 className="mr-2" />d{sides}
              </Button>
            ))}
          </div>
          {diceResult && <div className="mt-4 text-xl font-bold text-[#ffd700] mb-4">{diceResult}</div>}

          <div className="flex items-center justify-between bg-[#1a2634] p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-[#ffd700]">Ronda: {round}</h2>
            <div className="flex gap-4">
              <Button
                variant="default"
                className="bg-[#ffd700] text-black hover:bg-[#ffed4a] font-semibold"
                onClick={nextTurn}
              >
                <SkipForward className="mr-2" />
                Siguiente Turno
              </Button>
              <Button
                variant="default"
                className="bg-[#ffd700] text-black hover:bg-[#ffed4a] font-semibold"
                onClick={resetRound}
              >
                <RefreshCcw className="mr-2" />
                Reiniciar Combate
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#ffd700] text-black hover:bg-[#ffed4a]">Añadir Personaje</Button>
            </DialogTrigger>
            <DialogContent className="bg-[#34495e]">
              <DialogHeader>
                <DialogTitle className="text-[#ffd700]">Nuevo Personaje</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Completa los detalles del personaje para añadirlo al combate.
                </DialogDescription>
              </DialogHeader>
              <NewCharacterForm onSubmit={addCharacter} />
            </DialogContent>
          </Dialog>
        </div>

        {characters.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-[#ffd700] font-bold">Turno de:</span>
            <span className="text-white font-bold text-xl">{characters[currentTurn]?.name}</span>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {characters[currentTurn] && (
            <CharacterCard
              character={characters[currentTurn]}
              isActive={true}
              onRemove={removeCharacter}
              onUpdateInitiative={updateInitiative}
              onAddToLog={addToLog}
              round={round}
              setCharacters={setCharacters}
              characters={characters}
            />
          )}

          {characters
            .filter((_, index) => index !== currentTurn)
            .map((char) => (
              <CharacterCard
                key={char.id}
                character={char}
                isActive={false}
                onRemove={removeCharacter}
                onUpdateInitiative={updateInitiative}
                onAddToLog={addToLog}
                round={round}
                setCharacters={setCharacters}
                characters={characters}
              />
            ))}
        </div>
      </div>
    </div>
  )
}