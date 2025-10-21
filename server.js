import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Clean and validate API key (remove any whitespace/newlines)
const REPLICATE_API_KEY = process.env.VITE_REPLICATE_API_KEY?.trim();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', apiKeyConfigured: !!REPLICATE_API_KEY });
});

// Virtual try-on endpoint for multiple clothing items (nano banana)
app.post('/api/tryon-multiple', async (req, res) => {
  try {
    const { personImage, clothingImages, category } = req.body;

    if (!REPLICATE_API_KEY || REPLICATE_API_KEY === 'your_api_key_here') {
      return res.status(400).json({
        error: 'API key not configured',
        message: 'Please add your Replicate API key to the .env file'
      });
    }

    // Validate API key format
    if (!/^r8_[a-zA-Z0-9]+$/.test(REPLICATE_API_KEY)) {
      console.error('Invalid API key format. Key may contain invalid characters or whitespace.');
      return res.status(400).json({
        error: 'Invalid API key format',
        message: 'API key appears to have invalid characters. Please check for spaces or newlines.'
      });
    }

    console.log(`Creating multi-garment prediction with ${clothingImages.length} items using google/nano-banana...`);
    console.log('Person image size:', personImage.length);
    console.log('Clothing items:', clothingImages.map(c => c.name).join(', '));

    // Using google/nano-banana for multi-image fusion
    // This combines the person image with all clothing items in a single AI pass
    
    // Use the recommended prompt template for multi-image fusion
    const prompt = `Create a new image by combining the elements from the provided images. Take the clothing items from the first ${clothingImages.length} images and place them on the person from the last image. The final image should be a realistic photograph of the person wearing the new clothing items, maintaining their original pose, face, and background.`;
    
    console.log('Nano Banana prompt:', prompt);

    // Prepare input images array (clothing items first, then person)
    const inputImages = [...clothingImages.map(item => item.image), personImage];
    
    // Use the model-specific endpoint (no version required)
    const response = await axios.post(
      'https://api.replicate.com/v1/models/google/nano-banana/predictions',
      {
        input: {
          prompt: prompt,
          image_input: inputImages, // All images: person first, then clothing items
          aspect_ratio: "match_input_image",
          output_format: "jpg"
        }
      },
      {
        headers: {
          'Authorization': `Token ${REPLICATE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const predictionId = response.data.id;
    console.log('Nano Banana prediction created:', predictionId);

    // Return the prediction ID to the client
    res.json({ predictionId, status: response.data.status });

  } catch (error) {
    console.error('Multi-item API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.detail || error.message,
      status: error.response?.status
    });
  }
});

// Poll prediction status
app.get('/api/tryon/:predictionId', async (req, res) => {
  try {
    const { predictionId } = req.params;

    // Check if it's a multi-item prediction
    if (predictionId.startsWith('multi-')) {
      global.multiResults = global.multiResults || {};
      const result = global.multiResults[predictionId];
      
      if (result) {
        res.json({
          status: 'succeeded',
          output: result
        });
        // Clean up
        delete global.multiResults[predictionId];
      } else {
        res.json({ status: 'processing' });
      }
      return;
    }

    const response = await axios.get(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: {
          'Authorization': `Token ${REPLICATE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error('Polling Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.detail || error.message
    });
  }
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoint: /api/tryon`);
  console.log(`🔑 API Key configured: ${REPLICATE_API_KEY ? 'Yes' : 'No'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

