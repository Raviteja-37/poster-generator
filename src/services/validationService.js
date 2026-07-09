function validateRequest(body) {
  const required = ['template', 'headline', 'subtitle'];

  for (const field of required) {
    if (
      body[field] === undefined ||
      body[field] === null ||
      String(body[field]).trim() === ''
    ) {
      return {
        valid: false,
        message: `${field} is required`,
      };
    }
  }

  return {
    valid: true,
  };
}

module.exports = {
  validateRequest,
};
