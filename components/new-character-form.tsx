"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Character } from "@/types"
import { useState } from "react"

interface NewCharacterFormProps {
  onSubmit: (character: Omit<Character, "id" | "conditions" | "log" | "inspiration" | "concentration">) => void
}

export function NewCharacterForm({ onSubmit }: NewCharacterFormProps) {
  const [character, setCharacter] = useState({
    name: "",
    hp: 0,
    tempHp: 0,
    initiative: 0,
    ac: 10,
    type: "player" as const,
    inspiration: false,
    concentration: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(character)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <Label htmlFor="name" className="text-[#ffd700]">
          Nombre
        </Label>
        <Input
          id="name"
          value={character.name}
          onChange={(e) => setCharacter({ ...character, name: e.target.value })}
          required
          className="bg-[#2c3e50] text-white"
        />
      </div>
      <div>
        <Label htmlFor="hp" className="text-[#ffd700]">
          PV
        </Label>
        <Input
          id="hp"
          type="number"
          value={character.hp}
          onChange={(e) => setCharacter({ ...character, hp: Number.parseInt(e.target.value) })}
          required
          className="bg-[#2c3e50] text-white"
        />
      </div>
      <div>
        <Label htmlFor="tempHp" className="text-[#ffd700]">
          PV Temporal
        </Label>
        <Input
          id="tempHp"
          type="number"
          value={character.tempHp}
          onChange={(e) => setCharacter({ ...character, tempHp: Number.parseInt(e.target.value) })}
          className="bg-[#2c3e50] text-white"
        />
      </div>
      <div>
        <Label htmlFor="initiative" className="text-[#ffd700]">
          Iniciativa
        </Label>
        <Input
          id="initiative"
          type="number"
          value={character.initiative}
          onChange={(e) => setCharacter({ ...character, initiative: Number.parseInt(e.target.value) })}
          required
          className="bg-[#2c3e50] text-white"
        />
      </div>
      <div>
        <Label htmlFor="ac" className="text-[#ffd700]">
          CA
        </Label>
        <Input
          id="ac"
          type="number"
          value={character.ac}
          onChange={(e) => setCharacter({ ...character, ac: Number.parseInt(e.target.value) })}
          required
          className="bg-[#2c3e50] text-white"
        />
      </div>
      <div>
        <Label htmlFor="type" className="text-[#ffd700]">
          Tipo
        </Label>
        <Select
          value={character.type}
          onValueChange={(value: "player" | "enemy" | "neutral") => setCharacter({ ...character, type: value })}
        >
          <SelectTrigger className="bg-[#2c3e50] text-white">
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="player">Jugador</SelectItem>
            <SelectItem value="enemy">Enemigo</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="bg-[#ffd700] text-black hover:bg-[#ffed4a]">
        Crear Personaje
      </Button>
    </form>
  )
}

