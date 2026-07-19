export class ScreamDetector {
  constructor() {
    this.audioContext = null
    this.analyser = null
    this.dataArray = null
    this.isListening = false
    this.threshold = 70
    this.onScreamDetected = null
  }

  async start(onScreamDetected) {
    try {
      this.onScreamDetected = onScreamDetected
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const source = this.audioContext.createMediaStreamSource(stream)
      
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 2048
      source.connect(this.analyser)
      
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
      this.isListening = true
      
      this.detectScream()
      return true
    } catch (error) {
      console.error('Error starting scream detector:', error)
      return false
    }
  }

  detectScream() {
    if (!this.isListening) return

    this.analyser.getByteFrequencyData(this.dataArray)
    
    // Calculate average frequency
    const average = this.dataArray.reduce((a, b) => a + b) / this.dataArray.length
    
    // Simulate scream detection (in production, use ML model)
    // Screams typically have high frequency content and high energy
    const highFreqEnergy = this.getHighFrequencyEnergy()
    
    if (highFreqEnergy > this.threshold) {
      this.onScreamDetected?.(highFreqEnergy)
    }

    requestAnimationFrame(() => this.detectScream())
  }

  getHighFrequencyEnergy() {
    // High-pitched sounds (screams) are in higher frequency range
    const startIdx = Math.floor(this.dataArray.length * 0.7)
    const slice = this.dataArray.slice(startIdx)
    const energy = slice.reduce((a, b) => a + b) / slice.length
    return energy
  }

  stop() {
    this.isListening = false
    if (this.audioContext) {
      this.audioContext.close()
    }
  }

  setThreshold(value) {
    this.threshold = value
  }
}

export function simulateScreamDetection(callback, duration = 5000) {
  let timeElapsed = 0
  const interval = setInterval(() => {
    timeElapsed += 500
    
    // Simulate random scream detection for testing
    const random = Math.random()
    if (random > 0.7) {
      const confidence = 50 + random * 50
      callback(confidence)
    }

    if (timeElapsed >= duration) {
      clearInterval(interval)
    }
  }, 500)

  return () => clearInterval(interval)
}
