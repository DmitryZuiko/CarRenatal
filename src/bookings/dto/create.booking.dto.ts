export class CreateBookingDto {
  readonly startedAt: Date;
  readonly endedAt: Date;
  readonly carId: string;
  readonly userId: string;
}
