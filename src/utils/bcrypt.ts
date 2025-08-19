import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

/**
 * Hash a plain text password using bcrypt.
 * @param {string} password - Plain text password.
 * @returns {Promise<string>} - Hashed password.
 */
export const encrypt = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Compare a plain text password with a hashed one.
 * @param {string} password - Plain text password.
 * @param {string} hash - Hashed password from database.
 * @returns {Promise<boolean>} - True if match, otherwise false.
 */
export const compare = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash)
}
