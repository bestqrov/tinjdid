
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking for admin@demo.com...')
    const user = await prisma.user.findUnique({ where: { email: 'admin@demo.com' } })

    if (!user) {
        console.log('User admin@demo.com NOT FOUND.')
    } else {
        console.log('User FOUND:', user.email, 'Role:', user.role)
        const valid = await bcrypt.compare('password', user.password)
        console.log('Password "password" is valid:', valid)
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
