import { ApiProperty } from '@nestjs/swagger';

export class ResponseReportDto {
  @ApiProperty()
  message: [string];
}

export class ResponseAllReportsDto {
  @ApiProperty({
    default: 'Cars - ?%'
  })
  message: string;
}