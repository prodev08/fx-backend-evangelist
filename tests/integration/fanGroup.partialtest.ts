// eslint-disable-next-line node/no-extraneous-import
import {GraphQLClient} from 'graphql-request';
import {getSdk} from '../types/graphql';
import {FanGroup} from 'lib-mongoose';

const url = 'http://localhost:8080/graphql';
let api: ReturnType<typeof getSdk>;
let fanGroupObjectID: string;
let fanGroupSlug: string;
export {connection} from 'mongoose';

beforeAll(async () => {
  const client = new GraphQLClient(url);
  api = getSdk(client);
  fanGroupObjectID = (await FanGroup.find().exec())[0].id;
  fanGroupSlug = (await FanGroup.findById(fanGroupObjectID).exec())!.slug!;
});

export default () => {
  describe('6. Test Querying of FanGroup', () => {
    it('1. FanGroup can be queried by id', async () => {
      const {result} = await api.getFanGroup({
        id: fanGroupObjectID,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('2. FanGroup can be queried by slug', async () => {
      const {result} = await api.getFanGroup({
        slug: fanGroupSlug,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('3. Result should be null when neither id nor slug is provided', async () => {
      const {result} = await api.getFanGroup({
        id: null,
        slug: null,
      });
      expect(result).toBeNull();
    }, 30000);
    it('4. All fanGroup can be queried', async () => {
      const {result} = await api.getFanGroups();
      expect(result).not.toBeNull();
      expect(result.total).toEqual(result?.items?.length);
    }, 30000);
  });
};
