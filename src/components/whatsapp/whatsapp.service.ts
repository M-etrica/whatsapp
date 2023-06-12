import axios from 'axios';
import Pino from 'pino';
import { SendMessageInput, SendTemplateMessageInput } from './whatsapp.dto';

const pino = Pino();

async function sendMessage(record: SendMessageInput) {
  try {
    const FROM_PHONE_NUMBER_ID = '108956085493524';
    const response = await axios.post(
      `https://graph.facebook.com/v16.0/${FROM_PHONE_NUMBER_ID}/messages`,
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

async function sendMessageTemplate(record: SendTemplateMessageInput) {
  try {
    const FROM_PHONE_NUMBER_ID = '108956085493524';
    const response = await axios.post(
      `https://graph.facebook.com/v16.0/${FROM_PHONE_NUMBER_ID}/messages`,
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
    message: 'Por este momento soy un bot de prueba, pero pronto estaré listo.',
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
};
