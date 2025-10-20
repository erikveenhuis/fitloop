import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

const CameraCapture = forwardRef((props, ref) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    startCamera()

    return () => {
      // Cleanup: stop camera when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser')
      }

      // Request camera access with portrait orientation
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 768 },
          height: { ideal: 1024 },
          aspectRatio: { ideal: 3/4 },
          facingMode: 'user'
        },
        audio: false
      })

      setStream(mediaStream)
      
      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      setIsLoading(false)
    } catch (err) {
      console.error('Camera error:', err)
      setError(err.message || 'Failed to access camera')
      setIsLoading(false)
    }
  }

  // Expose captureFrame method to parent component
  useImperativeHandle(ref, () => ({
    captureFrame: () => {
      if (!videoRef.current || !canvasRef.current) {
        return null
      }

      const video = videoRef.current
      const canvas = canvasRef.current

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw current video frame to canvas
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to base64 image
      return canvas.toDataURL('image/jpeg', 0.9)
    }
  }))

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-red-700 font-medium mb-2">Camera Error</p>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <button
          onClick={startCamera}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Starting camera...</p>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full rounded-lg bg-black aspect-[3/4] object-cover"
        style={{ transform: 'scaleX(-1)' }} // Mirror the video
      />
      
      {/* Hidden canvas for capturing frames */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
})

CameraCapture.displayName = 'CameraCapture'

export default CameraCapture

