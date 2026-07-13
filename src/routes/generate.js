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

    if (req.query.debug === 'html') {
      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    }

    const image = await renderHTML(html);

    res.setHeader('Content-Type', 'image/png');
    return res.send(image);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
