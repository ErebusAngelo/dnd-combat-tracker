export interface Character {
  id: string
  name: string
  hp: number
  tempHp: number
  initiative: number
  ac: number
  type: "player" | "enemy" | "neutral"
  conditions: string[]
  log: string[]
  inspiration: boolean
  concentration: boolean
}

export const CONDITIONS = [
  "Agarrado",
  "Apresado",
  "Asustado",
  "Aturdido",
  "Cegado",
  "Derribado",
  "Envenenado",
  "Incapacitado",
  "Inconsciente",
  "Invisible",
]

export const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100]

