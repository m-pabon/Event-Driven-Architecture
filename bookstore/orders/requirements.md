# Requirements

- Verify book quantity is available
- Verify credit card information is available
    - Pass
    - Fail
- Publish message to RabbitMq
    - Routing key: order.created
    - Msg: bookId, quantity 