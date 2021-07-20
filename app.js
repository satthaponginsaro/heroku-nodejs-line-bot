require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const line = require('@line/bot-sdk');
const cors = require('cors');

const POST = process.env.POST || 3000;
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());


app.get('/', (req, res) => {    
    
    res.json({
      "data": "Hello Game"
    });
});


app.post('/api/v1/change-richmenu', (req, res) => {
  console.log(req.body);
  res.json({
      data: "hello"
    });
    // save data in db
    const { card_id, name, tel, userId } = req.body;
    // client.linkRichMenuToUser(userId, "richmenu-30eccf0fc2584916361b853a0187f71a");
    // res.json({
    //     data: req.body
    // });
    var msg = 'คุณได้ทำการลงทะเบียนเรียบร้อยแล้ว';
    var axios = require('axios');
    var data = JSON.stringify({
      "to": userId,
      "messages": [
        {
          "type": "text",
          "text": msg += ' \n' + 'เลขบัตรประชาชน: ' + card_id + '\n' + 'ชื่อ-สกุล: ' + name + '\n' + 'เบอร์โทรศัพท์: ' + tel +'\n' + 'รอข้อความยืนยันลำดับคิวอีกครั้งภายใน 3 วัน'
        }

        
      ]
    });

    var config = {
      method: 'post',
      url: 'https://api.line.me/v2/bot/message/push',
      headers: { 
        'Authorization': 'Bearer wTgLuD+RCTG/dIWAGnwDQR8orRlZA/PzCHrEPsbG4+83zcoObZMVFS6gFC3OYHFjLkAvubwEGvynE5u5ZVlvhYVNKJQ/IegYTLClB/T2ejPOpHhVMWMVG6Y7CTitNZAVlLiTVzTu0xDrJOji/1wNxQdB04t89/1O/w1cDnyilFU=', 
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });

});

app.post('/callback', line.middleware(config), (req, res) => {
  Promise
  .all(req.body.events.map(hendleEvent))
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
      console.log(err);
  })
});

function hendleEvent(event) {
  if(event.type !== 'message' || event.messages.type !== "text") {
    return Promise.resolve(null);
  }
  else if(event.messages.type === "text" || event.messages.text === "ตรวจสอบคิว") {
    const payload = {
      type : "text",
      text : "กรุณาระบุเลขบัตรประชาชน"
    }

    return client.replyMessage(event.replyToken, payload);
  }
}


app.listen(POST, () => {
    console.log(`Ready on port ${POST}`);
});