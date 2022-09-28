import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateBookingHttpDto } from './dto/create-booking-http.dto';
import { BookingsService } from './bookings.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseBookingDto } from './dto/response-booking.dto';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateBookingHttpDto })
  @ApiResponse({
    status: 200,
    description: 'Create new booking',
    type: ResponseBookingDto
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  createBooking(@Body() bookingDto: CreateBookingHttpDto) {
    return this.bookingsService.createBooking({
      startedAt: new Date(bookingDto.startedAt),
      endedAt: new Date(bookingDto.endedAt),
      carId: bookingDto.carId,
      userId: bookingDto.userId,
    });
  }
}
