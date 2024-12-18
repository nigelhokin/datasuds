// General Text Cleaning Rules

// Remove extra whitespace from the string
const trim = (value) => value.trim();

// Replace multiple spaces with a single space
const removeSpaces = (value) => value.replace(/\s+/g, ' ');

// Capitalize the first letter of each word
const capitalizeWords = (value) => value.replace(/\b\w/g, (char) => char.toUpperCase());

//Capitalise all letters in the string
const upperCase = (value) => value.toUpperCase();

//Force lower case
const lowerCase = (value) => value.toLowerCase();

// Export text rules
module.exports = {
  trim,
  removeSpaces,
  capitalizeWords,
  upperCase,
  lowerCase,
};
