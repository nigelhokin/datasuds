// Email Cleaning Rules

// Fix common email typos
const emailFix = (value) =>
    value.replace('.comm', '.com').replace('.gmaill.', '.gmail.');
  
  // Convert email to lowercase
  const lowercaseEmail = (value) => value.toLowerCase();
  
  // Export email rules
  module.exports = {
    emailFix,
    lowercaseEmail,
  };
  