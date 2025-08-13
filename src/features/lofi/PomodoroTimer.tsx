import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

function formatTime(total: number) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

export default function PomodoroTimer() {
  const [focusMin, setFocusMin] = useState(25)
  const [breakMin, setBreakMin] = useState(5)
  const [remaining, setRemaining] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isFocus, setIsFocus] = useState(true)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          const nextIsFocus = !isFocus
          const next = (nextIsFocus ? focusMin : breakMin) * 60
          setIsFocus(nextIsFocus)
          toast({
            title: nextIsFocus ? "Focus" : "Pause",
            description: nextIsFocus ? "Nouvelle session de travail." : "Prenez une courte pause.",
          })
          return next
        }
        return r - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [isRunning, isFocus, focusMin, breakMin])

  const start = () => {
    setIsFocus(true)
    setRemaining(focusMin * 60)
    setIsRunning(true)
  }

  const stop = () => setIsRunning(false)
  const reset = () => {
    setIsRunning(false)
    setIsFocus(true)
    setRemaining(focusMin * 60)
  }

  return (
    <Card className="glass animate-enter">
      <CardHeader>
        <CardTitle>Pomodoro</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Focus (min)</label>
            <Input type="number" min={1} max={120} value={focusMin} onChange={(e) => setFocusMin(+e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Pause (min)</label>
            <Input type="number" min={1} max={60} value={breakMin} onChange={(e) => setBreakMin(+e.target.value)} />
          </div>
        </div>
        <div className="text-center py-2">
          <p className="text-sm text-muted-foreground mb-1">{isFocus ? "Session de focus" : "Pause"}</p>
          <p className="text-5xl font-display tracking-tight">{formatTime(remaining)}</p>
        </div>
        <div className="flex gap-2 justify-center">
          {!isRunning ? (
            <Button variant="hero" onClick={start}>Démarrer</Button>
          ) : (
            <Button variant="secondary" onClick={stop}>Pause</Button>
          )}
          <Button variant="outline" onClick={reset}>Réinitialiser</Button>
        </div>
      </CardContent>
    </Card>
  )
}
