import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateBookingHttpDto } from './dto/create-booking-http.dto';
import { BookingsService } from './bookings.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateBookingHttpDto })
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
