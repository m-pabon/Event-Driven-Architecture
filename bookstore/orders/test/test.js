var assert = require('assert');
const Order = require('../src/Order.js')

/*Create an Order
- Verify book quantity is available
- Verify credit card information is available
    - Pass
    - Fail
*/
describe ('Order', function(){

    describe ('#constructor()', function(){
        it('should create create a order object with a randomized order_id', function(){
            var order = new Order('book2', 2);
            assert.notEqual(order, null);
            assert.notEqual(order.getOrderId(), null);

        });
        it('should cancel the order if quantity ordered is greater than quantity on hand', function(){
            var order = new Order('book2', 10);

            assert.equal(order.getStatus(), 'Cancelled');
        });
        it('should create the order if quantity ordered is less than the quantity on hand', function(){
            var order2 = new Order('book4', 1);
            order2.createOrder('book4');
            assert.equal(order2.getStatus(), 'Created');
        });
    });
});

//Get an order