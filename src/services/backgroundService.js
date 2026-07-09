const fs = require('fs');
const path = require('path');

// Stores the last background used per template
const lastUsedBackground = {};

function getRandomBackground(template = 'industry') {
  const folder = path.join(__dirname, '../../assets/backgrounds', template);

  try {
    const images = fs
      .readdirSync(folder)
      .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file));

    if (images.length === 0) {
      throw new Error('No background images found.');
    }

    // If there's only one image, use it
    if (images.length === 1) {
      lastUsedBackground[template] = images[0];

      return `${template}/${images[0]}`;
    }

    let availableImages = images;

    // Remove the previously used background
    if (lastUsedBackground[template]) {
      availableImages = images.filter(
        (img) => img !== lastUsedBackground[template],
      );
    }

    const randomImage =
      availableImages[Math.floor(Math.random() * availableImages.length)];

    lastUsedBackground[template] = randomImage;

    return `${template}/${randomImage}`;
  } catch (err) {
    console.warn(err.message);

    return 'industry/bg1.jpg';
  }
}

module.exports = {
  getRandomBackground,
};
