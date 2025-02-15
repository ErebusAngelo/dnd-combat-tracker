"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Minus, Plus, Shield, Skull, Users, Trash2 } from "lucide-react"
import type { Character } from "@/types"
import type { Dispatch, SetStateAction } from "react"

const CONDITIONS = [
  "Envenenado",
  "Aturdido",
  "Cegado",
  "Inmovilizado",
  "Insomnio",
  "Paralizado",
  "Petrificado",
  "Silenciado",
  "Aterrorizado",
  "Debilitado",
  "Enfermo",
  "Maledito",
  "Encantado",
  "Dominado",
  "Exhausto",
  "Congelado",
  "Quemado",
  "Herido",
  "Sangrante",
]

interface CharacterCardProps {
  character: Character
  isActive: boolean
  onRemove: (id: string) => void
  onUpdateInitiative: (id: string, initiative: number) => void
  onAddToLog: (id: string, action: string) => void
  round: number
  setCharacters: Dispatch<SetStateAction<Character[]>>
  characters: Character[]
}

export function CharacterCard({
  character,
  isActive,
  onRemove,
  onUpdateInitiative,
  onAddToLog,
  round,
  setCharacters,
  characters,
}: CharacterCardProps) {
  return (
    <Card
      className={`relative overflow-hidden border-2 ${
        character.type === "player"
          ? "border-emerald-500"
          : character.type === "enemy"
            ? "border-red-500"
            : "border-white"
      } bg-[#1a2634] p-4 flex flex-col min-h-[500px]`}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          {character.type === "player" ? (
            <Users className="h-5 w-5 text-emerald-500" />
          ) : character.type === "enemy" ? (
            <Skull className="h-5 w-5 text-red-500" />
          ) : (
            <Users className="h-5 w-5 text-white" />
          )}
          <h3 className="text-xl font-bold text-[#ffd700]">{character.name}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(character.id)}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 />
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[#ffd700]">PV</Label>
          <div className="flex items-center">
            <Heart className="mr-2 text-red-500" />
            <Input
              type="number"
              value={character.hp}
              onChange={(e) =>
                setCharacters(
                  characters.map((c) => (c.id === character.id ? { ...c, hp: Number.parseInt(e.target.value) } : c)),
                )
              }
              className="bg-[#2c3e50] text-white border-gray-600"
            />
          </div>
        </div>
        <div>
          <Label className="text-[#ffd700]">PV Temporal</Label>
          <div className="flex items-center">
            <Heart className="mr-2 text-blue-500" />
            <Input
              type="number"
              value={character.tempHp}
              onChange={(e) =>
                setCharacters(
                  characters.map((c) =>
                    c.id === character.id ? { ...c, tempHp: Number.parseInt(e.target.value) } : c,
                  ),
                )
              }
              className="bg-[#2c3e50] text-white border-gray-600"
            />
          </div>
        </div>
        <div>
          <Label className="text-[#ffd700]">Iniciativa</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onUpdateInitiative(character.id, character.initiative - 1)}
              className="h-8 w-8 bg-[#2c3e50] border-gray-600 hover:bg-[#374151]"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={character.initiative}
              onChange={(e) => onUpdateInitiative(character.id, Number.parseInt(e.target.value))}
              className="w-20 bg-[#2c3e50] text-white border-gray-600"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => onUpdateInitiative(character.id, character.initiative + 1)}
              className="h-8 w-8 bg-[#2c3e50] border-gray-600 hover:bg-[#374151]"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div>
          <Label className="text-[#ffd700]">CA</Label>
          <div className="flex items-center">
            <Shield className="mr-2" />
            <Input
              type="number"
              value={character.ac}
              onChange={(e) =>
                setCharacters(
                  characters.map((c) => (c.id === character.id ? { ...c, ac: Number.parseInt(e.target.value) } : c)),
                )
              }
              className="bg-[#2c3e50] text-white border-gray-600"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Label className="text-[#ffd700] mb-2 block">Condiciones</Label>
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((condition) => (
            <Button
              key={condition}
              variant="outline"
              size="sm"
              className={`
                ${
                  character.conditions.includes(condition)
                    ? "bg-[#ffd700] text-black hover:bg-[#ffed4a]"
                    : "bg-[#2c3e50] text-white hover:bg-[#374151]"
                }
                transition-colors
              `}
              onClick={() =>
                setCharacters(
                  characters.map((c) =>
                    c.id === character.id
                      ? {
                          ...c,
                          conditions: c.conditions.includes(condition)
                            ? c.conditions.filter((cond) => cond !== condition)
                            : [...c.conditions, condition],
                        }
                      : c,
                  ),
                )
              }
            >
              {condition}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`inspiration-${character.id}`}
            checked={character.inspiration}
            onChange={(e) =>
              setCharacters(
                characters.map((c) => (c.id === character.id ? { ...c, inspiration: e.target.checked } : c)),
              )
            }
            className="w-4 h-4 rounded border-gray-600 bg-[#2c3e50] checked:bg-[#ffd700]"
          />
          <Label htmlFor={`inspiration-${character.id}`} className="text-white">
            Inspiración
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`concentration-${character.id}`}
            checked={character.concentration}
            onChange={(e) =>
              setCharacters(
                characters.map((c) => (c.id === character.id ? { ...c, concentration: e.target.checked } : c)),
              )
            }
            className="w-4 h-4 rounded border-gray-600 bg-[#2c3e50] checked:bg-[#ffd700]"
          />
          <Label htmlFor={`concentration-${character.id}`} className="text-white">
            Concentración
          </Label>
        </div>
      </div>
      <div className="mt-6 flex-grow flex flex-col">
        <Label className="text-[#ffd700]">Log</Label>
        <div className="flex gap-2">
          <Textarea
            placeholder="Añadir acción..."
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onAddToLog(character.id, e.currentTarget.value)
                e.currentTarget.value = ""
              }
            }}
            className="bg-[#2c3e50] text-white border-gray-600 h-20 resize-none p-2"
          />
        </div>
        <ScrollArea className="mt-2 flex-grow p-2 pt-0">
          {character.log.map((entry, i) => (
            <div key={i} className="text-sm text-white py-1">
              {entry}
            </div>
          ))}
        </ScrollArea>
      </div>
    </Card>
  )
}

