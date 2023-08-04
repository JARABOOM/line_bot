const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

// กำหนด port ที่ Vercel ให้ใช้
const port = process.env.PORT || 3000;

// Middleware เพื่อ parse body ที่ส่งมาจาก LINE
app.use(bodyParser.json());

// เพิ่ม LINE Channel Access Token และ Channel Secret ของคุณที่นี่
const channelAccessToken = 'HLpLP0BAjBljAMh5ApFaSJAMlbB0eGEv57WoMFGyGustSinJL6o02HZU+2C8jMdL1ZKOgPUnvYPguuPJ5pjeIPa/LVr/JZPUOcVqlkKbXZdevBtbklDB4Rrkg+WEqPFHfgzvGQZpeGspQCbBYPK5KAdB04t89/1O/w1cDnyilFU=';
const channelSecret = '8945b42f1b86bea748e544945320b2f4';

// เมื่อมีการเรียก webhook จาก LINE
app.post('/webhook', (req, res) => {
  const { events } = req.body;

  // ตรวจสอบว่ามีข้อมูลที่ต้องการหรือไม่
  if (events && events.length > 0) {
    events.forEach(event => {
      // ตรวจสอบข้อความที่ถูกส่งมา
      if (event.type === 'message' && event.message.type === 'text') {
        const messageText = event.message.text;
        
        // เช็คว่าข้อความเป็น "ขอยอดขาย" หรือไม่
        if (messageText === 'ขอยอดขาย') {
          // ส่งลิ้งรูปในการตอบกลับ
          const imageUrl = 'https://jaraboom.online/Sale.jpeg';
          const replyToken = event.replyToken;
          replyWithImage(replyToken, imageUrl);
        }
      }
    });
  }

  res.status(200).end();
});

// Function สำหรับส่งลิ้งรูปกลับไปยัง LINE
function replyWithImage(replyToken, imageUrl) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${channelAccessToken}`
  };
  const data = {
    replyToken,
    messages: [
      {
        type: 'image',
        originalContentUrl: imageUrl,
        previewImageUrl: imageUrl
      }
    ]
  };
  axios.post('https://api.line.me/v2/bot/message/reply', data, { headers })
    .then(response => {
      console.log('Reply success:', response.data);
    })
    .catch(error => {
      console.error('Reply error:', error);
    });
}

// รัน server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
