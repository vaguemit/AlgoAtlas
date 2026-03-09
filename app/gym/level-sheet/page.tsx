"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Trophy, Target } from "lucide-react"
import Link from "next/link"

export interface Level {
  id: number
  timeLimit: number
  performance: number
  problems: {
    id: string
    difficulty: number
  }[]
}

export const levels: Level[] = [
  { id: 1, timeLimit: 120, performance: 900, problems: [{ id: "P1", difficulty: 800 }, { id: "P2", difficulty: 800 }, { id: "P3", difficulty: 800 }, { id: "P4", difficulty: 800 }] },
  { id: 2, timeLimit: 120, performance: 950, problems: [{ id: "P1", difficulty: 800 }, { id: "P2", difficulty: 800 }, { id: "P3", difficulty: 800 }, { id: "P4", difficulty: 900 }] },
  { id: 3, timeLimit: 120, performance: 1000, problems: [{ id: "P1", difficulty: 800 }, { id: "P2", difficulty: 800 }, { id: "P3", difficulty: 900 }, { id: "P4", difficulty: 900 }] },
  { id: 4, timeLimit: 120, performance: 1050, problems: [{ id: "P1", difficulty: 800 }, { id: "P2", difficulty: 900 }, { id: "P3", difficulty: 900 }, { id: "P4", difficulty: 900 }] },
  { id: 5, timeLimit: 120, performance: 1100, problems: [{ id: "P1", difficulty: 800 }, { id: "P2", difficulty: 900 }, { id: "P3", difficulty: 900 }, { id: "P4", difficulty: 1000 }] },
  { id: 6, timeLimit: 120, performance: 1125, problems: [{ id: "P1", difficulty: 800 }, { id: "P2", difficulty: 900 }, { id: "P3", difficulty: 1000 }, { id: "P4", difficulty: 1000 }] },
  { id: 7, timeLimit: 120, performance: 1150, problems: [{ id: "P1", difficulty: 800 }, { id: "P2", difficulty: 1000 }, { id: "P3", difficulty: 1000 }, { id: "P4", difficulty: 1000 }] },
  { id: 8, timeLimit: 120, performance: 1175, problems: [{ id: "P1", difficulty: 800 }, { id: "P2", difficulty: 1000 }, { id: "P3", difficulty: 1000 }, { id: "P4", difficulty: 1100 }] },
  { id: 9, timeLimit: 120, performance: 1200, problems: [{ id: "P1", difficulty: 800 }, { id: "P2", difficulty: 1000 }, { id: "P3", difficulty: 1100 }, { id: "P4", difficulty: 1100 }] },
  { id: 10, timeLimit: 120, performance: 1250, problems: [{ id: "P1", difficulty: 800 }, { id: "P2", difficulty: 1000 }, { id: "P3", difficulty: 1100 }, { id: "P4", difficulty: 1200 }] },
  { id: 11, timeLimit: 120, performance: 1300, problems: [{ id: "P1", difficulty: 800 }, { id: "P2", difficulty: 1000 }, { id: "P3", difficulty: 1200 }, { id: "P4", difficulty: 1200 }] },
  { id: 12, timeLimit: 120, performance: 1350, problems: [{ id: "P1", difficulty: 800 }, { id: "P2", difficulty: 1000 }, { id: "P3", difficulty: 1200 }, { id: "P4", difficulty: 1300 }] },
  { id: 13, timeLimit: 120, performance: 1400, problems: [{ id: "P1", difficulty: 800 }, { id: "P2", difficulty: 1000 }, { id: "P3", difficulty: 1200 }, { id: "P4", difficulty: 1400 }] },
  { id: 14, timeLimit: 120, performance: 1425, problems: [{ id: "P1", difficulty: 900 }, { id: "P2", difficulty: 1000 }, { id: "P3", difficulty: 1200 }, { id: "P4", difficulty: 1400 }] },
  { id: 15, timeLimit: 120, performance: 1450, problems: [{ id: "P1", difficulty: 900 }, { id: "P2", difficulty: 1100 }, { id: "P3", difficulty: 1200 }, { id: "P4", difficulty: 1400 }] },
  { id: 16, timeLimit: 120, performance: 1475, problems: [{ id: "P1", difficulty: 900 }, { id: "P2", difficulty: 1100 }, { id: "P3", difficulty: 1300 }, { id: "P4", difficulty: 1400 }] },
  { id: 17, timeLimit: 120, performance: 1500, problems: [{ id: "P1", difficulty: 900 }, { id: "P2", difficulty: 1100 }, { id: "P3", difficulty: 1300 }, { id: "P4", difficulty: 1500 }] },
  { id: 18, timeLimit: 120, performance: 1525, problems: [{ id: "P1", difficulty: 1000 }, { id: "P2", difficulty: 1100 }, { id: "P3", difficulty: 1300 }, { id: "P4", difficulty: 1500 }] },
  { id: 19, timeLimit: 120, performance: 1550, problems: [{ id: "P1", difficulty: 1000 }, { id: "P2", difficulty: 1200 }, { id: "P3", difficulty: 1300 }, { id: "P4", difficulty: 1500 }] },
  { id: 20, timeLimit: 120, performance: 1575, problems: [{ id: "P1", difficulty: 1000 }, { id: "P2", difficulty: 1200 }, { id: "P3", difficulty: 1400 }, { id: "P4", difficulty: 1500 }] },
  { id: 21, timeLimit: 120, performance: 1600, problems: [{ id: "P1", difficulty: 1000 }, { id: "P2", difficulty: 1200 }, { id: "P3", difficulty: 1400 }, { id: "P4", difficulty: 1600 }] },
  { id: 22, timeLimit: 120, performance: 1625, problems: [{ id: "P1", difficulty: 1100 }, { id: "P2", difficulty: 1200 }, { id: "P3", difficulty: 1400 }, { id: "P4", difficulty: 1600 }] },
  { id: 23, timeLimit: 120, performance: 1650, problems: [{ id: "P1", difficulty: 1100 }, { id: "P2", difficulty: 1300 }, { id: "P3", difficulty: 1400 }, { id: "P4", difficulty: 1600 }] },
  { id: 24, timeLimit: 120, performance: 1675, problems: [{ id: "P1", difficulty: 1100 }, { id: "P2", difficulty: 1300 }, { id: "P3", difficulty: 1500 }, { id: "P4", difficulty: 1600 }] },
  { id: 25, timeLimit: 120, performance: 1700, problems: [{ id: "P1", difficulty: 1100 }, { id: "P2", difficulty: 1300 }, { id: "P3", difficulty: 1500 }, { id: "P4", difficulty: 1700 }] },
  { id: 26, timeLimit: 120, performance: 1725, problems: [{ id: "P1", difficulty: 1200 }, { id: "P2", difficulty: 1300 }, { id: "P3", difficulty: 1500 }, { id: "P4", difficulty: 1700 }] },
  { id: 27, timeLimit: 120, performance: 1750, problems: [{ id: "P1", difficulty: 1200 }, { id: "P2", difficulty: 1400 }, { id: "P3", difficulty: 1500 }, { id: "P4", difficulty: 1700 }] },
  { id: 28, timeLimit: 120, performance: 1775, problems: [{ id: "P1", difficulty: 1200 }, { id: "P2", difficulty: 1400 }, { id: "P3", difficulty: 1600 }, { id: "P4", difficulty: 1700 }] },
  { id: 29, timeLimit: 120, performance: 1800, problems: [{ id: "P1", difficulty: 1200 }, { id: "P2", difficulty: 1400 }, { id: "P3", difficulty: 1600 }, { id: "P4", difficulty: 1800 }] },
  { id: 30, timeLimit: 120, performance: 1825, problems: [{ id: "P1", difficulty: 1300 }, { id: "P2", difficulty: 1400 }, { id: "P3", difficulty: 1600 }, { id: "P4", difficulty: 1800 }] },
  { id: 31, timeLimit: 120, performance: 1850, problems: [{ id: "P1", difficulty: 1300 }, { id: "P2", difficulty: 1500 }, { id: "P3", difficulty: 1600 }, { id: "P4", difficulty: 1800 }] },
  { id: 32, timeLimit: 120, performance: 1875, problems: [{ id: "P1", difficulty: 1300 }, { id: "P2", difficulty: 1500 }, { id: "P3", difficulty: 1700 }, { id: "P4", difficulty: 1800 }] },
  { id: 33, timeLimit: 120, performance: 1900, problems: [{ id: "P1", difficulty: 1300 }, { id: "P2", difficulty: 1500 }, { id: "P3", difficulty: 1700 }, { id: "P4", difficulty: 1900 }] },
  { id: 34, timeLimit: 120, performance: 1925, problems: [{ id: "P1", difficulty: 1400 }, { id: "P2", difficulty: 1500 }, { id: "P3", difficulty: 1700 }, { id: "P4", difficulty: 1900 }] },
  { id: 35, timeLimit: 120, performance: 1950, problems: [{ id: "P1", difficulty: 1400 }, { id: "P2", difficulty: 1600 }, { id: "P3", difficulty: 1700 }, { id: "P4", difficulty: 1900 }] },
  { id: 36, timeLimit: 120, performance: 1975, problems: [{ id: "P1", difficulty: 1400 }, { id: "P2", difficulty: 1600 }, { id: "P3", difficulty: 1800 }, { id: "P4", difficulty: 1900 }] },
  { id: 37, timeLimit: 120, performance: 2000, problems: [{ id: "P1", difficulty: 1400 }, { id: "P2", difficulty: 1600 }, { id: "P3", difficulty: 1800 }, { id: "P4", difficulty: 2000 }] },
  { id: 38, timeLimit: 120, performance: 2025, problems: [{ id: "P1", difficulty: 1500 }, { id: "P2", difficulty: 1600 }, { id: "P3", difficulty: 1800 }, { id: "P4", difficulty: 2000 }] },
  { id: 39, timeLimit: 120, performance: 2050, problems: [{ id: "P1", difficulty: 1500 }, { id: "P2", difficulty: 1700 }, { id: "P3", difficulty: 1800 }, { id: "P4", difficulty: 2000 }] },
  { id: 40, timeLimit: 120, performance: 2075, problems: [{ id: "P1", difficulty: 1500 }, { id: "P2", difficulty: 1700 }, { id: "P3", difficulty: 1900 }, { id: "P4", difficulty: 2000 }] },
  { id: 41, timeLimit: 120, performance: 2100, problems: [{ id: "P1", difficulty: 1500 }, { id: "P2", difficulty: 1700 }, { id: "P3", difficulty: 1900 }, { id: "P4", difficulty: 2100 }] },
  { id: 42, timeLimit: 120, performance: 2125, problems: [{ id: "P1", difficulty: 1600 }, { id: "P2", difficulty: 1700 }, { id: "P3", difficulty: 1900 }, { id: "P4", difficulty: 2100 }] },
  { id: 43, timeLimit: 120, performance: 2150, problems: [{ id: "P1", difficulty: 1600 }, { id: "P2", difficulty: 1800 }, { id: "P3", difficulty: 1900 }, { id: "P4", difficulty: 2100 }] },
  { id: 44, timeLimit: 120, performance: 2175, problems: [{ id: "P1", difficulty: 1600 }, { id: "P2", difficulty: 1800 }, { id: "P3", difficulty: 2000 }, { id: "P4", difficulty: 2100 }] },
  { id: 45, timeLimit: 120, performance: 2200, problems: [{ id: "P1", difficulty: 1600 }, { id: "P2", difficulty: 1800 }, { id: "P3", difficulty: 2000 }, { id: "P4", difficulty: 2200 }] },
  { id: 46, timeLimit: 120, performance: 2225, problems: [{ id: "P1", difficulty: 1700 }, { id: "P2", difficulty: 1800 }, { id: "P3", difficulty: 2000 }, { id: "P4", difficulty: 2200 }] },
  { id: 47, timeLimit: 120, performance: 2250, problems: [{ id: "P1", difficulty: 1700 }, { id: "P2", difficulty: 1900 }, { id: "P3", difficulty: 2000 }, { id: "P4", difficulty: 2200 }] },
  { id: 48, timeLimit: 120, performance: 2275, problems: [{ id: "P1", difficulty: 1700 }, { id: "P2", difficulty: 1900 }, { id: "P3", difficulty: 2100 }, { id: "P4", difficulty: 2200 }] },
  { id: 49, timeLimit: 120, performance: 2300, problems: [{ id: "P1", difficulty: 1700 }, { id: "P2", difficulty: 1900 }, { id: "P3", difficulty: 2100 }, { id: "P4", difficulty: 2300 }] },
  { id: 50, timeLimit: 120, performance: 2325, problems: [{ id: "P1", difficulty: 1800 }, { id: "P2", difficulty: 1900 }, { id: "P3", difficulty: 2100 }, { id: "P4", difficulty: 2300 }] },
  { id: 51, timeLimit: 120, performance: 2350, problems: [{ id: "P1", difficulty: 1800 }, { id: "P2", difficulty: 2000 }, { id: "P3", difficulty: 2100 }, { id: "P4", difficulty: 2300 }] },
  { id: 52, timeLimit: 120, performance: 2375, problems: [{ id: "P1", difficulty: 1800 }, { id: "P2", difficulty: 2000 }, { id: "P3", difficulty: 2200 }, { id: "P4", difficulty: 2300 }] },
  { id: 53, timeLimit: 120, performance: 2400, problems: [{ id: "P1", difficulty: 1800 }, { id: "P2", difficulty: 2000 }, { id: "P3", difficulty: 2200 }, { id: "P4", difficulty: 2400 }] },
  { id: 54, timeLimit: 120, performance: 2425, problems: [{ id: "P1", difficulty: 1900 }, { id: "P2", difficulty: 2000 }, { id: "P3", difficulty: 2200 }, { id: "P4", difficulty: 2400 }] },
  { id: 55, timeLimit: 125, performance: 2450, problems: [{ id: "P1", difficulty: 1900 }, { id: "P2", difficulty: 2100 }, { id: "P3", difficulty: 2200 }, { id: "P4", difficulty: 2400 }] },
  { id: 56, timeLimit: 125, performance: 2475, problems: [{ id: "P1", difficulty: 1900 }, { id: "P2", difficulty: 2100 }, { id: "P3", difficulty: 2300 }, { id: "P4", difficulty: 2400 }] },
  { id: 57, timeLimit: 130, performance: 2500, problems: [{ id: "P1", difficulty: 1900 }, { id: "P2", difficulty: 2100 }, { id: "P3", difficulty: 2300 }, { id: "P4", difficulty: 2500 }] },
  { id: 58, timeLimit: 130, performance: 2525, problems: [{ id: "P1", difficulty: 2000 }, { id: "P2", difficulty: 2100 }, { id: "P3", difficulty: 2300 }, { id: "P4", difficulty: 2500 }] },
  { id: 59, timeLimit: 135, performance: 2550, problems: [{ id: "P1", difficulty: 2000 }, { id: "P2", difficulty: 2200 }, { id: "P3", difficulty: 2300 }, { id: "P4", difficulty: 2500 }] },
  { id: 60, timeLimit: 135, performance: 2575, problems: [{ id: "P1", difficulty: 2000 }, { id: "P2", difficulty: 2200 }, { id: "P3", difficulty: 2400 }, { id: "P4", difficulty: 2500 }] },
  { id: 61, timeLimit: 140, performance: 2600, problems: [{ id: "P1", difficulty: 2000 }, { id: "P2", difficulty: 2200 }, { id: "P3", difficulty: 2400 }, { id: "P4", difficulty: 2600 }] },
  { id: 62, timeLimit: 140, performance: 2625, problems: [{ id: "P1", difficulty: 2100 }, { id: "P2", difficulty: 2200 }, { id: "P3", difficulty: 2400 }, { id: "P4", difficulty: 2600 }] },
  { id: 63, timeLimit: 145, performance: 2650, problems: [{ id: "P1", difficulty: 2100 }, { id: "P2", difficulty: 2300 }, { id: "P3", difficulty: 2400 }, { id: "P4", difficulty: 2600 }] },
  { id: 64, timeLimit: 145, performance: 2675, problems: [{ id: "P1", difficulty: 2100 }, { id: "P2", difficulty: 2300 }, { id: "P3", difficulty: 2500 }, { id: "P4", difficulty: 2600 }] },
  { id: 65, timeLimit: 150, performance: 2700, problems: [{ id: "P1", difficulty: 2100 }, { id: "P2", difficulty: 2300 }, { id: "P3", difficulty: 2500 }, { id: "P4", difficulty: 2700 }] },
  { id: 66, timeLimit: 150, performance: 2725, problems: [{ id: "P1", difficulty: 2200 }, { id: "P2", difficulty: 2300 }, { id: "P3", difficulty: 2500 }, { id: "P4", difficulty: 2700 }] },
  { id: 67, timeLimit: 155, performance: 2750, problems: [{ id: "P1", difficulty: 2200 }, { id: "P2", difficulty: 2400 }, { id: "P3", difficulty: 2500 }, { id: "P4", difficulty: 2700 }] },
  { id: 68, timeLimit: 155, performance: 2775, problems: [{ id: "P1", difficulty: 2200 }, { id: "P2", difficulty: 2400 }, { id: "P3", difficulty: 2600 }, { id: "P4", difficulty: 2700 }] },
  { id: 69, timeLimit: 160, performance: 2800, problems: [{ id: "P1", difficulty: 2200 }, { id: "P2", difficulty: 2400 }, { id: "P3", difficulty: 2600 }, { id: "P4", difficulty: 2800 }] },
  { id: 70, timeLimit: 160, performance: 2825, problems: [{ id: "P1", difficulty: 2300 }, { id: "P2", difficulty: 2400 }, { id: "P3", difficulty: 2600 }, { id: "P4", difficulty: 2800 }] },
  { id: 71, timeLimit: 165, performance: 2850, problems: [{ id: "P1", difficulty: 2300 }, { id: "P2", difficulty: 2500 }, { id: "P3", difficulty: 2600 }, { id: "P4", difficulty: 2800 }] },
  { id: 72, timeLimit: 165, performance: 2875, problems: [{ id: "P1", difficulty: 2300 }, { id: "P2", difficulty: 2500 }, { id: "P3", difficulty: 2700 }, { id: "P4", difficulty: 2800 }] },
  { id: 73, timeLimit: 170, performance: 2900, problems: [{ id: "P1", difficulty: 2300 }, { id: "P2", difficulty: 2500 }, { id: "P3", difficulty: 2700 }, { id: "P4", difficulty: 2900 }] },
  { id: 74, timeLimit: 170, performance: 2925, problems: [{ id: "P1", difficulty: 2400 }, { id: "P2", difficulty: 2500 }, { id: "P3", difficulty: 2700 }, { id: "P4", difficulty: 2900 }] },
  { id: 75, timeLimit: 175, performance: 2950, problems: [{ id: "P1", difficulty: 2400 }, { id: "P2", difficulty: 2600 }, { id: "P3", difficulty: 2700 }, { id: "P4", difficulty: 2900 }] },
  { id: 76, timeLimit: 175, performance: 2975, problems: [{ id: "P1", difficulty: 2400 }, { id: "P2", difficulty: 2600 }, { id: "P3", difficulty: 2800 }, { id: "P4", difficulty: 2900 }] },
  { id: 77, timeLimit: 180, performance: 3000, problems: [{ id: "P1", difficulty: 2400 }, { id: "P2", difficulty: 2600 }, { id: "P3", difficulty: 2800 }, { id: "P4", difficulty: 3000 }] },
  { id: 78, timeLimit: 180, performance: 3025, problems: [{ id: "P1", difficulty: 2500 }, { id: "P2", difficulty: 2600 }, { id: "P3", difficulty: 2800 }, { id: "P4", difficulty: 3000 }] },
  { id: 79, timeLimit: 180, performance: 3050, problems: [{ id: "P1", difficulty: 2500 }, { id: "P2", difficulty: 2700 }, { id: "P3", difficulty: 2800 }, { id: "P4", difficulty: 3000 }] },
  { id: 80, timeLimit: 180, performance: 3075, problems: [{ id: "P1", difficulty: 2500 }, { id: "P2", difficulty: 2700 }, { id: "P3", difficulty: 2900 }, { id: "P4", difficulty: 3000 }] },
  { id: 81, timeLimit: 180, performance: 3100, problems: [{ id: "P1", difficulty: 2500 }, { id: "P2", difficulty: 2700 }, { id: "P3", difficulty: 2900 }, { id: "P4", difficulty: 3100 }] },
  { id: 82, timeLimit: 180, performance: 3125, problems: [{ id: "P1", difficulty: 2600 }, { id: "P2", difficulty: 2700 }, { id: "P3", difficulty: 2900 }, { id: "P4", difficulty: 3100 }] },
  { id: 83, timeLimit: 180, performance: 3150, problems: [{ id: "P1", difficulty: 2600 }, { id: "P2", difficulty: 2800 }, { id: "P3", difficulty: 2900 }, { id: "P4", difficulty: 3100 }] },
  { id: 84, timeLimit: 180, performance: 3175, problems: [{ id: "P1", difficulty: 2600 }, { id: "P2", difficulty: 2800 }, { id: "P3", difficulty: 3000 }, { id: "P4", difficulty: 3100 }] },
  { id: 85, timeLimit: 180, performance: 3200, problems: [{ id: "P1", difficulty: 2600 }, { id: "P2", difficulty: 2800 }, { id: "P3", difficulty: 3000 }, { id: "P4", difficulty: 3200 }] },
  { id: 86, timeLimit: 180, performance: 3225, problems: [{ id: "P1", difficulty: 2700 }, { id: "P2", difficulty: 2800 }, { id: "P3", difficulty: 3000 }, { id: "P4", difficulty: 3200 }] },
  { id: 87, timeLimit: 180, performance: 3250, problems: [{ id: "P1", difficulty: 2700 }, { id: "P2", difficulty: 2900 }, { id: "P3", difficulty: 3000 }, { id: "P4", difficulty: 3200 }] },
  { id: 88, timeLimit: 180, performance: 3275, problems: [{ id: "P1", difficulty: 2700 }, { id: "P2", difficulty: 2900 }, { id: "P3", difficulty: 3100 }, { id: "P4", difficulty: 3200 }] },
  { id: 89, timeLimit: 180, performance: 3300, problems: [{ id: "P1", difficulty: 2700 }, { id: "P2", difficulty: 2900 }, { id: "P3", difficulty: 3100 }, { id: "P4", difficulty: 3300 }] },
  { id: 90, timeLimit: 180, performance: 3325, problems: [{ id: "P1", difficulty: 2800 }, { id: "P2", difficulty: 2900 }, { id: "P3", difficulty: 3100 }, { id: "P4", difficulty: 3300 }] },
  { id: 91, timeLimit: 180, performance: 3350, problems: [{ id: "P1", difficulty: 2800 }, { id: "P2", difficulty: 3000 }, { id: "P3", difficulty: 3100 }, { id: "P4", difficulty: 3300 }] },
  { id: 92, timeLimit: 180, performance: 3375, problems: [{ id: "P1", difficulty: 2800 }, { id: "P2", difficulty: 3000 }, { id: "P3", difficulty: 3200 }, { id: "P4", difficulty: 3300 }] },
  { id: 93, timeLimit: 180, performance: 3400, problems: [{ id: "P1", difficulty: 2800 }, { id: "P2", difficulty: 3000 }, { id: "P3", difficulty: 3200 }, { id: "P4", difficulty: 3400 }] },
  { id: 94, timeLimit: 180, performance: 3425, problems: [{ id: "P1", difficulty: 2900 }, { id: "P2", difficulty: 3000 }, { id: "P3", difficulty: 3200 }, { id: "P4", difficulty: 3400 }] },
  { id: 95, timeLimit: 180, performance: 3450, problems: [{ id: "P1", difficulty: 2900 }, { id: "P2", difficulty: 3100 }, { id: "P3", difficulty: 3200 }, { id: "P4", difficulty: 3400 }] },
  { id: 96, timeLimit: 180, performance: 3475, problems: [{ id: "P1", difficulty: 2900 }, { id: "P2", difficulty: 3100 }, { id: "P3", difficulty: 3300 }, { id: "P4", difficulty: 3400 }] },
  { id: 97, timeLimit: 180, performance: 3500, problems: [{ id: "P1", difficulty: 2900 }, { id: "P2", difficulty: 3100 }, { id: "P3", difficulty: 3300 }, { id: "P4", difficulty: 3500 }] },
  { id: 98, timeLimit: 180, performance: 3550, problems: [{ id: "P1", difficulty: 3000 }, { id: "P2", difficulty: 3100 }, { id: "P3", difficulty: 3300 }, { id: "P4", difficulty: 3500 }] },
  { id: 99, timeLimit: 180, performance: 3600, problems: [{ id: "P1", difficulty: 3100 }, { id: "P2", difficulty: 3100 }, { id: "P3", difficulty: 3300 }, { id: "P4", difficulty: 3500 }] },
  { id: 100, timeLimit: 180, performance: 3650, problems: [{ id: "P1", difficulty: 3100 }, { id: "P2", difficulty: 3200 }, { id: "P3", difficulty: 3300 }, { id: "P4", difficulty: 3500 }] },
  { id: 101, timeLimit: 180, performance: 3700, problems: [{ id: "P1", difficulty: 3200 }, { id: "P2", difficulty: 3200 }, { id: "P3", difficulty: 3300 }, { id: "P4", difficulty: 3500 }] },
  { id: 102, timeLimit: 180, performance: 3725, problems: [{ id: "P1", difficulty: 3200 }, { id: "P2", difficulty: 3300 }, { id: "P3", difficulty: 3300 }, { id: "P4", difficulty: 3500 }] },
  { id: 103, timeLimit: 180, performance: 3750, problems: [{ id: "P1", difficulty: 3300 }, { id: "P2", difficulty: 3300 }, { id: "P3", difficulty: 3300 }, { id: "P4", difficulty: 3500 }] },
  { id: 104, timeLimit: 180, performance: 3775, problems: [{ id: "P1", difficulty: 3300 }, { id: "P2", difficulty: 3300 }, { id: "P3", difficulty: 3400 }, { id: "P4", difficulty: 3500 }] },
  { id: 105, timeLimit: 180, performance: 3800, problems: [{ id: "P1", difficulty: 3300 }, { id: "P2", difficulty: 3400 }, { id: "P3", difficulty: 3400 }, { id: "P4", difficulty: 3500 }] },
  { id: 106, timeLimit: 180, performance: 3850, problems: [{ id: "P1", difficulty: 3400 }, { id: "P2", difficulty: 3400 }, { id: "P3", difficulty: 3400 }, { id: "P4", difficulty: 3500 }] },
  { id: 107, timeLimit: 180, performance: 3900, problems: [{ id: "P1", difficulty: 3400 }, { id: "P2", difficulty: 3400 }, { id: "P3", difficulty: 3500 }, { id: "P4", difficulty: 3500 }] },
  { id: 108, timeLimit: 180, performance: 3950, problems: [{ id: "P1", difficulty: 3400 }, { id: "P2", difficulty: 3500 }, { id: "P3", difficulty: 3500 }, { id: "P4", difficulty: 3500 }] },
  { id: 109, timeLimit: 180, performance: 4000, problems: [{ id: "P1", difficulty: 3500 }, { id: "P2", difficulty: 3500 }, { id: "P3", difficulty: 3500 }, { id: "P4", difficulty: 3500 }] },
]

