const client = require('@sendgrid/client');
client.setApiKey(global.sendGridAPIKey);

export default async function (batchID: string) {
  const body = {
    batch_id: batchID,
    status: 'cancel',
  };

  const request = {
    url: '/v3/user/scheduled_sends',
    method: 'POST',
    body,
  };

  return await client
    .request(request)
    .then(async (response: any) => {
      return response[0].body;
    })
    .catch(async (error: any) => {
      console.error('Batch error:', error);
    });
}
