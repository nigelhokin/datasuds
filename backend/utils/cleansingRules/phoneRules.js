// Phone Number Cleaning Rules

// Format phone numbers to a standard format
const phoneFormat = (value) =>
    value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  
  // Export phone rules
  module.exports = {
    phoneFormat,
  };
  