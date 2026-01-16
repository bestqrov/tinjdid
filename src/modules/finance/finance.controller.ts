import { Controller, Get, Param, Post, Query, Req, Res, Body, UseGuards, HttpCode } from '@nestjs/common'
import { FinanceService } from './finance.service'
import { JwtGuard } from '../../common/guards/jwt.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { CompanyGuard } from '../../common/guards/company.guard'
import { Roles } from '../../common/decorators/roles.decorator'

@Controller('finance')
@UseGuards(JwtGuard, RolesGuard, CompanyGuard)
export class FinanceController {
  constructor(private svc: FinanceService) { }

  @Get('quotes/:id/pdf')
  @Roles('ADMIN', 'STAFF')
  async quotePdf(@Param('id') id: string, @Res() res) {
    const buf = await this.svc.generateQuotePdfBuffer(id)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="devis-${id}.pdf"`)
    res.send(buf)
  }

  @Get('invoices/:id/pdf')
  @Roles('ADMIN', 'STAFF')
  async invoicePdf(@Param('id') id: string, @Res() res) {
    const buf = await this.svc.generateInvoicePdfBuffer(id)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="facture-${id}.pdf"`)
    res.send(buf)
  }

  @Post('charges')
  @Roles('ADMIN', 'STAFF')
  createCharge(@Req() req, @Query('companyId') companyId: string, @Body() body: import('../charges/dto/create-charge.dto').CreateChargeDto) {
    const finalCompanyId = companyId || req.user.companyId
    return this.svc.createCharge(finalCompanyId.toString(), body)
  }

  @Post('quotes/:id/convert')
  @Roles('ADMIN', 'STAFF')
  convertQuote(@Param('id') id: string, @Body() body: { markAccepted?: boolean }, @Req() req) {
    return this.svc.convertQuoteToInvoice(id, { markAccepted: body?.markAccepted })
  }

  @Get('/dashboard/stats')
  @Roles('ADMIN', 'STAFF', 'DRIVER')
  async stats(@Req() req, @Query('companyId') companyId: string, @Query('start') start?: string, @Query('end') end?: string) {
    const finalCompanyId = companyId || req.user.companyId
    const s = start ? new Date(start) : undefined
    const e = end ? new Date(end) : undefined
    return this.svc.getDashboardStats(finalCompanyId.toString(), { start: s, end: e })
  }
}
