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

// Helper function to poll a prediction until completion
async function pollPrediction(predictionId, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    
    const response = await axios.get(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: {
          'Authorization': `Token ${REPLICATE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`  Poll ${i + 1}: ${response.data.status}`);
    
    if (response.data.status === 'succeeded' || response.data.status === 'failed') {
      return response.data;
    }
  }
  
  throw new Error('Prediction timeout');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', apiKeyConfigured: !!REPLICATE_API_KEY });
});

// Virtual try-on endpoint for multiple clothing items (nano banana pro)
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

    console.log(`\n========================================`);
    console.log(`Processing ${clothingImages.length} clothing items ALL AT ONCE`);
    console.log(`========================================`);
    console.log('Person image size:', personImage.length);
    console.log('Clothing items:', clothingImages.map(c => c.name).join(', '));

    // Prepare all images for a single API call
    // Format: [person_image, clothing_item_1, clothing_item_2, ...]
    const allImages = [personImage, ...clothingImages.map(item => item.image)];

    // Create prompt that instructs applying all clothing items at once
    const clothingNames = clothingImages.map(item => item.name).join(', ');
    const prompt = `Create a new image by combining the elements from the provided images. The first image is the person. The remaining images are clothing items (${clothingNames}). Apply all the clothing items to the person in the first image, creating a realistic photograph of the person wearing all the clothing items together. Maintain the person's original pose, face, and background while naturally incorporating all the clothing pieces.`;

    console.log(`\n--- Applying all ${clothingImages.length} items at once ---`);

    // Create single prediction with all images
    const response = await axios.post(
      'https://api.replicate.com/v1/models/google/nano-banana-pro/predictions',
      {
        input: {
          prompt: prompt,
          resolution: "2K",
          image_input: allImages,
          aspect_ratio: "match_input_image",
          output_format: "jpg",
          safety_filter_level: "block_only_high"
        }
      },
      {
        headers: {
          'Authorization': `Token ${REPLICATE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`  Created prediction: ${response.data.id}`);

    // Wait for the prediction to complete
    const result = await pollPrediction(response.data.id);

    if (result.status === 'failed') {
      throw new Error(`Prediction failed: ${result.error}`);
    }

    console.log(`\n✓ All ${clothingImages.length} items applied successfully in single call!`);
    console.log(`========================================\n`);

    // Return the final result directly
    res.json({
      status: 'succeeded',
      output: result.output
    });

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