export function getPerformanceColor(performance: number): string {
  if (performance <= 1000) return "text-green-400"
  if (performance <= 1500) return "text-blue-400"
  if (performance <= 2000) return "text-purple-400"
  if (performance <= 2500) return "text-pink-400"
  if (performance <= 3000) return "text-red-400"
  return "text-orange-400"
}

export function getDifficultyColor(difficulty: number): string {
  if (difficulty <= 1000) return "text-green-400"
  if (difficulty <= 1500) return "text-blue-400"
  if (difficulty <= 2000) return "text-purple-400"
  if (difficulty <= 2500) return "text-pink-400"
  if (difficulty <= 3000) return "text-red-400"
  return "text-orange-400"
}

function ProblemCard({ problem }: { problem: Level["problems"][0] }) {
  return (
    <div className="bg-black/95 backdrop-blur-sm border border-purple-500/20 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-purple-400">{problem.id}</span>
        <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
          {problem.difficulty}
        </span>
      </div>
    </div>
  )
}

function LevelCard({ level }: { level: Level }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg blur-md opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
      <div className="relative bg-black/95 backdrop-blur-sm border border-purple-500/20 p-6 rounded-lg hover:border-purple-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Trophy className="h-6 w-6 text-yellow-400 mr-2" />
            <h2 className="text-2xl font-bold text-white">Level {level.id}</h2>
          </div>
          <div className="flex items-center text-blue-400">
            <Clock className="h-5 w-5 mr-2" />
            <span>{level.timeLimit} min</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className={`flex items-center ${getPerformanceColor(level.performance)} mb-2`}>
            <Target className="h-5 w-5 mr-2" />
            <span>Performance Target: {level.performance}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {level.problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function LevelSheetPage() {
  return (
    <div className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link href="/gym">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Gym
          </motion.div>
        </Link>

        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
            Level Sheet
          </h1>
          <p className="text-lg text-blue-100/80">
            Progress through levels by solving problems within the time limit. Each level has a performance target and
            four problems of varying difficulty.
          </p>
        </div>

        {/* Level Grid */}
        <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto">
          {levels.map((level) => (
            <LevelCard key={level.id} level={level} />
          ))}
        </div>
      </div>
    </div>
  )
} 