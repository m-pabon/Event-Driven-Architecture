# Event-Driven-Architecture
This project is the implementation of a portion of an online bookstore application. I made this to test of common technologies and patterns that are commonly used with event driven architectures &amp; microservices.

## Project Gist
[Gist](https://gist.github.com/jhigginbotham/b44dd750459a98e3f7e7387817114634)

## Deploy using Docker-Compose
`docker-compose -p bookstore up`

## Iteration 1
![Diagram 1](./diagrams/images/Implementation&#32;1.png)

The first iteration of this project covers **Message Brokers**. In this project we use [RabbitMQ](https://www.rabbitmq.com/) as our message broker. 

In an enterprise you might find that separate teams are responsible for the `Orders` and `Inventory Management` services. When teams are separated like this the team handling `Orders` might not want to expose their message queue to other teams. After all, the team might want to emitt other events in there it doesnt want others to see. But if that's the case then how is the `Inventory Management` service supposed to be notified when the "order placed" event occurs so it can go about its business?

One solution is to use a **Webhook** which is discussed in Iteration 2.
