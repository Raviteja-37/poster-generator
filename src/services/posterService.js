const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { getRandomBackground } = require('./backgroundService');

function generateHTML(data) {
  const templatePath = path.join(
    __dirname,
    '../templates',
    `${data.template}.hbs`,
  );

  const template = fs.readFileSync(templatePath, 'utf8');

  const compile = Handlebars.compile(template);
  const { getRandomBackground } = require('./backgroundService');

  const renderData = {
    ...data,

    baseUrl: process.env.BASE_URL,

    background: getRandomBackground(data.template),
  };
  console.log('Selected Background:', renderData.background);

  return compile(renderData);
}

module.exports = {
  generateHTML,
};
