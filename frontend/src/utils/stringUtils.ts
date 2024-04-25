function validateUsername(username: string) {
  const usernameRegex = /^[A-Za-z][A-Za-z0-9]{7,29}$/
  return usernameRegex.test(username)
}

function validateName(name: string) {
  return name && name.length >= 1 && name.length <= 40
}

function validatePassword(password: string) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%])[a-zA-Z\d@!#$%]{10,40}$/
  return passwordRegex.test(password)
}

function formatPriceNumber(value: any): string {
  if (!isNaN(Number(value))) {
    return Number(value).toFixed(2)
  }
  return "-------"
}

export { validateUsername, validateName, validatePassword, formatPriceNumber }
