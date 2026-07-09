const express = require('express');

const router = express.Router();

const { generateHTML } = require('../services/posterService');

const { renderHTML } = require('../services/renderService');

const { validateRequest } = require('../services/validationService');

router.post('/', async (req, res) => {
  try {
    const validation = validateRequest(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,

        error: validation.message,
      });
    }
    const html = generateHTML(req.body);

    const image = await renderHTML(html);

    res.setHeader('Content-Type', 'image/png');
    const fs = require('fs');

    fs.writeFileSync('output/test.png', image);
    res.send(image);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
