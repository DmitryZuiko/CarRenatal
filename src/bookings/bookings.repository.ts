import { Injectable, Query } from '@nestjs/common';
import { BookingEntity } from './entities/booking.entity';
import db from '../db';

interface Query {
  startAtGte?: Date;
  startAtLte?: Date;
  endAtGte?: Date;
  endAtLte?: Date;
  carId?: string;
  $or?: Query;
}

@Injectable()
export class BookingsRepository {

  private _compare(query, item) {
    if (Object.keys(query).length === 0) {
      return false;
    }
    let result = true;
    if (query.carId && item.carid !== query.carId) {
      result = false;
    }
    if (query.startAtGte && !(query.startAtGte <= item.startedat)) {
      result = false;
    }
    if (query.startAtLte && !(query.startAtLte >= item.startedat)) {
      result = false;
    }
    if (query.endAtGte && !(query.endAtGte <= item.endedat)) {
      result = false;
    }
    if (query.endAtLte && !(query.endAtLte >= item.endedat)) {
      result = false;
    }
    if (query.$or) {
      return result || this._compare(query.$or, item);
    }
    return result;
  }

  async create(booking: BookingEntity) {
    const newBooking = await db.query(
      `INSERT INTO booking (startedAt, endedAt, carId, userId, cost) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [booking.startedAt, booking.endedAt, booking.carId, booking.userId, booking.cost]);
    return newBooking.rows[0];
  }

  async find(query: Query) {
    const bookings = await db.query(`SELECT * FROM booking`);
    return bookings.rows.filter((item) => {
      return this._compare(query, item);
    });
  }
}
