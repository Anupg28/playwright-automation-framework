function uniqueUsername(prefix = 'qa_user') {
  return `${prefix}_${Date.now()}`;
}

function strongPassword() {
  return 'Test@12345';
}

module.exports = { uniqueUsername, strongPassword };
