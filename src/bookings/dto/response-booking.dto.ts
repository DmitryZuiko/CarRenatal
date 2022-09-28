import { ApiProperty } from '@nestjs/swagger';

export class ResponseBookingDto {
  @ApiProperty()
  id: number;

  @ApiProperty({
    type: Date
  })
  startedat: string;

  @ApiProperty({
    type: Date,
  })
  endedat: string;

  @ApiProperty()
  carid: string;

  @ApiProperty()
  userid: string;

  @ApiProperty()
  cost: number;
}