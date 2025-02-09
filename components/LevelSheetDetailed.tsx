"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LevelInfo {
  level: number
  duration: number
  performance: number
  p1Rating: number
  p2Rating: number
  p3Rating: number
  p4Rating: number
}

const levelData: LevelInfo[] = [
  { level: 1, duration: 120, performance: 900, p1Rating: 800, p2Rating: 800, p3Rating: 800, p4Rating: 800 },
  { level: 2, duration: 120, performance: 950, p1Rating: 800, p2Rating: 800, p3Rating: 800, p4Rating: 900 },
  { level: 3, duration: 120, performance: 1000, p1Rating: 900, p2Rating: 900, p3Rating: 900, p4Rating: 1000 },
  { level: 4, duration: 150, performance: 1100, p1Rating: 1000, p2Rating: 1000, p3Rating: 1000, p4Rating: 1100 },
  { level: 5, duration: 150, performance: 1200, p1Rating: 1100, p2Rating: 1100, p3Rating: 1100, p4Rating: 1200 },
  { level: 6, duration: 150, performance: 1300, p1Rating: 1200, p2Rating: 1200, p3Rating: 1200, p4Rating: 1300 },
  { level: 7, duration: 180, performance: 1400, p1Rating: 1300, p2Rating: 1300, p3Rating: 1300, p4Rating: 1400 },
  { level: 8, duration: 180, performance: 1500, p1Rating: 1400, p2Rating: 1400, p3Rating: 1400, p4Rating: 1500 },
  { level: 9, duration: 180, performance: 1600, p1Rating: 1500, p2Rating: 1500, p3Rating: 1500, p4Rating: 1600 },
  { level: 10, duration: 210, performance: 1700, p1Rating: 1600, p2Rating: 1600, p3Rating: 1600, p4Rating: 1700 },
  { level: 11, duration: 210, performance: 1800, p1Rating: 1700, p2Rating: 1700, p3Rating: 1700, p4Rating: 1800 },
  { level: 12, duration: 210, performance: 1900, p1Rating: 1800, p2Rating: 1800, p3Rating: 1800, p4Rating: 1900 },
  { level: 13, duration: 240, performance: 2000, p1Rating: 1900, p2Rating: 1900, p3Rating: 1900, p4Rating: 2000 },
  { level: 14, duration: 240, performance: 2100, p1Rating: 2000, p2Rating: 2000, p3Rating: 2000, p4Rating: 2100 },
  { level: 15, duration: 240, performance: 2200, p1Rating: 2100, p2Rating: 2100, p3Rating: 2100, p4Rating: 2200 },
  { level: 16, duration: 270, performance: 2300, p1Rating: 2200, p2Rating: 2200, p3Rating: 2200, p4Rating: 2300 },
  { level: 17, duration: 270, performance: 2400, p1Rating: 2300, p2Rating: 2300, p3Rating: 2300, p4Rating: 2400 },
  { level: 18, duration: 270, performance: 2500, p1Rating: 2400, p2Rating: 2400, p3Rating: 2400, p4Rating: 2500 },
  { level: 19, duration: 300, performance: 2600, p1Rating: 2500, p2Rating: 2500, p3Rating: 2500, p4Rating: 2600 },
  { level: 20, duration: 300, performance: 2700, p1Rating: 2600, p2Rating: 2600, p3Rating: 2600, p4Rating: 2700 },
  { level: 21, duration: 300, performance: 2800, p1Rating: 2700, p2Rating: 2700, p3Rating: 2700, p4Rating: 2800 },
  { level: 22, duration: 330, performance: 2900, p1Rating: 2800, p2Rating: 2800, p3Rating: 2800, p4Rating: 2900 },
  { level: 23, duration: 330, performance: 3000, p1Rating: 2900, p2Rating: 2900, p3Rating: 2900, p4Rating: 3000 },
  { level: 24, duration: 330, performance: 3100, p1Rating: 3000, p2Rating: 3000, p3Rating: 3000, p4Rating: 3100 },
  { level: 25, duration: 360, performance: 3200, p1Rating: 3100, p2Rating: 3100, p3Rating: 3100, p4Rating: 3200 },
  { level: 26, duration: 360, performance: 3300, p1Rating: 3200, p2Rating: 3200, p3Rating: 3200, p4Rating: 3300 },
  { level: 27, duration: 360, performance: 3400, p1Rating: 3300, p2Rating: 3300, p3Rating: 3300, p4Rating: 3400 },
  { level: 28, duration: 390, performance: 3500, p1Rating: 3400, p2Rating: 3400, p3Rating: 3400, p4Rating: 3500 },
  { level: 29, duration: 390, performance: 3600, p1Rating: 3500, p2Rating: 3500, p3Rating: 3500, p4Rating: 3600 },
  { level: 30, duration: 390, performance: 3700, p1Rating: 3600, p2Rating: 3600, p3Rating: 3600, p4Rating: 3700 },
  { level: 31, duration: 420, performance: 3800, p1Rating: 3700, p2Rating: 3700, p3Rating: 3700, p4Rating: 3800 },
  { level: 32, duration: 420, performance: 3900, p1Rating: 3800, p2Rating: 3800, p3Rating: 3800, p4Rating: 3900 },
  { level: 33, duration: 420, performance: 4000, p1Rating: 3900, p2Rating: 3900, p3Rating: 3900, p4Rating: 4000 },
  { level: 34, duration: 450, performance: 4100, p1Rating: 4000, p2Rating: 4000, p3Rating: 4000, p4Rating: 4100 },
  { level: 35, duration: 450, performance: 4200, p1Rating: 4100, p2Rating: 4100, p3Rating: 4100, p4Rating: 4200 },
  { level: 36, duration: 450, performance: 4300, p1Rating: 4200, p2Rating: 4200, p3Rating: 4200, p4Rating: 4300 },
  { level: 37, duration: 480, performance: 4400, p1Rating: 4300, p2Rating: 4300, p3Rating: 4300, p4Rating: 4400 },
  { level: 38, duration: 480, performance: 4500, p1Rating: 4400, p2Rating: 4400, p3Rating: 4400, p4Rating: 4500 },
  { level: 39, duration: 480, performance: 4600, p1Rating: 4500, p2Rating: 4500, p3Rating: 4500, p4Rating: 4600 },
  { level: 40, duration: 510, performance: 4700, p1Rating: 4600, p2Rating: 4600, p3Rating: 4600, p4Rating: 4700 },
  { level: 41, duration: 510, performance: 4800, p1Rating: 4700, p2Rating: 4700, p3Rating: 4700, p4Rating: 4800 },
  { level: 42, duration: 510, performance: 4900, p1Rating: 4800, p2Rating: 4800, p3Rating: 4800, p4Rating: 4900 },
  { level: 43, duration: 540, performance: 5000, p1Rating: 4900, p2Rating: 4900, p3Rating: 4900, p4Rating: 5000 },
  { level: 44, duration: 540, performance: 5100, p1Rating: 5000, p2Rating: 5000, p3Rating: 5000, p4Rating: 5100 },
  { level: 45, duration: 540, performance: 5200, p1Rating: 5100, p2Rating: 5100, p3Rating: 5100, p4Rating: 5200 },
  { level: 46, duration: 570, performance: 5300, p1Rating: 5200, p2Rating: 5200, p3Rating: 5200, p4Rating: 5300 },
  { level: 47, duration: 570, performance: 5400, p1Rating: 5300, p2Rating: 5300, p3Rating: 5300, p4Rating: 5400 },
  { level: 48, duration: 570, performance: 5500, p1Rating: 5400, p2Rating: 5400, p3Rating: 5400, p4Rating: 5500 },
  { level: 49, duration: 600, performance: 5600, p1Rating: 5500, p2Rating: 5500, p3Rating: 5500, p4Rating: 5600 },
  { level: 50, duration: 600, performance: 5700, p1Rating: 5600, p2Rating: 5600, p3Rating: 5600, p4Rating: 5700 },
  { level: 51, duration: 600, performance: 5800, p1Rating: 5700, p2Rating: 5700, p3Rating: 5700, p4Rating: 5800 },
  { level: 52, duration: 630, performance: 5900, p1Rating: 5800, p2Rating: 5800, p3Rating: 5800, p4Rating: 5900 },
  { level: 53, duration: 630, performance: 6000, p1Rating: 5900, p2Rating: 5900, p3Rating: 5900, p4Rating: 6000 },
  { level: 54, duration: 630, performance: 6100, p1Rating: 6000, p2Rating: 6000, p3Rating: 6000, p4Rating: 6100 },
  { level: 55, duration: 660, performance: 6200, p1Rating: 6100, p2Rating: 6100, p3Rating: 6100, p4Rating: 6200 },
  { level: 56, duration: 660, performance: 6300, p1Rating: 6200, p2Rating: 6200, p3Rating: 6200, p4Rating: 6300 },
  { level: 57, duration: 660, performance: 6400, p1Rating: 6300, p2Rating: 6300, p3Rating: 6300, p4Rating: 6400 },
  { level: 58, duration: 690, performance: 6500, p1Rating: 6400, p2Rating: 6400, p3Rating: 6400, p4Rating: 6500 },
  { level: 59, duration: 690, performance: 6600, p1Rating: 6500, p2Rating: 6500, p3Rating: 6500, p4Rating: 6600 },
  { level: 60, duration: 690, performance: 6700, p1Rating: 6600, p2Rating: 6600, p3Rating: 6600, p4Rating: 6700 },
  { level: 61, duration: 720, performance: 6800, p1Rating: 6700, p2Rating: 6700, p3Rating: 6700, p4Rating: 6800 },
  { level: 62, duration: 720, performance: 6900, p1Rating: 6800, p2Rating: 6800, p3Rating: 6800, p4Rating: 6900 },
  { level: 63, duration: 720, performance: 7000, p1Rating: 6900, p2Rating: 6900, p3Rating: 6900, p4Rating: 7000 },
  { level: 64, duration: 750, performance: 7100, p1Rating: 7000, p2Rating: 7000, p3Rating: 7000, p4Rating: 7100 },
  { level: 65, duration: 750, performance: 7200, p1Rating: 7100, p2Rating: 7100, p3Rating: 7100, p4Rating: 7200 },
  { level: 66, duration: 750, performance: 7300, p1Rating: 7200, p2Rating: 7200, p3Rating: 7200, p4Rating: 7300 },
  { level: 67, duration: 780, performance: 7400, p1Rating: 7300, p2Rating: 7300, p3Rating: 7300, p4Rating: 7400 },
  { level: 68, duration: 780, performance: 7500, p1Rating: 7400, p2Rating: 7400, p3Rating: 7400, p4Rating: 7500 },
  { level: 69, duration: 780, performance: 7600, p1Rating: 7500, p2Rating: 7500, p3Rating: 7500, p4Rating: 7600 },
  { level: 70, duration: 810, performance: 7700, p1Rating: 7600, p2Rating: 7600, p3Rating: 7600, p4Rating: 7700 },
  { level: 71, duration: 810, performance: 7800, p1Rating: 7700, p2Rating: 7700, p3Rating: 7700, p4Rating: 7800 },
  { level: 72, duration: 810, performance: 7900, p1Rating: 7800, p2Rating: 7800, p3Rating: 7800, p4Rating: 7900 },
  { level: 73, duration: 840, performance: 8000, p1Rating: 7900, p2Rating: 7900, p3Rating: 7900, p4Rating: 8000 },
  { level: 74, duration: 840, performance: 8100, p1Rating: 8000, p2Rating: 8000, p3Rating: 8000, p4Rating: 8100 },
  { level: 75, duration: 840, performance: 8200, p1Rating: 8100, p2Rating: 8100, p3Rating: 8100, p4Rating: 8200 },
  { level: 76, duration: 870, performance: 8300, p1Rating: 8200, p2Rating: 8200, p3Rating: 8200, p4Rating: 8300 },
  { level: 77, duration: 870, performance: 8400, p1Rating: 8300, p2Rating: 8300, p3Rating: 8300, p4Rating: 8400 },
  { level: 78, duration: 870, performance: 8500, p1Rating: 8400, p2Rating: 8400, p3Rating: 8400, p4Rating: 8500 },
  { level: 79, duration: 900, performance: 8600, p1Rating: 8500, p2Rating: 8500, p3Rating: 8500, p4Rating: 8600 },
  { level: 80, duration: 900, performance: 8700, p1Rating: 8600, p2Rating: 8600, p3Rating: 8600, p4Rating: 8700 },
  { level: 81, duration: 900, performance: 8800, p1Rating: 8700, p2Rating: 8700, p3Rating: 8700, p4Rating: 8800 },
  { level: 82, duration: 930, performance: 8900, p1Rating: 8800, p2Rating: 8800, p3Rating: 8800, p4Rating: 8900 },
  { level: 83, duration: 930, performance: 9000, p1Rating: 8900, p2Rating: 8900, p3Rating: 8900, p4Rating: 9000 },
  { level: 84, duration: 930, performance: 9100, p1Rating: 9000, p2Rating: 9000, p3Rating: 9000, p4Rating: 9100 },
  { level: 85, duration: 960, performance: 9200, p1Rating: 9100, p2Rating: 9100, p3Rating: 9100, p4Rating: 9200 },
  { level: 86, duration: 960, performance: 9300, p1Rating: 9200, p2Rating: 9200, p3Rating: 9200, p4Rating: 9300 },
  { level: 87, duration: 960, performance: 9400, p1Rating: 9300, p2Rating: 9300, p3Rating: 9300, p4Rating: 9400 },
  { level: 88, duration: 990, performance: 9500, p1Rating: 9400, p2Rating: 9400, p3Rating: 9400, p4Rating: 9500 },
  { level: 89, duration: 990, performance: 9600, p1Rating: 9500, p2Rating: 9500, p3Rating: 9500, p4Rating: 9600 },
  { level: 90, duration: 990, performance: 9700, p1Rating: 9600, p2Rating: 9600, p3Rating: 9600, p4Rating: 9700 },
  { level: 91, duration: 1020, performance: 9800, p1Rating: 9700, p2Rating: 9700, p3Rating: 9700, p4Rating: 9800 },
  { level: 92, duration: 1020, performance: 9900, p1Rating: 9800, p2Rating: 9800, p3Rating: 9800, p4Rating: 9900 },
  { level: 93, duration: 1020, performance: 10000, p1Rating: 9900, p2Rating: 9900, p3Rating: 9900, p4Rating: 10000 },
  { level: 94, duration: 1050, performance: 10100, p1Rating: 10000, p2Rating: 10000, p3Rating: 10000, p4Rating: 10100 },
  { level: 95, duration: 1050, performance: 10200, p1Rating: 10100, p2Rating: 10100, p3Rating: 10100, p4Rating: 10200 },
  { level: 96, duration: 1050, performance: 10300, p1Rating: 10200, p2Rating: 10200, p3Rating: 10200, p4Rating: 10300 },
  { level: 97, duration: 1080, performance: 10400, p1Rating: 10300, p2Rating: 10300, p3Rating: 10300, p4Rating: 10400 },
  { level: 98, duration: 1080, performance: 10500, p1Rating: 10400, p2Rating: 10400, p3Rating: 10400, p4Rating: 10500 },
  { level: 99, duration: 1080, performance: 10600, p1Rating: 10500, p2Rating: 10500, p3Rating: 10500, p4Rating: 10600 },
  {
    level: 100,
    duration: 1110,
    performance: 10700,
    p1Rating: 10600,
    p2Rating: 10600,
    p3Rating: 10600,
    p4Rating: 10700,
  },
  {
    level: 101,
    duration: 1110,
    performance: 10800,
    p1Rating: 10700,
    p2Rating: 10700,
    p3Rating: 10700,
    p4Rating: 10800,
  },
  {
    level: 102,
    duration: 1110,
    performance: 10900,
    p1Rating: 10800,
    p2Rating: 10800,
    p3Rating: 10800,
    p4Rating: 10900,
  },
  {
    level: 103,
    duration: 1140,
    performance: 11000,
    p1Rating: 10900,
    p2Rating: 10900,
    p3Rating: 10900,
    p4Rating: 11000,
  },
  {
    level: 104,
    duration: 1140,
    performance: 11100,
    p1Rating: 11000,
    p2Rating: 11000,
    p3Rating: 11000,
    p4Rating: 11100,
  },
  {
    level: 105,
    duration: 1140,
    performance: 11200,
    p1Rating: 11100,
    p2Rating: 11100,
    p3Rating: 11100,
    p4Rating: 11200,
  },
  {
    level: 106,
    duration: 1170,
    performance: 11300,
    p1Rating: 11200,
    p2Rating: 11200,
    p3Rating: 11200,
    p4Rating: 11300,
  },
  {
    level: 107,
    duration: 1170,
    performance: 11400,
    p1Rating: 11300,
    p2Rating: 11300,
    p3Rating: 11300,
    p4Rating: 11400,
  },
  {
    level: 108,
    duration: 1170,
    performance: 11500,
    p1Rating: 11400,
    p2Rating: 11400,
    p3Rating: 11400,
    p4Rating: 11500,
  },
  { level: 109, duration: 180, performance: 4000, p1Rating: 3500, p2Rating: 3500, p3Rating: 3500, p4Rating: 3500 },
]

export function LevelSheetDetailed() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLevels = levelData.filter(
    (level) => level.level.toString().includes(searchTerm) || level.performance.toString().includes(searchTerm),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contest Levels</CardTitle>
        <CardDescription>Find the right contest level for your skills</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="search">Search Levels</Label>
          <Input
            id="search"
            placeholder="Search by level or performance rating"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Level</TableHead>
                <TableHead>Duration (min)</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>P1 Rating</TableHead>
                <TableHead>P2 Rating</TableHead>
                <TableHead>P3 Rating</TableHead>
                <TableHead>P4 Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLevels.map((level) => (
                <TableRow key={level.level}>
                  <TableCell>{level.level}</TableCell>
                  <TableCell>{level.duration}</TableCell>
                  <TableCell>{level.performance}</TableCell>
                  <TableCell>{level.p1Rating}</TableCell>
                  <TableCell>{level.p2Rating}</TableCell>
                  <TableCell>{level.p3Rating}</TableCell>
                  <TableCell>{level.p4Rating}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

