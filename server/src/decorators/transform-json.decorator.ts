import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';

export const TransformJson = () => {
  return Transform(({ value, key }) => {
    console.log(value, key);
    try {
      const a = JSON.parse(value);
      console.log('AAAAAAAAAAAA: ', a);
      return JSON.parse(value);
    } catch (error) {
      throw new BadRequestException(`${key}: ${value} is not a valid json`);
    }
  });
};
