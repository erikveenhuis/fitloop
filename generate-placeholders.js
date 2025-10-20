import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

const categories = {
  shirts: [
    { id: 'shirt-1', name: 'Blue T-Shirt', color: '#4A90E2' },
    { id: 'shirt-2', name: 'White Button-Up', color: '#FFFFFF' },
    { id: 'shirt-3', name: 'Black Polo', color: '#1a1a1a' },
    { id: 'shirt-4', name: 'Red Casual Shirt', color: '#E74C3C' },
    { id: 'shirt-5', name: 'Green Tee', color: '#27AE60' }
  ],
  pants: [
    { id: 'pants-1', name: 'Blue Jeans', color: '#2E5C8A' },
    { id: 'pants-2', name: 'Black Trousers', color: '#1a1a1a' },
    { id: 'pants-3', name: 'Khaki Chinos', color: '#8B7355' },
    { id: 'pants-4', name: 'Grey Slacks', color: '#6C757D' },
    { id: 'pants-5', name: 'Denim Shorts', color: '#5A7FA5' }
  ],
  jackets: [
    { id: 'jacket-1', name: 'Leather Jacket', color: '#2C1810' },
    { id: 'jacket-2', name: 'Denim Jacket', color: '#4A6FA5' },
    { id: 'jacket-3', name: 'Bomber Jacket', color: '#3D5A4C' },
    { id: 'jacket-4', name: 'Blazer', color: '#1F2937' },
    { id: 'jacket-5', name: 'Hoodie', color: '#7C3AED' }
  ],
  dresses: [
    { id: 'dress-1', name: 'Summer Dress', color: '#F59E0B' },
    { id: 'dress-2', name: 'Evening Gown', color: '#831843' },
    { id: 'dress-3', name: 'Casual Dress', color: '#10B981' },
    { id: 'dress-4', name: 'Cocktail Dress', color: '#EC4899' },
    { id: 'dress-5', name: 'Maxi Dress', color: '#6366F1' }
  ]
};

const width = 800;
const height = 800;

Object.entries(categories).forEach(([category, items]) => {
  items.forEach(item => {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Fill background with color
    ctx.fillStyle = item.color;
    ctx.fillRect(0, 0, width, height);

    // Add text
    ctx.fillStyle = item.color === '#FFFFFF' ? '#333333' : '#FFFFFF';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const lines = item.name.split(' ');
    lines.forEach((line, i) => {
      ctx.fillText(line, width / 2, height / 2 + (i - lines.length / 2 + 0.5) * 60);
    });

    // Save as PNG
    const dir = path.join('public', 'clothing', category);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const filepath = path.join(dir, `${item.id}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filepath, buffer);
    console.log(`Created: ${filepath}`);
  });
});

console.log('✅ All placeholder images generated!');

