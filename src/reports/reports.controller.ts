import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BookingsService } from '../bookings/bookings.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ResponseReportDto, ResponseAllReportsDto } from './dto/response-report.dto';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiQuery({ name: 'year' })
  @ApiQuery({ name: 'month' })
  @ApiResponse({
    status: 200,
    description: 'Statistics for each car for month',
    type: ResponseReportDto
  })
  @ApiResponse({ status: 404, description: 'There are no bookings for this period', })
  @Get()
  getEach(@Query() reportDto: CreateReportDto) {
    return this.bookingsService.getStatisticsForEachCarForMonth(
      reportDto.year,
      reportDto.month,
    );
  }

  @ApiQuery({ name: 'year' })
  @ApiQuery({ name: 'month' })
  @ApiResponse({
    status: 200,
    description: 'Statistics for all car for month',
    type: ResponseAllReportsDto
  })
  @ApiResponse({ status: 404, description: 'There are no bookings for this period', })
  @Get('/all')
  getAll(@Query() reportDto: CreateReportDto) {
    return this.bookingsService.getAllStatisticsForMonth(
      reportDto.year,
      reportDto.month,
    );
  }
}
