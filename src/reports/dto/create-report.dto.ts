import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateReportDto {
  @IsNumberString()
  @IsNotEmpty()
  readonly year: string;
  @IsNumberString()
  @IsNotEmpty()
  readonly month: string;
}
