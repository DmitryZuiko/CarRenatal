import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingHttpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'First day of booking; only weekdays',
    type: Date,
  })
  readonly startedAt: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: `Last day of booking; 
      only weekdays;
      no more than 30 days from the first day`,
    type: Date,
  })
  readonly endedAt: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'car id',
    type: String,
  })
  readonly carId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'user id',
    type: String,
  })
  readonly userId: string;
}
