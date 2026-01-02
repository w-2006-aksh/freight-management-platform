function secondsUntilEndOfDay() {
  const now = new Date();
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return Math.ceil((end - now) / 1000);
}

module.exports = {secondsUntilEndOfDay};
