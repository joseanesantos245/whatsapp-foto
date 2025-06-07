const express = require('express');
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

const app = express();

const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  authStrategy: new (require('whatsapp-web.js').LocalAuth)()
});

client.on('qr', (qr) => {
  console.log('⚠️ Escaneie este QR Code com o WhatsApp:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Conectado ao WhatsApp!');
});

app.get('/foto', async (req, res) => {
  const numero = req.query.numero;
  if (!numero) return res.send('Número não informado');

  const id = `${numero}@c.us`;

  try {
    const foto = await client.getProfilePicUrl(id);
    res.send(`<img src="${foto}" width="200" style="border-radius: 10px;" />`);
  } catch {
    res.send('Número inválido ou sem foto pública');
  }
});

client.initialize();

app.listen(3000, () => {
  console.log('🚀 API rodando em http://localhost:3000/foto?numero=5583XXXXXXX');
});
