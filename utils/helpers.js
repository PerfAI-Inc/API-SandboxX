/**
 * Generates a random ID (6-digit number as string)
 * @returns {string} Random ID
 */
function generateRandomId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generates random data of specified size
 * @param {number} size - Number of items to generate
 * @returns {Array} Array of random data objects
 */
function generateRandomData(size) {
  const data = [];
  for (let i = 0; i < size; i++) {
    data.push({
      id: i,
      value: Math.random().toString(36).substring(2, 15),
      number: Math.floor(Math.random() * 1000),
    });
  }
  return data;
}

module.exports = {
  generateRandomId,
  generateRandomData,
};
