const axios = require('axios').default;
// class Order {
//   constructor(bookId, quantityOrdered) {
//     this.orderId = Math.floor((Math.random() * 100) + 1);
//     this.bookId = bookId;
//     this.quantityOrdered = quantityOrdered;
//     this.status = null;


    
//   }
//   getOrderId() {
//     return this.orderId;
//   }
//   getStatus(){
//     return this.status;
//   }
Order = {
  test: async function createOrder (bookId){
    return axios.get('http://localhost:4568/books/' + bookId)
  }
};
//   createAudioFileAsync(audioSettings, successCallback, failureCallback);
// }

exports.Order = Order;