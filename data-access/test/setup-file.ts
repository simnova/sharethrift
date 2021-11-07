import { connect, disconnect } from '../infrastructure/data-sources/cosmos-db/connect';

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await disconnect();
});