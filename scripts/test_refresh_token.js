const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

async function main() {
  const userId = '76a56c3f-3483-4987-97b8-6d8b4444d857'
  const payload = { sub: userId, email: 'admin@demo.com', role: 'ADMIN', companyId: 'aafaed4e-74f7-4216-96d4-10798d2d587f' }
  const refresh = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'refreshchangeme', { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' })
  const expiresAt = new Date(Date.now() + (parseInt(process.env.JWT_REFRESH_EXPIRES_MS || String(7 * 24 * 60 * 60 * 1000))))
  try {
    const r = await prisma.refreshToken.create({ data: { token: refresh, userId, expiresAt } })
    console.log('Created refresh token:', r)
  } catch (e) {
    console.error('Error creating refresh token:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
