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
      //Consume Order Created Message
      channel.consume(q.queue, function (msg) {
        console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
        let message = JSON.parse(msg.content);
        let bookId = message.bookId;
        let orderQuantity = message.orderQuantity;
        updateInventory(bookId, orderQuantity);
      }, {
        noAck: true
      });
    });
  });
});

async function updateInventory(bookId, orderQuantity){
  //Get quantity on hand
  let promise = axios.get('http://inventory-api:4567/books/' + bookId)
  .then((response) => {
    return response.data;
  });
  let result = await promise;
  let quantityOnHand = result.quantityOnHand;
  let newQuantityOnHand = quantityOnHand - orderQuantity;
  //Update inventory quantity
  axios({
    method: 'put',
    url: 'http://inventory-api:4567/books/' + bookId,
    data: {
      newQuantityOnHand: newQuantityOnHand
    }
  })
  .then((response) => {
    console.log('Order quantity updated succesfully');
    publishMessage('Inventory Updated');
  }, (error) => {
    console.log(error);
  });
}

function publishMessage(msg){
  amqp.connect('amqp://rabbitmq:5672', function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }
      var exchange = 'orders';
      var key = 'order.inventoryUpdated';

      channel.assertExchange(exchange, 'topic', {
        durable: false
      });
      channel.publish(exchange, key, Buffer.from(msg));
      console.log(" [x] Sent %s:'%s'", key, msg);
    });
    setTimeout(function() { 
      connection.close(); 
    }, 500);
  });
}