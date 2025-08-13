import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/hooks/use-toast"

function extractVideoId(url: string) {
  try {
    const u = new URL(url)
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1)
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v")
    return url
  } catch {
    return url
  }
}

export default function YouTubePlayer() {
  const [url, setUrl] = useState("")
  const [videoId, setVideoId] = useState<string | null>(null)
  const [volume, setVolume] = useState(50)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    // Load Iframe API once
    if ((window as any).YT?.Player) return
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)
  }, [])

  useEffect(() => {
    (window as any).onYouTubeIframeAPIReady = () => {
      // no-op: player is created lazily on load
    }
  }, [])

  useEffect(() => {
    if (!videoId) return
    const YT = (window as any).YT
    if (!YT?.Player) {
      const int = setInterval(() => {
        if ((window as any).YT?.Player) {
          clearInterval(int)
          createOrLoad(videoId)
        }
      }, 200)
      return () => clearInterval(int)
    } else {
      createOrLoad(videoId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId])

  const createOrLoad = (id: string) => {
    const YT = (window as any).YT
    if (!playerRef.current) {
      playerRef.current = new YT.Player('yt-player', {
        height: '0',
        width: '0',
        videoId: id,
        playerVars: { autoplay: 1 },
        events: {
          onReady: () => {
            playerRef.current.setVolume(volume)
          }
        }
      })
    } else {
      playerRef.current.loadVideoById(id)
      playerRef.current.setVolume(volume)
    }
  }

  const load = () => {
    const id = extractVideoId(url.trim())
    if (!id) return toast({ title: "URL invalide" })
    setVideoId(id)
    toast({ title: "Musique chargée" })
  }

  const play = () => playerRef.current?.playVideo()
  const pause = () => playerRef.current?.pauseVideo()

  return (
    <Card className="glass animate-enter">
      <CardHeader>
        <CardTitle>Musique YouTube</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="hidden"><div id="yt-player" /></div>
        <div className="flex gap-2">
          <Input placeholder="URL YouTube" value={url} onChange={(e) => setUrl(e.target.value)} />
          <Button variant="hero" onClick={load}>Charger</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={play}>Lecture</Button>
          <Button variant="outline" onClick={pause}>Pause</Button>
        </div>
        <div>
          <p className="text-sm mb-2">Volume YouTube</p>
          <Slider value={[volume]} onValueChange={([v]) => { setVolume(v); playerRef.current?.setVolume(v) }} max={100} step={1} />
        </div>
        <p className="text-xs text-muted-foreground">La musique YouTube se mixe avec vos sons d'ambiance.</p>
      </CardContent>
    </Card>
  )
}
