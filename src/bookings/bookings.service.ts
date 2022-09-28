import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create.booking.dto';
import { BookingsRepository } from './bookings.repository';
import _ = require('lodash');

@Injectable()
export class BookingsService {
  constructor(private readonly bookingsRepository: BookingsRepository) {}

  daysBetween(startDate: Date, endDate: Date) {
    return Math.ceil(
      Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
    );
  }

  calculateCost(rentalPeriod: number, rate: number) {
    let cost = 0;

    if (rentalPeriod <= 4) {
      for (let i = 0; i < rentalPeriod; i++) {
        cost += rate;
      }
    } else if (rentalPeriod <= 9) {
      for (let i = 0; i < 4; i++) {
        cost += rate;
      }
      for (let i = 4; i < rentalPeriod; i++) {
        cost += rate - (rate / 100) * 5;
      }
    } else if (rentalPeriod <= 17) {
      for (let i = 0; i < 4; i++) {
        cost += rate;
      }
      for (let i = 4; i < 9; i++) {
        cost += rate - (rate / 100) * 5;
      }
      for (let i = 9; i < rentalPeriod; i++) {
        cost += rate - (rate / 100) * 10;
      }
    } else {
      for (let i = 0; i < 4; i++) {
        cost += rate;
      }
      for (let i = 4; i < 9; i++) {
        cost += rate - (rate / 100) * 5;
      }
      for (let i = 9; i < 17; i++) {
        cost += rate - (rate / 100) * 10;
      }
      for (let i = 17; i < rentalPeriod; i++) {
        cost += rate - (rate / 100) * 15;
      }
    }
    return cost;
  }

  getStatisticFromBookings(bookingsForMonth, firstDay, lastDay) {
    if (bookingsForMonth.length === 0)
      throw new HttpException(
        { error: `There are no bookings for this period` },
        400,
      );

    const periods = bookingsForMonth.map((item) => {
      let period = 0;
      if (item.startedat >= firstDay && item.endedat <= lastDay) {
        period = this.daysBetween(item.startedat, item.endedat);
      }
      if (item.startedat < firstDay) {
        period = this.daysBetween(firstDay, item.endedat);
      }
      if (item.endedat > lastDay) {
        period = this.daysBetween(item.startedat, lastDay);
      }

      return period;
    });

    const numberOfCars = Object.keys(
      _.chain(bookingsForMonth).groupBy('carid').value(),
    ).length;

    const sumOfPeriods = periods.reduce((acc, period) => {
      return acc + period;
    }, 0);

    return `Cars - ${(
      (sumOfPeriods / numberOfCars / this.daysBetween(firstDay, lastDay)) *
      100
    ).toFixed(2)}%`;
  }

  async getStatisticsForEachCarForMonth(year, month) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const bookingsForMonth = await this.bookingsRepository.find({
      startAtGte: firstDay,
      startAtLte: lastDay,
      $or: {
        endAtGte: firstDay,
        endAtLte: lastDay,
      },
    });

    if (bookingsForMonth.length === 0)
      return new HttpException(
        { message: `There are no bookings for this period`, code: 400 },
        400,
      );

    const result = _.chain(bookingsForMonth)
      .groupBy('carid')
      .map((item) => {
        let period = 0;
        for (let i = 0; i < item.length; i++) {
          if (item[i].startedat >= firstDay && item[i].endedat <= lastDay) {
            period += this.daysBetween(item[i].startedat, item[i].endedat);
          }
          if (item[i].startedat < firstDay) {
            period += this.daysBetween(firstDay, item[i].endedat);
          }
          if (item[i].endedat > lastDay) {
            period += this.daysBetween(item[i].startedat, lastDay);
          }
        }
        return `Car ${item[0].carid} - ${(
          (period / this.daysBetween(firstDay, lastDay)) *
          100
        ).toFixed(2)}%`;
      })
      .value();

    return { message: result, code: HttpCode(HttpStatus.OK) };
  }

  async getAllStatisticsForMonth(year, month) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const bookingsForMonth = await this.bookingsRepository.find({
      startAtGte: firstDay,
      startAtLte: lastDay,
      $or: {
        endAtGte: firstDay,
        endAtLte: lastDay,
      },
    });

    return this.getStatisticFromBookings(bookingsForMonth, firstDay, lastDay);
  }

  async createBooking(bookingDto: CreateBookingDto) {
    const rate = 1000;

    const bookingsAffectBeginning = await this.bookingsRepository.find({
      startAtGte: bookingDto.startedAt,
      startAtLte: new Date(
        bookingDto.endedAt.getTime() + 3 * 24 * 60 * 60 * 1000,
      ),
      carId: bookingDto.carId,
    });

    const bookingsAffectTheEnd = await this.bookingsRepository.find({
      endAtGte: new Date(
        bookingDto.startedAt.getTime() - 4 * 24 * 60 * 60 * 1000,
      ),
      endAtLte: bookingDto.endedAt,
      carId: bookingDto.carId,
    });

    const bookingsAffectAllPeriod = await this.bookingsRepository.find({
      startAtLte: bookingDto.startedAt,
      endAtGte: bookingDto.endedAt,
      carId: bookingDto.carId,
    });

    if (
      bookingsAffectBeginning.length !== 0 ||
      bookingsAffectTheEnd.length !== 0 ||
      bookingsAffectAllPeriod.length !== 0
    )
      throw new HttpException(
        { error: `Wrong dates, car is busy in this period` },
        400,
      );

    if (
      bookingDto.startedAt.getDay() == 6 ||
      bookingDto.startedAt.getDay() == 0
    )
      return 'The start of the car rental cannot fall on a day off';
    if (bookingDto.endedAt.getDay() == 6 || bookingDto.endedAt.getDay() == 0)
      return 'The end of the car rental cannot fall on a day off';

    const rentalPeriod = this.daysBetween(
      bookingDto.startedAt,
      bookingDto.endedAt,
    );

    if (rentalPeriod > 30) return 'The maximum rental period is 30 days.';

    return await this.bookingsRepository.create({
      ...bookingDto,
      cost: this.calculateCost(rentalPeriod, rate)
    });
  }
}
