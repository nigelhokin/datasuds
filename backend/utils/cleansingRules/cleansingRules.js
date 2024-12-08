const textRules = require('./textRules');
const emailRules = require('./emailRules');
const phoneRules = require('./phoneRules');

// Combine all rules into a single object
const cleansingRules = {
  ...textRules,
  ...emailRules,
  ...phoneRules,
};

// Export all combined rules
module.exports = cleansingRules;
