import { IsString } from 'class-validator';
import { ActiveToken } from '../validators/active-token.validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActiveDto {
  @ApiProperty({
    description: 'Token',
    example:
      '7a32ce64-eb9b-4b83-8f97-453987c421b5.41b5e796bc4677d2dcfbbba4c1de47ece36516fc00f74166367df960f7b2b1ce',
  })
  @ActiveToken()
  @IsString()
  token: string;
}
