import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import * as request from 'supertest';

import { ItemModule } from '../src/model/item/item.module';
import { WalletModule } from '../src/model/wallet/wallet.module';
import { MongoModule } from '../src/provider/database/mongo.module';
import { ItemTestModule } from './interface/item.interface';
import { TestModule } from './utils/test.module';
import { TestService } from './utils/test.service';

describe('ItemController', () => {
  let testModule: ItemTestModule;
  const userId = new ObjectId();
  const email = 'test@test.com';

  const generateJwt = () => {
    return testModule.jwtService.sign(
      { sub: userId, email },
      { privateKey: process.env.AUTH_PRIVATE_KEY, algorithm: 'RS256' },
    );
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        MongoModule,
        ItemModule,
        WalletModule,
        PassportModule,
        TestModule,
      ],
    }).compile();

    const app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        transform: true,
      }),
    );

    await app.init();

    testModule = {
      app,
      testService: moduleRef.get<TestService>(TestService),
      jwtService: moduleRef.get<JwtService>(JwtService),
    };
  });

  afterEach(async () => {
    await testModule.testService.clearDatabase();
    await testModule.app.close();
  });

  describe('/item endpoint', () => {
    describe('POST /item', () => {
      it('should return 401 if token is not provided', async () => {
        const { status } = await request(testModule.app.getHttpServer()).post('/item').send({});

        expect(status).toBe(401);
      });

      it('should return 400 if name is not provided', async () => {
        const token = generateJwt();

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/item')
          .set('Authorization', `Bearer ${token}`)
          .send({
            price: 1,
            bid_time: 2,
            status: 'draft',
          });

        expect(status).toBe(400);
        expect(body.message).toEqual(['name must be a string', 'name should not be empty']);
      });

      it('should return 400 if price is not provided', async () => {
        const token = generateJwt();

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/item')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'name',
            bid_time: 2,
            status: 'draft',
          });

        expect(status).toBe(400);
        expect(body.message).toEqual([
          'price must not be less than 1',
          'price must be a number conforming to the specified constraints',
          'price should not be empty',
        ]);
      });

      it('should return 400 if price is less than 1', async () => {
        const token = generateJwt();

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/item')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'name',
            price: 0,
            bid_time: 2,
            status: 'draft',
          });

        expect(status).toBe(400);
        expect(body.message).toEqual(['price must not be less than 1']);
      });

      it('should return 400 if bid_time is not provided', async () => {
        const token = generateJwt();

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/item')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'name',
            price: 1,
            status: 'draft',
          });

        expect(status).toBe(400);
        expect(body.message).toEqual([
          'bid_time must not be less than 1',
          'bid_time must be a number conforming to the specified constraints',
          'bid_time should not be empty',
        ]);
      });

      it('should return 400 if bid_time is less than 1', async () => {
        const token = generateJwt();

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/item')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'name',
            price: 1,
            bid_time: 0,
            status: 'draft',
          });

        expect(status).toBe(400);
        expect(body.message).toEqual(['bid_time must not be less than 1']);
      });

      it('should return 400 if status is not provided', async () => {
        const token = generateJwt();

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/item')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'name',
            price: 1,
            bid_time: 1,
          });

        expect(status).toBe(400);
        expect(body.message).toEqual([
          'status must be one of the following values: draft, published, completed',
          'status should not be empty',
        ]);
      });

      it('should return 400 if status is not string', async () => {
        const token = generateJwt();

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/item')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'name',
            price: 1,
            bid_time: 1,
            status: 2,
          });

        expect(status).toBe(400);
        expect(body.message).toEqual(['status must be one of the following values: draft, published, completed']);
      });

      it('should return 400 if draft is not either draft or published', async () => {
        const token = generateJwt();

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/item')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'name',
            price: 1,
            bid_time: 1,
            status: 'sample',
          });

        expect(status).toBe(400);
        expect(body.message).toEqual(['status must be one of the following values: draft, published, completed']);
      });

      it('should return 201 if item is created', async () => {
        const token = generateJwt();

        const { status } = await request(testModule.app.getHttpServer())
          .post('/item')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'name',
            price: 1,
            bid_time: 1,
            status: 'draft',
          });

        expect(status).toBe(201);
      });
    });

    describe('PUT /item/:itemId', () => {
      it('should return 401 if token is not provided', async () => {
        const { status } = await request(testModule.app.getHttpServer()).put('/item/1').send({});

        expect(status).toBe(401);
      });

      it('should return 400 if status is not provided', async () => {
        const token = generateJwt();

        const item = await testModule.testService.createItem({
          name: 'name',
          user_id: String(userId),
          price: 1,
          bid_time: 1,
          status: 'draft',
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .put(`/item/${String(item._id)}`)
          .set('Authorization', `Bearer ${token}`)
          .send({});

        expect(status).toBe(400);
        expect(body.message).toEqual([
          'status must be one of the following values: draft, published, completed',
          'status should not be empty',
        ]);
      });

      it('should return 201 if item is updated', async () => {
        const token = generateJwt();

        const item = await testModule.testService.createItem({
          name: 'name',
          user_id: String(userId),
          price: 1,
          bid_time: 1,
          status: 'draft',
        });

        const { status } = await request(testModule.app.getHttpServer())
          .put(`/item/${String(item._id)}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            status: 'published',
          });

        expect(status).toBe(200);
      });
    });

    describe('GET /item', () => {
      it('should return 401 if token is not provided', async () => {
        const { status } = await request(testModule.app.getHttpServer()).get('/item');

        expect(status).toBe(401);
      });

      it('should return 200 if items are fetched', async () => {
        const token = generateJwt();

        const item = await testModule.testService.createItem({
          name: 'name',
          user_id: String(userId),
          price: 1,
          bid_time: 1,
          status: 'draft',
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .get('/item')
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200);
        expect(body).toEqual([
          {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: mongoose types
            __v: 0,
            _id: String(item._id),
            name: item.name,
            price: item.price,
            status: item.status,
            user_id: item.user_id,
            bid_time: item.bid_time,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
          },
        ]);
      });
    });

    describe('GET /item/published', () => {
      it('should return 401 if token is not provided', async () => {
        const { status } = await request(testModule.app.getHttpServer()).get('/item/published');

        expect(status).toBe(401);
      });

      it('should return 200 if items are fetched', async () => {
        const token = generateJwt();

        const item = await testModule.testService.createItem({
          name: 'name',
          user_id: String(new ObjectId()),
          price: 1,
          bid_time: 1,
          status: 'published',
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .get('/item/published')
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200);
        expect(body).toEqual([
          {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: mongoose types
            __v: 0,
            _id: String(item._id),
            name: item.name,
            price: item.price,
            status: item.status,
            user_id: item.user_id,
            bid_time: item.bid_time,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
          },
        ]);
      });
    });

    describe('GET /item/completed', () => {
      it('should return 401 if token is not provided', async () => {
        const { status } = await request(testModule.app.getHttpServer()).get('/item/completed');

        expect(status).toBe(401);
      });

      it('should return 200 if items are fetched', async () => {
        const token = generateJwt();

        const item = await testModule.testService.createItem({
          name: 'name',
          user_id: String(new ObjectId()),
          price: 1,
          bid_time: 1,
          status: 'completed',
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .get('/item/completed')
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200);
        expect(body).toEqual([
          {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: mongoose types
            __v: 0,
            _id: String(item._id),
            name: item.name,
            price: item.price,
            status: item.status,
            user_id: item.user_id,
            bid_time: item.bid_time,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
          },
        ]);
      });
    });

    describe('GET /item/:itemId', () => {
      it('should return 401 if token is not provided', async () => {
        const { status } = await request(testModule.app.getHttpServer()).get('/item/1');

        expect(status).toBe(401);
      });

      it('should return 200 if item is fetched', async () => {
        const token = generateJwt();

        const item = await testModule.testService.createItem({
          name: 'name',
          user_id: String(new ObjectId()),
          price: 1,
          bid_time: 1,
          status: 'completed',
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .get(`/item/${String(item._id)}`)
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200);
        expect(body).toEqual({
          _id: String(item._id),
          name: item.name,
          price: item.price,
          status: item.status,
          current_bid_amount: 0,
        });
      });
    });
  });
});

describe('WalletController', () => {
  let testModule: ItemTestModule;
  const userId = new ObjectId();
  const email = 'test@test.com';

  const generateJwt = () => {
    return testModule.jwtService.sign(
      { sub: userId, email },
      { privateKey: process.env.AUTH_PRIVATE_KEY, algorithm: 'RS256' },
    );
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        MongoModule,
        ItemModule,
        WalletModule,
        PassportModule,
        TestModule,
      ],
    }).compile();

    const app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        transform: true,
      }),
    );

    await app.init();

    testModule = {
      app,
      testService: moduleRef.get<TestService>(TestService),
      jwtService: moduleRef.get<JwtService>(JwtService),
    };
  });

  afterEach(async () => {
    await testModule.testService.clearDatabase();
    await testModule.app.close();
  });

  describe('/wallet endpoint', () => {
    describe('GET /wallet', () => {
      it('should return 401 if token is not provided', async () => {
        const { status } = await request(testModule.app.getHttpServer()).get('/wallet');

        expect(status).toBe(401);
      });

      it('should return 200 if wallet is fetched', async () => {
        const token = generateJwt();

        const wallet = await testModule.testService.createWallet({
          user_id: String(userId),
          balance: 100,
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .get('/wallet')
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(200);
        expect(body).toEqual({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: mongoose types
          __v: 0,
          _id: String(wallet._id),
          user_id: wallet.user_id,
          balance: wallet.balance,
          createdAt: wallet.createdAt.toISOString(),
          updatedAt: wallet.updatedAt.toISOString(),
        });
      });
    });

    describe('PUT /wallet/:walletId/balance', () => {
      it('should return 401 if token is not provided', async () => {
        const { status } = await request(testModule.app.getHttpServer()).put('/wallet/1/balance');

        expect(status).toBe(401);
      });

      it('should return 400 if balance is not provided', async () => {
        const token = generateJwt();

        const wallet = await testModule.testService.createWallet({
          user_id: String(userId),
          balance: 100,
        });

        const { status } = await request(testModule.app.getHttpServer())
          .put(`/wallet/${String(wallet._id)}/balance`)
          .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(400);
      });

      it('should return 200 if balance is updated', async () => {
        const token = generateJwt();

        const wallet = await testModule.testService.createWallet({
          user_id: String(userId),
          balance: 100,
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .put(`/wallet/${String(wallet._id)}/balance`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            balance: 200,
          });

        expect(status).toBe(200);
        expect(body).toEqual({ balance: 300 });
      });
    });
  });
});
