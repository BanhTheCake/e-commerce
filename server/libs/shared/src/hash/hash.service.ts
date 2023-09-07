import { Injectable, Inject } from '@nestjs/common';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { HASH_OPTIONS } from './hash.constant';
import { HashOptions } from './hash.interface';

@Injectable()
export class HashService {
  constructor(@Inject(HASH_OPTIONS) private options: HashOptions) {}
  async hash(password: string) {
    const salt = randomBytes(this.options.saltLength).toString('hex');
    const hashValue = await argon2.hash(password, { salt: Buffer.from(salt) });
    return [hashValue, salt].join(this.options.joinWith);
  }

  async verify(password: string, hashValue: string) {
    const [hash, salt] = hashValue.split(this.options.joinWith);
    if (!hash || !salt) {
      throw new Error('Invalid hash value');
    }
    return await argon2.verify(hash, password, { salt: Buffer.from(salt) });
  }
}
