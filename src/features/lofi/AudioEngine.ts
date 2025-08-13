export type TrackId = "rain" | "waves" | "brown"

export interface TrackState {
  enabled: boolean
  volume: number // 0..1
}

export class AudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private noiseBuffer: AudioBuffer | null = null

  private tracks = new Map<TrackId, { gain: GainNode; source?: AudioBufferSourceNode; filter?: BiquadFilterNode; lfo?: OscillatorNode; lfoGain?: GainNode }>()

  async start() {
    if (this.ctx) return
    const Ctor = window.AudioContext || (window as any).webkitAudioContext
    this.ctx = new Ctor()

    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = 0.9
    this.masterGain.connect(this.ctx.destination)

    this.noiseBuffer = this.createWhiteNoiseBuffer()

    ;(["rain", "waves", "brown"] as TrackId[]).forEach((id) => {
      const gain = this.ctx!.createGain()
      gain.gain.value = 0
      gain.connect(this.masterGain!)
      this.tracks.set(id, { gain })
    })
  }

  stop() {
    if (!this.ctx) return
    this.tracks.forEach((t) => {
      t.source?.stop()
      t.lfo?.stop()
    })
    this.tracks.clear()
    this.masterGain?.disconnect()
    this.ctx.close()
    this.ctx = null
    this.masterGain = null
    this.noiseBuffer = null
  }

  isRunning() {
    return !!this.ctx
  }

  setTrackEnabled(id: TrackId, enabled: boolean) {
    if (!this.ctx || !this.noiseBuffer) return
    const track = this.tracks.get(id)
    if (!track) return

    if (enabled && !track.source) {
      // build chain
      const src = this.ctx.createBufferSource()
      src.buffer = this.noiseBuffer
      src.loop = true

      let filter: BiquadFilterNode | undefined
      if (id === "rain") {
        filter = this.ctx.createBiquadFilter()
        filter.type = "highpass"
        filter.frequency.value = 500
      }
      if (id === "waves") {
        filter = this.ctx.createBiquadFilter()
        filter.type = "lowpass"
        filter.frequency.value = 600
        // slow swell via LFO
        const lfo = this.ctx.createOscillator()
        lfo.type = "sine"
        lfo.frequency.value = 0.1
        const lfoGain = this.ctx.createGain()
        lfoGain.gain.value = 0.25
        lfo.connect(lfoGain)
        lfoGain.connect(this.tracks.get(id)!.gain.gain)
        lfo.start()
        track.lfo = lfo
        track.lfoGain = lfoGain
      }
      if (id === "brown") {
        filter = this.ctx.createBiquadFilter()
        filter.type = "lowpass"
        filter.frequency.value = 200
        filter.Q.value = 0.7
      }

      if (filter) {
        src.connect(filter)
        filter.connect(track.gain)
        track.filter = filter
      } else {
        src.connect(track.gain)
      }

      src.start()
      track.source = src
    }

    if (!enabled && track.source) {
      track.source.stop()
      track.source.disconnect()
      track.lfo?.stop()
      track.lfo?.disconnect()
      track.filter?.disconnect()
      delete track.source
      delete track.lfo
      delete track.lfoGain
      delete track.filter
    }
  }

  setTrackVolume(id: TrackId, volume: number) {
    const track = this.tracks.get(id)
    if (!track) return
    track.gain.gain.value = volume
  }

  setMasterVolume(volume: number) {
    if (!this.masterGain) return
    this.masterGain.gain.value = volume
  }

  private createWhiteNoiseBuffer(): AudioBuffer {
    const sr = this.ctx!.sampleRate
    const bufferSize = sr * 2 // 2 seconds
    const buffer = this.ctx!.createBuffer(1, bufferSize, sr)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    return buffer
  }
}
