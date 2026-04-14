require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const modelsDir = path.join(__dirname, '../models');
global.models = {};

fs.readdirSync(modelsDir)
  .filter((file) => file.endsWith('.js'))
  .forEach((file) => {
    const model = require(path.join(modelsDir, file));
    const globalName = model.modelName || path.basename(file, '.js');

    global[globalName] = model;
    global.models[globalName] = model;
  });

var mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.warn('[console] MONGODB_URI is not set. Console will attempt to connect to mongodb://127.0.0.1:27017/nodejs_practices');
  mongoUri = 'mongodb://127.0.0.1:27017/nodejs_practices';
}

mongoose.connect(mongoUri).then(() => {
  console.log('[console] Connected to MongoDB');
  console.log('[console] Loaded models:', Object.keys(global.models).join(', '));
  console.log('Examples:');
  console.log('  const newProduct = await Product.create({ name: "Sample Product", price: 9.99 });');
  console.log('  const products = await Product.find();');
  console.log('  const users = await User.find();');
}).catch((error) => {
  console.error('[console] MongoDB connection error:', error.message);
});