import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateKeyDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsString()
  readonly passwordHint: string;
}
