const cleansingRules = {
    // General Text Cleaning
    trim: (value) => value.trim(),
    removeSpaces: (value) => value.replace(/\s+/g, ' '),
    capitalizeWords: (value) => value.replace(/\b\w/g, (char) => char.toUpperCase()),
  
    // Email Cleaning
    emailFix: (value) => value.replace('.comm', '.com').replace('.gmaill.', '.gmail.'),
    lowercaseEmail: (value) => value.toLowerCase(),
  
    // Phone Number Cleaning
    phoneFormat: (value) =>
      value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'),
  
    // Date and Time Cleaning
    standardizeDate: (value) => {
      const date = new Date(value);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toISOString().split('T')[0];
    },
  
    // State/Region Cleaning
    stateStandardize: (value) => {
      const stateMap = {
        'NSW': 'New South Wales',
        'N.S.W.': 'New South Wales',
        'Vic': 'Victoria',
        'VIC': 'Victoria',
      };
      return stateMap[value] || value;
    },
  
    // Numerical Data Cleaning
    numericOnly: (value) => value.replace(/[^0-9.]/g, ''),
    roundToTwoDecimals: (value) => parseFloat(value).toFixed(2),
  
    // Missing Value Handling
    replaceMissing: (value, defaultValue = 'N/A') => value || defaultValue,
  };
  
  // Export the library of rules
  module.exports = cleansingRules;
  