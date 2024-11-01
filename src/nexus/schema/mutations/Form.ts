import {mutationField, nonNull} from 'nexus';
import {FormEntry, User} from 'lib-mongoose';
import {assert, enums} from 'superstruct';
import {MutationResult} from 'lib-api-common';
import sendTemplatedEmail, {defaultSender} from '../../../app/email/sendTemplatedEmail';
import {UserInputError} from 'apollo-server-express';

export const forms: any = {
  RegisterInterest: {subject: 'Register Interest'},
  Inquiry: {subject: 'FX1 | General Inquiry', recipients: defaultSender, sender: defaultSender},
  ReportMessage: {subject: 'FX1 | Reported Message', recipients: defaultSender, sender: defaultSender},
};

export async function implementation(type: string, data?: any) {
  assert(type, enums(Object.keys(forms)));
  let formEntry;

  switch (type) {
    case 'RegisterInterest': {
      data.email = data.email.toLowerCase();
      const email = data.email;
      const exists = await FormEntry.findOne({type: 'RegisterInterest', 'data.email': email}).exec();
      if (exists) {
        formEntry = exists;
      } else {
        formEntry = await FormEntry.create({
          type,
          data,
          actor: null,
          userID: null,
        });
      }
      break;
    }
    case 'Inquiry': {
      data.email = data.email.toLowerCase();
      formEntry = await FormEntry.create({
        type,
        data,
        actor: null,
        userID: null,
      });
      await sendTemplatedEmail('createFormEntry-Inquiry', {
        ...forms[type],
        replyTo: data.email,
        data,
      });
      break;
    }
    case 'ReportMessage': {
      // sample: 6308ab4da570d8dd5ab6224j
      if (!data.reporterUserID) {
        throw new UserInputError("Reporter's ID is required");
      }
      // sample: 6308ab4da570d8dd5ab6224j
      if (!data.violatorUserID) {
        throw new UserInputError("Violator's ID is required");
      }
      // sample: 3DB8793K-4A0B-4304-A450-6240D0325M0C
      if (!data.messageID) {
        throw new UserInputError('Message ID is required');
      }
      // actual message being reported
      if (!data.message) {
        throw new UserInputError('Message is required');
      }
      // reason why user reported the message
      if (!data.reason) {
        throw new UserInputError('Reason is required');
      }
      const reporter = await User.findById(data.reporterUserID).exec();
      const violator = await User.findById(data.violatorUserID).exec();
      data.reporterEmail = reporter?.emailAddress;
      data.violatorEmail = violator?.emailAddress;
      data.reporterUserName = reporter?.username;
      data.violatorUserName = violator?.username;
      formEntry = await FormEntry.create({
        type,
        data,
        actor: `User:${data.reporterUserID}`,
        userID: data.reporterUserID,
      });
      await sendTemplatedEmail('createFormEntry-ReportMessage', {
        ...forms[type],
        replyTo: data.reporterEmail,
        data,
      });
      break;
    }
    default:
      break;
  }

  return formEntry;
}

export const FormMutations = mutationField(t => {
  t.nonNull.field('registerInterest', {
    type: 'MutationResult',
    deprecation: "Use createFormEntry with type 'RegisterInterest' instead",
    args: {
      type: nonNull('String'),
      data: 'JSON',
    },
    resolve: async (source, {type, data}) => {
      const formEntry = await implementation(type, data);
      return new MutationResult('FormEntry', formEntry?.id);
    },
  });
  t.nonNull.field('createFormEntry', {
    type: 'MutationResult',
    args: {
      type: nonNull('String'),
      data: 'JSON',
    },
    resolve: async (source, {type, data}) => {
      const formEntry = await implementation(type, data);
      return new MutationResult('FormEntry', formEntry?.id);
    },
  });
});
