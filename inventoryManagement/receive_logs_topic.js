#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const axios = require('axios');

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_topic.js <facility>.<severity>");
  process.exit(1);
}


amqp.connect('amqp://rabbitmq:5672', function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'orders';

    channel.assertExchange(exchange, 'topic', {
      durable: false
    });

    channel.assertQueue('', {
      exclusive: true
    }, function (error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(' [*] Waiting for logs. To exit press CTRL+C');

      args.forEach(function (key) {
        channel.bindQueue(q.queue, exchange, key);
      });
      //Consume Order Created Message &
      channel.consume(q.queue, function (msg) {
        console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
        var message = JSON.parse(msg.content);
        var bookId = message.bookId;
        var orderQuantity = message.orderQuantity;
        checkStock(bookId);

        //Get quantity of 'bookId` in stock

        
        //Publish message to webhook server
        /*
        const options = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        axios.post('http://webeventd:9292/private/publish-message', msg.content, options).then((response) => {
          console.log(response);
        }, (error) => {
          console.log(error);
        });
        */
      }, {
        noAck: true
      });
    });
  });
});

function checkStock(bookId){
  axios.get('http://inventory-api:4567/books/' + bookId)
  .then((response) => {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
  });
}