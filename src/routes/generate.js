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

router.get('/debug/:template', (req, res) => {
  try {
    const sampleData = {
      template: req.params.template,
      headline: 'Quantum Chip Design is Too Slow',
      subtitle: 'AI is changing engineering workflows',
      badge: { text: 'INDUSTRY', type: 'primary' },
      stats: [
        { value: '540 Days', label: 'Average Design Cycle' },
        { value: '$2M+', label: 'Fabrication Cost' },
      ],
      sections: [
        {
          type: 'insight',
          title: '💡 Insight',
          content:
            "Today's chip development requires hundreds of manual iterations.",
        },
      ],
      quote: {
        text: 'Innovation begins with better engineering tools.',
        author: 'SilicoFeller',
      },
      footer: 'SilicoFeller • AI for Superconducting Chip Design',
    };

    const html = generateHTML(sampleData);
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
