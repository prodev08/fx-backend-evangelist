import {Logs} from 'lib-mongoose';

const client = require('@sendgrid/client');

export default async function (): Promise<{batch_id: string}> {
  console.log('Setting API Key here:', global.sendGridAPIKey);
  client.setApiKey(global.sendGridAPIKey);

  const request = {
    url: '/v3/mail/batch',
    method: 'POST',
  };

  return await client
    .request(request)
    .then(async (response: any) => {
      return response[0].body;
    })
    .catch(async (error: any) => {
      console.error('Batch error:', error);
      await Logs.create({
        type: 'Batch error',
        logs: error.message,
      });
    });
}
