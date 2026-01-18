import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { join } from 'path'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    let url = process.env.DATABASE_URL

    // Auto-fix for MongoDB Atlas empty database name issue
    if (url && (url.includes('mongodb.net/?') || url.endsWith('mongodb.net/'))) {
      console.warn('⚠️ Detected missing database name in connection string. Auto-fixing...')
      url = url.replace('mongodb.net/', 'mongodb.net/arwapark')
    }

    super({
      datasources: {
        db: {
          url,
        },
      },
    })
  }

  async onModuleInit() {
    try {
      await this.$connect()
      console.log('Database connected successfully')
    } catch (error) {
      console.error('Failed to connect to database:', error.message)
      console.warn('Application will continue without database connection')
    }
  }
}
