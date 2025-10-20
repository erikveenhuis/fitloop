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

// Virtual try-on endpoint
app.post('/api/tryon', async (req, res) => {
  try {
    const { personImage, clothingImage, category } = req.body;

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

    // Map category to model format
    const categoryMap = {
      'shirts': 'upper_body',
      'jackets': 'upper_body',
      'pants': 'lower_body',
      'dresses': 'dresses'
    };
    
    const modelCategory = categoryMap[category] || 'upper_body';
    
    console.log(`Creating prediction with model (category: ${modelCategory})...`);
    console.log('Person image size:', personImage.length);
    console.log('Clothing image size:', clothingImage.length);
    
    // Call Replicate API with IDM-VTON model
    // This model properly uses the provided garment image
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        // Using cuuupid/idm-vton - more accurate garment preservation
        version: 'c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4',
        input: {
          garm_img: clothingImage,
          human_img: personImage,
          garment_des: 't-shirt',
          is_checked: true,        // Enable cloth masking for better garment detection
          is_checked_crop: true,   // Enable auto-crop to isolate garment from background
          denoise_steps: 30,       // Higher quality (30 is good balance of quality/speed)
          seed: 42                 // Consistent results
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
    console.log('Prediction created:', predictionId);

    // Return the prediction ID to the client
    res.json({ predictionId, status: response.data.status });

  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
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

