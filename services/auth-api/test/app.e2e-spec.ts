import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AuthModule } from '../src/model/auth/auth.module';
import { MongoModule } from '../src/providers/database/mongo.module';
import { AuthTestModule } from './interface/auth.interface';
import { TestModule } from './utils/test.module';
import { TestService } from './utils/test.service';

describe('AuthController', () => {
  let testModule: AuthTestModule;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        MongoModule,
        AuthModule,
        TestModule,
      ],
    }).compile();

    const app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      }),
    );

    await app.init();

    testModule = {
      app,
      testService: moduleRef.get<TestService>(TestService),
    };
  });

  afterEach(async () => {
    await testModule.testService.clearDatabase();
    await testModule.app.close();
  });

  describe('/auth endpoint', () => {
    describe('POST /auth/login', () => {
      it('should return 401 if email is not provided', async () => {
        const { status } = await request(testModule.app.getHttpServer()).post('/auth/login').send({
          password: 'password',
        });

        expect(status).toBe(401);
      });

      it('should return 401 if password is not provided', async () => {
        const { status } = await request(testModule.app.getHttpServer()).post('/auth/login').send({
          email: 'email',
        });

        expect(status).toBe(401);
      });

      it('should return 200 if email and password are provided', async () => {
        await testModule.testService.createUser({
          email: 'email@email.com',
          password: 'password',
        });

        const { status, body } = await request(testModule.app.getHttpServer()).post('/auth/login').send({
          email: 'email@email.com',
          password: 'password',
        });

        expect(status).toBe(201);
        expect(body.access_token).toBeDefined();
      });
    });

    describe('POST /auth/register', () => {
      it('should return 400 if email is not provided', async () => {
        const { status } = await request(testModule.app.getHttpServer()).post('/auth/register').send({
          password: 'password',
          name: 'test',
        });

        expect(status).toBe(400);
      });

      it('should return 400 if email is not valid', async () => {
        const { status } = await request(testModule.app.getHttpServer()).post('/auth/register').send({
          email: 'email',
          password: 'password',
          name: 'test',
        });

        expect(status).toBe(400);
      });

      it('should return 400 if password is not provided', async () => {
        const { status } = await request(testModule.app.getHttpServer()).post('/auth/register').send({
          email: 'email',
          name: 'test',
        });

        expect(status).toBe(400);
      });

      it('should return 400 if name is not provided', async () => {
        const { status } = await request(testModule.app.getHttpServer()).post('/auth/register').send({
          email: 'email',
          password: 'password',
        });

        expect(status).toBe(400);
      });

      it('should return 400 if email is duplicate', async () => {
        await testModule.testService.createUser({
          email: 'email@email.com',
          password: 'password',
        });

        const { status } = await request(testModule.app.getHttpServer()).post('/auth/register').send({
          email: 'email@email.com',
          password: 'password',
          name: 'test',
        });

        expect(status).toBe(400);
      });

      it('should return 201 if email and password are provided', async () => {
        const { status, body } = await request(testModule.app.getHttpServer()).post('/auth/register').send({
          email: 'email@test.com',
          password: 'password',
          name: 'test',
        });

        expect(status).toBe(201);
        expect(body.message).toEqual('User created successfully');
      });
    });
  });
});
