import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse()
    const status = exception instanceof HttpException ? exception.getStatus() : 500
    const message = exception.message || 'Internal server error'
    res.status(status).json({ message })
  }
}
