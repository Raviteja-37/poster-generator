const express = require('express');
const crypto = require('crypto');

const router = express.Router();

const { generateHTML } = require('../services/posterService');
const { renderHTML } = require('../services/renderService');
const { validateRequest } = require('../services/validationService');

// short-lived in-memory handoff: Playwright navigates to a real URL
// instead of using page.setContent(), which fixes external stylesheet
// loading (setContent gives the page a null/opaque origin).
const pending = new Map();
const TTL_MS = 30_000;

router.post('/', async (req, res) => {
  try {
    const validation = validateRequest(req.body);
    if (!validation.valid) {
      return res
        .status(400)
        .json({ success: false, error: validation.message });
    }

    const id = crypto.randomUUID();
    pending.set(id, req.body);
    setTimeout(() => pending.delete(id), TTL_MS);

    const baseUrl =
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const renderUrl = `${baseUrl}/generate/render/${id}`;

    const image = await renderHTML(renderUrl);
    pending.delete(id);

    res.setHeader('Content-Type', 'image/png');
    return res.send(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// internal route — Playwright navigates here directly, so the page has
// a real https:// origin and stylesheets/fonts load normally.
router.get('/render/:id', (req, res) => {
  const data = pending.get(req.params.id);
  if (!data) {
    return res.status(404).send('Not found or expired');
  }
  const html = generateHTML(data);
  res.setHeader('Content-Type', 'text/html');
  return res.send(html);
});

// keep your existing debug route as-is, it's still useful
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
