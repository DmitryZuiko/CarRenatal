import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { BookingsService } from '../bookings/bookings.service';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  getEach(@Query() reportDto: CreateReportDto) {
    return this.bookingsService.getStatisticsForEachCarForMonth(
      reportDto.year,
      reportDto.month,
    );
  }

  @Get('/all')
  getAll(@Query() reportDto: CreateReportDto) {
    return this.bookingsService.getAllStatisticsForMonth(
      reportDto.year,
      reportDto.month,
    );
  }
}
