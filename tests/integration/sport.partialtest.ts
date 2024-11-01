// eslint-disable-next-line node/no-extraneous-import
import {GraphQLClient} from 'graphql-request';
import {getSdk} from '../types/graphql';
import globalSetup from '../utilities/globalSetup';
import {Sport} from 'lib-mongoose';

const url = 'http://localhost:8080/graphql';
let api: ReturnType<typeof getSdk>;
let sportObjectID: string;
let sportSlug: string;
export {connection} from 'mongoose';

beforeAll(async () => {
  await globalSetup();
  const client = new GraphQLClient(url);
  api = getSdk(client);
  sportObjectID = (await Sport.find().exec())[0].id;
  sportSlug = (await Sport.findById(sportObjectID).exec())!.slug!;
});

export default () => {
  describe('1. Test Querying of Sport', () => {
    it('1. Sport can be queried by id', async () => {
      const {result} = await api.getSport({
        id: sportObjectID,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('2. Sport can be queried by slug', async () => {
      const {result} = await api.getSport({
        slug: sportSlug,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('3. Result should be null when neither id nor slug is provided', async () => {
      const {result} = await api.getSport({
        id: null,
        slug: null,
      });
      expect(result).toBeNull();
    }, 30000);
    it('4. All sport can be queried', async () => {
      const {result} = await api.getSports();
      expect(result).not.toBeNull();
      expect(result.total).toEqual(result?.items?.length);
    }, 30000);
  });
};
