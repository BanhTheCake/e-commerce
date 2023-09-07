import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({})
export class DatabaseModule {
  public static forRoot(
    entities: TypeOrmModuleOptions['entities'],
  ): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            return {
              type: 'postgres',
              host: configService.getOrThrow<string>('POSTGRES_HOST'),
              port: configService.getOrThrow<number>('POSTGRES_PORT'),
              username: configService.getOrThrow<string>('POSTGRES_USER'),
              password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
              database: configService.getOrThrow<string>('POSTGRES_DB'),
              entities: entities,
              synchronize: true,
            };
          },
          inject: [ConfigService],
        }),
      ],
    };
  }

  public static forFeature(entities: EntityClassOrSchema[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [TypeOrmModule.forFeature(entities)],
      exports: [TypeOrmModule],
    };
  }
}
