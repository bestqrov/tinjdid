import { LoggerService, LogLevel } from '@nestjs/common'

export class CustomLogger implements LoggerService {
    private stripAnsi(text: string): string {
        // Remove ANSI escape codes
        return text.replace(/\x1B\[[0-9;]*m/g, '')
    }

    log(message: any, ...optionalParams: any[]) {
        console.log(this.stripAnsi(String(message)), ...optionalParams)
    }

    error(message: any, ...optionalParams: any[]) {
        console.error(this.stripAnsi(String(message)), ...optionalParams)
    }

    warn(message: any, ...optionalParams: any[]) {
        console.warn(this.stripAnsi(String(message)), ...optionalParams)
    }

    debug(message: any, ...optionalParams: any[]) {
        console.debug(this.stripAnsi(String(message)), ...optionalParams)
    }

    verbose(message: any, ...optionalParams: any[]) {
        console.log(this.stripAnsi(String(message)), ...optionalParams)
    }
}
