import { ApiProperty } from '@nestjs/swagger';

export class BookingEntity {
  @ApiProperty({
    description: 'First day of booking; only weekdays',
    type: Date,
  })
  readonly startedAt: Date;

  @ApiProperty({
    description: `Last day of booking; 
      only weekdays;
      no more than 30 days from the first day`,
    type: Date,
  })
  readonly endedAt: Date;

  @ApiProperty({
    description: 'cost of booking',
    type: Number,
  })
  readonly cost: number;

  @ApiProperty({
    description: 'car id',
    type: String,
  })
  readonly carId: string;

  @ApiProperty({
    description: 'user id',
    type: String,
  })
  readonly userId: string;
}
