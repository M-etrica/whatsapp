import axios from 'axios';
import Pino from 'pino';
import {
  SendCredentialsInput,
  SendDocumentsInput,
  SendFinalInput,
  SendMeetingHRInput,
  SendMessageInput,
  SendTemplateMessageInput,
  sendTemplateMessageSchema,
} from './whatsapp.dto';

const pino = Pino();

const FROM_PHONE_NUMBER_ID = '117739507987450';

async function sendMessage(record: SendMessageInput) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${FROM_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: record.to.phone,
        type: 'text',
        text: {
          preview_url: false,
          body: `Hola ${record.to.name}! ${record.message}.`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (err) {
    pino.error(err, err instanceof Error ? err.message : err);
  }
}

async function sendMeetingHR(record: SendMeetingHRInput) {
  return sendMessageTemplate({
    to: record.to,
    template: 'meeting_hr',
    components: [
      {
        type: 'body',
        parameters: [
          {
            type: 'text',
            text: `${record.firstName} ${record.lastName}`,
          },
        ],
      },
    ],
  });
}

async function sendCredentials(record: SendCredentialsInput) {
  return sendMessageTemplate({
    to: record.to,
    template: 'credenciales_2',
    components: [
      {
        type: 'body',
        parameters: [
          {
            type: 'text',
            text: `${record.firstName} ${record.lastName}`,
          },
          {
            type: 'text',
            text: record.email,
          },
          {
            type: 'text',
            text: record.password,
          },
        ],
      },
    ],
  });
}

async function sendDocuments(record: SendDocumentsInput) {
  return sendMessageTemplate({
    to: record.to,
    template: 'documents',
    components: [
      {
        type: 'body',
        parameters: [
          {
            type: 'text',
            text: `${record.firstName} ${record.lastName}`,
          },
          {
            type: 'text',
            text: record.link,
          },
        ],
      },
    ],
  });
}

async function sendFinal(record: SendFinalInput) {
  return sendMessageTemplate({
    to: record.to,
    template: 'final',
    components: [
      {
        type: 'text',
        text: `${record.firstName} ${record.lastName}`,
      },
      {
        type: 'text',
        text: record.link,
      },
    ],
  });
}

async function templateMessageDispatcher(record: sendTemplateMessageSchema) {
  console.log(record);
  if (record.template === 'meeting_hr') {
    return sendMeetingHR(record);
  }
  if (record.template === 'credentials') {
    return sendCredentials(record);
  }
  if (record.template === 'documents') {
    return sendDocuments(record);
  }
  if (record.template === 'final') {
    return sendFinal(record);
  }
  return {
    message: 'ERR',
  };
}

async function sendMessageTemplate(record: SendTemplateMessageInput) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${FROM_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: record.to,
        type: 'template',
        template: {
          name: record.template,
          components: record.components,
          language: {
            code: 'es',
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (err) {
    pino.error(err, err instanceof Error ? err.message : err);
  }
}
async function webhook(record: Record<string, any>) {
  //! Modificar el codigo
  await sendMessage({
    to: {
      name: record.entry[0].changes[0].value.contacts[0].profile.name,
      phone: record.entry[0].changes[0].value.contacts[0].wa_id,
    },
    message: 'Hola! Soy un bot informativo, no puede responder a este mensaje.',
  });
  return record;
}

function registerWebhook(record: Record<string, any>) {
  const { TOKEN } = process.env;
  const mode = record['hub.mode'];
  const challenge = record['hub.challenge'];
  const verifyToken = record['hub.verify_token'];
  if (mode !== 'subscribe' || verifyToken !== TOKEN) {
    throw new Error(
      'Failed validation. Make sure the validation tokens match.'
    );
  }
  return challenge;
}

export default {
  sendMessage,
  sendMessageTemplate,
  webhook,
  registerWebhook,
  templateMessageDispatcher,
};
