import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';
import * as request from 'supertest';

import { BidModule } from '../src/model/bid/bid.module';
import { MongoModule } from '../src/providers/database/mongo.module';
import { BidTestModule } from './interface/bid.interface';
import { TestModule } from './utils/test.module';
import { TestService } from './utils/test.service';

describe('BidController', () => {
  let testModule: BidTestModule;
  const userId = new ObjectId();
  const email = 'test@test.com';

  const generateJwt = () => {
    return testModule.jwtService.sign(
      { sub: userId, email },
      { privateKey: process.env.AUTH_PRIVATE_KEY, algorithm: 'RS256' },
    );
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        MongoModule,
        BidModule,
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
  });

  describe('/bid endpoint', () => {
    describe('POST /bid', () => {
      it('should return 401 if token is not provided', async () => {
        const { status } = await request(testModule.app.getHttpServer()).post('/bid').send({});

        expect(status).toBe(401);
      });

      it('should return 400 if item id is not provided', async () => {
        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/bid')
          .set('Authorization', `Bearer ${generateJwt()}`)
          .send({
            price: 1,
          });

        expect(status).toBe(400);
        expect(body.message).toEqual(['item_id must be a string', 'item_id should not be empty']);
      });

      it('should return 400 if price is not provided', async () => {
        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/bid')
          .set('Authorization', `Bearer ${generateJwt()}`)
          .send({
            item_id: '123',
          });

        expect(status).toBe(400);
        expect(body.message).toEqual([
          'price must be a number conforming to the specified constraints',
          'price should not be empty',
        ]);
      });

      it('should return 400 if price is not a number', async () => {
        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/bid')
          .set('Authorization', `Bearer ${generateJwt()}`)
          .send({
            item_id: '123',
            price: 'test',
          });

        expect(status).toBe(400);
        expect(body.message).toEqual(['price must be a number conforming to the specified constraints']);
      });

      it('should return 400 when item is not found', async () => {
        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/bid')
          .set('Authorization', `Bearer ${generateJwt()}`)
          .send({
            item_id: String(new ObjectId()),
            price: 1,
          });

        expect(status).toBe(400);
        expect(body.message).toEqual('Item not found');
      });

      it('should return 400 when item is not published', async () => {
        const item = await testModule.testService.createItem({
          name: 'test',
          price: 1,
          status: 'draft',
          bid_time: 1,
          time_window: DateTime.now().plus({ hours: 1 }).toJSDate(),
          user_id: String(userId),
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/bid')
          .set('Authorization', `Bearer ${generateJwt()}`)
          .send({
            item_id: String(item._id),
            price: 1,
          });

        expect(status).toBe(400);
        expect(body.message).toEqual('Item is not published');
      });

      it('should return 400 when item is already closed', async () => {
        const item = await testModule.testService.createItem({
          name: 'test',
          price: 1,
          status: 'published',
          bid_time: 1,
          time_window: DateTime.now().minus({ hours: 1 }).toJSDate(),
          user_id: String(userId),
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/bid')
          .set('Authorization', `Bearer ${generateJwt()}`)
          .send({
            item_id: String(item._id),
            price: 1,
          });

        expect(status).toBe(400);
        expect(body.message).toEqual('Item is already closed');
      });

      it('should return 400 when bid price must be higher than the item price', async () => {
        const item = await testModule.testService.createItem({
          name: 'test',
          price: 1,
          status: 'published',
          bid_time: 1,
          time_window: DateTime.now().plus({ hours: 1 }).toJSDate(),
          user_id: String(userId),
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/bid')
          .set('Authorization', `Bearer ${generateJwt()}`)
          .send({
            item_id: String(item._id),
            price: 0.5,
          });

        expect(status).toBe(400);
        expect(body.message).toEqual('Bid price must be higher than the item price');
      });

      it('should return 400 when bid price must be higher than the last bid price', async () => {
        const item = await testModule.testService.createItem({
          name: 'test',
          price: 1,
          status: 'published',
          bid_time: 1,
          time_window: DateTime.now().plus({ hours: 1 }).toJSDate(),
          user_id: String(userId),
        });

        await testModule.testService.createBid({
          item_id: String(item._id),
          user_id: String(userId),
          price: 3,
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/bid')
          .set('Authorization', `Bearer ${generateJwt()}`)
          .send({
            item_id: String(item._id),
            price: 2,
          });

        expect(status).toBe(400);
        expect(body.message).toEqual('Bid price must be higher than the last bid');
      });

      it('should return 400 when bidding before the last bid time', async () => {
        const item = await testModule.testService.createItem({
          name: 'test',
          price: 1,
          status: 'published',
          bid_time: 1,
          time_window: DateTime.now().plus({ hours: 1 }).toJSDate(),
          user_id: String(userId),
        });

        await testModule.testService.createBid({
          item_id: String(item._id),
          user_id: String(userId),
          price: 3,
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/bid')
          .set('Authorization', `Bearer ${generateJwt()}`)
          .send({
            item_id: String(item._id),
            price: 4,
          });

        expect(status).toBe(400);
        expect(body.message).toEqual('You can only bid once every 5 seconds');
      });

      it('should return 400 when user does not have enough balance', async () => {
        const item = await testModule.testService.createItem({
          name: 'test',
          price: 1,
          status: 'published',
          bid_time: 1,
          time_window: DateTime.now().plus({ hours: 1 }).toJSDate(),
          user_id: String(userId),
        });

        await testModule.testService.createWallet({
          user_id: String(userId),
          balance: 0,
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/bid')
          .set('Authorization', `Bearer ${generateJwt()}`)
          .send({
            item_id: String(item._id),
            price: 2,
          });

        expect(status).toBe(400);
        expect(body.message).toEqual('Insufficient balance');
      });

      it('should return 201 if bid is created', async () => {
        const item = await testModule.testService.createItem({
          name: 'test',
          price: 1,
          status: 'published',
          bid_time: 1,
          time_window: DateTime.now().plus({ hours: 1 }).toJSDate(),
          user_id: String(userId),
        });

        await testModule.testService.createWallet({
          user_id: String(userId),
          balance: 10,
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .post('/bid')
          .set('Authorization', `Bearer ${generateJwt()}`)
          .send({
            item_id: String(item._id),
            price: 2,
          });

        expect(status).toBe(201);
        expect(body.message).toEqual('Bid item in process');
      });
    });

    describe('GET /bid/item/:itemId', () => {
      it('should return 401 when user is not authenticated', async () => {
        const { status, body } = await request(testModule.app.getHttpServer()).get(
          '/bid/item/5f9f3e7a1d8a7a1f0c6d2c7c',
        );

        expect(status).toBe(401);
        expect(body.message).toEqual('Unauthorized');
      });

      it('should return 404 when item is not found', async () => {
        await testModule.testService.createUser({
          email,
          password: 'passwod1',
          name: 'test',
          _id: String(userId),
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .get('/bid/item/5f9f3e7a1d8a7a1f0c6d2c7c')
          .set('Authorization', `Bearer ${generateJwt()}`);

        expect(status).toBe(404);
        expect(body.message).toEqual('Item not found');
      });

      it('should return 200 when item is found', async () => {
        const user = await testModule.testService.createUser({
          email,
          password: 'passwod1',
          name: 'test',
          _id: String(userId),
        });

        const item = await testModule.testService.createItem({
          name: 'test',
          price: 1,
          status: 'published',
          bid_time: 1,
          time_window: DateTime.now().plus({ hours: 1 }).toJSDate(),
          user_id: String(userId),
        });

        const bid = await testModule.testService.createBid({
          item_id: String(item._id),
          user_id: String(userId),
          price: 3,
        });

        const { status, body } = await request(testModule.app.getHttpServer())
          .get(`/bid/item/${item._id}`)
          .set('Authorization', `Bearer ${generateJwt()}`);

        expect(status).toBe(200);
        expect(body).toEqual([
          {
            _id: String(bid._id),
            price: bid.price,
            name: user.name,
            sold: false,
            user_id: String(userId),
          },
        ]);
      });
    });
  });
});
