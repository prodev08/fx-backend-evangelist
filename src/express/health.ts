import {Express} from 'express';
import {League} from 'lib-mongoose';

export default function (app: Express) {
  app.get('/health', async (req: any, res: any) => {
    try {
      await League.countDocuments();
    } catch (e) {
      console.log('health check error', e);
      res.status(500).json(false);
    }
    res.status(200).json(true);
  });
}
