import { PartialType } from '@nestjs/swagger';
import { CreateKeyDto } from './create-key.dto';

export class UpdateKeyDto extends PartialType(CreateKeyDto) {
  // password is optional, need not send it as it can't be updated
}
