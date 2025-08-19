import { compare, encrypt } from '../../utils/bcrypt'
import jwt from 'jsonwebtoken'
import { config } from '../../config'
import { prisma } from '../../config/database'

// Payload untuk JWT
interface JwtPayload {
  id: string
  role: string
}

// Register user baru
export const register = async ({ name, email, password }: { name: string; email: string; password: string }) => {
  // Cek user sudah ada
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw { status: 400, message: 'Email already in use' }
  }

  // Hash password
  const hashedPassword = await encrypt(password)

  // Simpan user baru
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'USER'
    }
  })

  // Jangan return password
  return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
}

// Login
export const login = async ({ email, password }: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw { status: 401, message: 'Invalid email or password' }
  }

  const isMatch = await compare(password, user.password)
  if (!isMatch) {
    throw { status: 401, message: 'Invalid email or password' }
  }

  const payload: JwtPayload = { id: user.id, role: user.role }

  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: parseInt(config.jwt.expiresIn)
  })

  const refreshToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: parseInt(config.jwt.refreshExpiresIn)
  })

  return { id: user.id, name: user.name, email: user.email, role: user.role, token, refreshToken }
}

// Refresh Token
export const refreshToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.secret) as JwtPayload

    const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, config.jwt.secret, {
      expiresIn: parseInt(config.jwt.expiresIn)
    })

    return { accessToken: newAccessToken }
  } catch {
    throw { status: 401, message: 'Invalid refresh token' }
  }
}
