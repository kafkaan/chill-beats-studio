import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { CloudRain, Waves, Wind, Power, Pause, Play } from "lucide-react"
import { AudioEngine, TrackId } from "./AudioEngine"

const TRACKS: { id: TrackId; name: string; icon: any; hint: string }[] = [
  { id: "rain", name: "Pluie", icon: CloudRain, hint: "Bruit de pluie filtré" },
  { id: "waves", name: "Vagues", icon: Waves, hint: "Houles lentes avec swell" },
  { id: "brown", name: "Grave", icon: Wind, hint: "Brown noise apaisant" },
]

export default function ControlPanel() {
  const engineRef = useRef<AudioEngine | null>(null)
  const [running, setRunning] = useState(false)
  const [master, setMaster] = useState(0.8)
  const [states, setStates] = useState<Record<TrackId, { enabled: boolean; volume: number }>>({
    rain: { enabled: false, volume: 0.5 },
    waves: { enabled: false, volume: 0.5 },
    brown: { enabled: false, volume: 0.4 },
  })

  useEffect(() => {
    return () => engineRef.current?.stop()
  }, [])

  const ensureEngine = async () => {
    if (!engineRef.current) engineRef.current = new AudioEngine()
    if (!engineRef.current.isRunning()) {
      await engineRef.current.start()
      toast({ title: "Session démarrée", description: "Audio initialisé." })
    }
    setRunning(true)
    engineRef.current.setMasterVolume(master)
  }

  const toggleEngine = async () => {
    if (!running) {
      await ensureEngine()
    } else {
      engineRef.current?.stop()
      setRunning(false)
      toast({ title: "Session arrêtée" })
    }
  }

  const toggleTrack = async (id: TrackId, enabled: boolean) => {
    if (!running) await ensureEngine()
    engineRef.current!.setTrackEnabled(id, enabled)
    setStates((s) => ({ ...s, [id]: { ...s[id], enabled } }))
  }

  const setVolume = (id: TrackId, volume: number) => {
    setStates((s) => ({ ...s, [id]: { ...s[id], volume } }))
    engineRef.current?.setTrackVolume(id, volume)
  }

  return (
    <Card className="glass animate-enter">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Mix d'ambiance
          <div className="flex items-center gap-2">
            <Button variant={running ? "secondary" : "hero"} onClick={toggleEngine}>
              {running ? <Pause className="mr-2" /> : <Play className="mr-2" />}
              {running ? "Pause" : "Démarrer"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TRACKS.map((t) => (
            <div key={t.id} className="p-4 rounded-lg border bg-card hover-scale">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <t.icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{t.name}</span>
                </div>
                <Switch
                  checked={states[t.id].enabled}
                  onCheckedChange={(v) => toggleTrack(t.id, v)}
                  aria-label={`Activer ${t.name}`}
                />
              </div>
              <Slider
                value={[states[t.id].volume]}
                onValueChange={([v]) => setVolume(t.id, v)}
                max={1}
                step={0.01}
                aria-label={`Volume ${t.name}`}
              />
              <p className="text-xs text-muted-foreground mt-2">{t.hint}</p>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <p className="text-sm mb-2">Volume général</p>
          <Slider
            value={[master]}
            onValueChange={([v]) => {
              setMaster(v)
              engineRef.current?.setMasterVolume(v)
            }}
            max={1}
            step={0.01}
          />
        </div>
      </CardContent>
    </Card>
  )
}
