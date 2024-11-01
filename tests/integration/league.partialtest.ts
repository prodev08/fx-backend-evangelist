// eslint-disable-next-line node/no-extraneous-import
import {GraphQLClient} from 'graphql-request';
import {getSdk} from '../types/graphql';
import {League} from 'lib-mongoose';

const url = 'http://localhost:8080/graphql';
let api: ReturnType<typeof getSdk>;
let leagueObjectID: string;
let leagueSlug: string;
export {connection} from 'mongoose';

beforeAll(async () => {
  const client = new GraphQLClient(url);
  api = getSdk(client);
  leagueObjectID = (await League.find().exec())[0].id;
  leagueSlug = (await League.findById(leagueObjectID).exec())!.slug!;
});

export default () => {
  describe('2. Test Querying of League', () => {
    it('1. League can be queried by id', async () => {
      const {result} = await api.getLeague({
        id: leagueObjectID,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('2. League can be queried by slug', async () => {
      const {result} = await api.getLeague({
        slug: leagueSlug,
      });
      expect(result).not.toBeNull();
    }, 30000);
    it('3. Result should be null when neither id nor slug is provided', async () => {
      const {result} = await api.getLeague({
        id: null,
        slug: null,
      });
      expect(result).toBeNull();
    }, 30000);
    it('4. All league can be queried', async () => {
      const {result} = await api.getLeagues();
      expect(result).not.toBeNull();
      expect(result.total).toEqual(result?.items?.length);
    }, 30000);
  });
};
