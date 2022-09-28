import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingHttpDto {
  @ApiProperty({
    description: 'First day of booking; only weekdays',
    type: Date,
  })
  readonly startedAt: string;

  @ApiProperty({
    description: `Last day of booking; 
      only weekdays;
      no more than 30 days from the first day`,
    type: Date,
  })
  readonly endedAt: string;

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
