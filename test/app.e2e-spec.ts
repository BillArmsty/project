import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('E2E: User Authentication & Journal Entries', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let userId: string;
  let journalEntryId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    // Apply validation pipes to simulate production behavior
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    await app.init();

    // Cleanup DB before running tests
    await prisma.journalEntry.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * 🟢 Step 1: User Registration & Authentication
   */
  it('should register a new user', async () => {
    const payload = {
      query: `
        mutation {
          register(registerInput: { email: "test@example.com", password: "Test@123" }) {
            access_token
            user { id email }
          }
        }
      `,
    };

    console.log('🔴 Sending Request:', JSON.stringify(payload, null, 2));

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send(payload);

    console.log(
      '🔴 Register Response:',
      JSON.stringify(response.body, null, 2),
    );

    expect(response.status).toBe(200);
    expect(response.body.data.register).toHaveProperty('access_token');
  });

  it('should login the registered user', async () => {
    const payload = {
      query: `
        mutation {
          login(loginInput: { email: "test@example.com", password: "Test@123" }) {
            access_token
          }
        }
      `,
    };

    console.log('🔴 Sending Login Request:', JSON.stringify(payload, null, 2));

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send(payload);

    console.log('🔴 Login Response:', JSON.stringify(response.body, null, 2));

    expect(response.status).toBe(200);
    expect(response.body.data.login).toHaveProperty('access_token');

    accessToken = response.body.data.login.access_token;
  });

  /**
   * 🟢 Step 2: Journal Entry CRUD Operations
   */
  it('should create a journal entry', async () => {
    const payload = {
      query: `
        mutation {
          createJournalEntry(data: { title: "My First Entry", content: "Hello world!", category: PERSONAL }) {
            id
            title
          }
        }
      `,
    };

    console.log(
      '🔴 Sending Create Entry Request:',
      JSON.stringify(payload, null, 2),
    );

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(payload);

    console.log(
      '🔴 Create Entry Response:',
      JSON.stringify(response.body, null, 2),
    );

    expect(response.status).toBe(200);
    expect(response.body.data.createJournalEntry).toHaveProperty('id');

    journalEntryId = response.body.data.createJournalEntry.id;
  });

  it('should retrieve journal entries', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `
          query {
            getJournalEntries {
              id
              title
              content
              category
            }
          }
        `,
      });

    console.log(
      '🔴 Retrieve Journal Entries Response:',
      JSON.stringify(response.body, null, 2),
    );

    expect(response.status).toBe(200);
    expect(response.body.data.getJournalEntries.length).toBeGreaterThan(0);
  });

  it('should delete a journal entry', async () => {
    if (!journalEntryId) {
      throw new Error(
        '❌ No journal entry to delete! Ensure `journalEntryId` is set.',
      );
    }

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `
          mutation {
            deleteJournalEntry(id: "${journalEntryId}")
          }
        `,
      });

    console.log(
      '🔴 Delete Journal Entry Response:',
      JSON.stringify(response.body, null, 2),
    );

    expect(response.status).toBe(200);
    expect(response.body.data.deleteJournalEntry).toBe(true);
  });

  /**
   * 🟢 Step 3: Data Analytics Queries
   */
  it('should retrieve journal heatmap data', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `
          query {
            getJournalHeatmap {
              date
              count
            }
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.getJournalHeatmap)).toBe(true);
  });

  it('should retrieve category distribution data', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `
          query {
            getCategoryDistribution {
              category
              count
            }
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.getCategoryDistribution)).toBe(
      true,
    );
  });

  it('should retrieve word trends', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `
          query {
            getWordTrends {
              word
              count
            }
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.getWordTrends)).toBe(true);
  });
});
