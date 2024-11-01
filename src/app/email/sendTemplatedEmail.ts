import {readFileSync} from 'fs';
import {resolve} from 'path';
import handlebars from 'handlebars';
import {Logs} from 'lib-mongoose';
const sgMail = require('@sendgrid/mail');

export type SendTemplatedEmailProps = {
  subject: string;
  sender: string;
  recipients: string[];
  replyTo?: string;
  data?: object;
  sendAt?: number;
  batchID?: string;
};

const templateIDs = {
  inviteUserWithManagerialRoleWithLink: 'd-d7962587c5734b28820aaa554e0fbb00',
  inviteUserWithManagerialRoleWithoutLink: 'd-4309d4e4dab443b7a7bb44c0cfb8051b',
  'createFormEntry-Inquiry': 'd-3f05debddd7547ecae3a8de27b0f5de4',
  'createFormEntry-ReportMessage': 'd-b2f4350914454373bfcc158319a22559',
  promotionOwnerNotification: 'd-85a7f633a35942c0b5881d0279ec5d68',
  removeOwnerNotification: 'd-c973c07bf1b5423f8e1d8979593ca152',
  removeManagerNotification: 'd-99a64099a2494ab4aa297172e5d824d6',
  gameReminder: 'd-ad00dcb22c1b46469c2ab73fd13ef8f8',
};
export const defaultSender = 'FX1 <hello@fx1.io>';
export const defaultSenderEmail = 'hello@fx1.io';

export default async function (
  type: string,
  {subject, recipients, sender, replyTo, data, sendAt, batchID}: SendTemplatedEmailProps
) {
  let msg;
  sgMail.setApiKey(global.sendGridAPIKey);
  if (
    type !== 'inviteUserWithManagerialRoleWithLink' &&
    type !== 'inviteUserWithManagerialRoleWithoutLink' &&
    type !== 'createFormEntry-Inquiry' &&
    type !== 'createFormEntry-ReportMessage' &&
    type !== 'promotionOwnerNotification' &&
    type !== 'removeOwnerNotification' &&
    type !== 'removeManagerNotification' &&
    type !== 'gameReminder'
  ) {
    const emailTemplateSource = readFileSync(resolve(__dirname, `../email/templates/${type}.hbs`), 'utf8');
    const template = handlebars.compile(emailTemplateSource);
    const html = template(data);

    msg = {
      to: recipients,
      from: sender,
      replyTo,
      subject,
      html,
    };
  } else {
    msg = {
      to: recipients,
      from: sender,
      replyTo,
      subject,
      templateId: templateIDs[type],
      dynamicTemplateData: data,
      sendAt,
      batchId: batchID,
    };
    console.log(msg);
  }

  let logs;
  await sgMail
    .send(msg)
    .then(async (result: any) => {
      console.log(`Email sent/scheduled ${type}`);
      logs = {
        responseCode: result[0].statusCode,
        responseMessage: '',
        requestHeader: result[0].headers,
        status: 'successful',
        sender: defaultSenderEmail,
        recipient: recipients,
      };
    })
    .catch(async (error: any) => {
      console.error('Email error:', error);
      logs = {
        responseCode: error.code,
        responseMessage: error.message,
        requestHeader: error.response.headers,
        status: 'failed',
        sender: defaultSenderEmail,
        recipient: recipients,
      };
    });
  await Logs.create({
    type,
    logs,
  });
}
