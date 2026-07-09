const express = require('express');
const path = require('path');
const Handlebars = require('handlebars');
const generateRoute = require('./routes/generate');

const app = express();

Handlebars.registerHelper('eq', (a, b) => a === b);

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'awake',
    timestamp: new Date().toISOString(),
  });
});

// Static files
app.get('/', (req, res) => {
  res.json({
    service: 'SilicoFeller Poster Engine',
    version: '1.0.0',
    status: 'running',
  });
});
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));

app.use('/generate', generateRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Poster Generator running on http://localhost:${PORT}`);
});
