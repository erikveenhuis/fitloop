import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

const CameraCapture = forwardRef((props, ref) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [inputMode, setInputMode] = useState('camera') // 'camera' or 'upload'
  const [uploadedImage, setUploadedImage] = useState(null)

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

      // Request camera access with flexible constraints for mobile
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 640, ideal: 768, max: 1920 },
          height: { min: 480, ideal: 1024, max: 1920 },
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
      // Switch to upload mode instead of showing error
      setInputMode('upload')
      setIsLoading(false)
      // Still set error for the "Try Again" button in upload mode
      setError(err.message || 'Failed to access camera')
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target.result)
        setInputMode('upload')
      }
      reader.readAsDataURL(file)
    }
  }

  const switchToCamera = () => {
    setInputMode('camera')
    setUploadedImage(null)
    setError(null)
    if (!stream) {
      startCamera()
    }
  }

  // Expose captureFrame method to parent component
  useImperativeHandle(ref, () => ({
    captureFrame: () => {
      // If using uploaded image, return it directly
      if (inputMode === 'upload' && uploadedImage) {
        return uploadedImage
      }

      // Otherwise capture from camera
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

  // Remove the separate error state - now handled within the UI

  return (
    <div className="space-y-4">
      {/* Mode Toggle Buttons */}
      <div className="flex gap-2">
        <button
          onClick={switchToCamera}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            inputMode === 'camera'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Camera
        </button>
        <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
          inputMode === 'upload'
            ? 'bg-blue-600 text-white shadow-lg'
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Upload Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Display Area */}
      <div className="relative">
        {inputMode === 'camera' ? (
          <>
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
              className="w-full rounded-lg bg-black aspect-[3/4] object-contain"
              style={{ transform: 'scaleX(-1)' }} // Mirror the video
            />
          </>
        ) : (
          <div className="relative">
            {uploadedImage ? (
              <>
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full rounded-lg bg-black aspect-[3/4] object-contain"
                />
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                  Uploaded Photo
                </div>
              </>
            ) : (
              <div className="w-full rounded-lg bg-gray-800 aspect-[3/4] flex items-center justify-center">
                <div className="text-center text-white/50 p-6">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {error ? (
                    <>
                      <p className="text-yellow-300 font-medium mb-2">📷 Camera unavailable</p>
                      <p className="text-white/40 text-sm mb-4">{error}</p>
                      <p className="text-white/60">Click "Upload Photo" to select an image</p>
                      <button
                        onClick={switchToCamera}
                        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Try Camera Again
                      </button>
                    </>
                  ) : (
                    <p>Click "Upload Photo" to select an image</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Hidden canvas for capturing frames */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
})

CameraCapture.displayName = 'CameraCapture'

export default CameraCapture

