import { Injectable } from '@nestjs/common';

import { generateKeyPair } from 'crypto';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';

@Injectable()
export class KeysService {
  private createKeyPair(config: CreateKeyDto): Promise<{
    publicKey: string;
    privateKey: string;
  }> {
    return new Promise((resolve, rejects) =>
      generateKeyPair(
        'rsa',
        {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: config.password,
          },
        },
        (err, publicKey, privateKey) => {
          if (err) {
            rejects(err);
          } else {
            console.log({
              publicKey,
              privateKey,
            });
            resolve({
              publicKey,
              privateKey,
            });
          }
        },
      ),
    );
  }

  async create(createKeyDto: CreateKeyDto) {
    try {
      const key = await this.createKeyPair(createKeyDto);

      return key;
    } catch (e) {
      return e.message;
    }
  }

  findAll(userName: string) {
    return `This action returns all keys`;
  }

  update(id: string, updateKeyDto: UpdateKeyDto) {
    return `This action updates a #${id} key`;
  }

  remove(id: string) {
    return `This action removes a #${id} key`;
  }
}
