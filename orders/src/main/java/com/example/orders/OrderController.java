package com.example.orders;
import java.io.IOException;
import java.net.*;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeoutException;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import com.google.gson.JsonObject;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.Channel;

import org.json.JSONArray;
import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class OrderController {
    // one instance, reuse
    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .build();

    private final static String QUEUE_NAME = "hello";
    private static final String EXCHANGE_NAME = "orders";

    @GetMapping("/")
    public String hello(){
        return "Hello!";
    }

    @PostMapping("/orders")
    public String createOrder(@RequestBody OrderContents orderContents) throws IOException, InterruptedException, TimeoutException {
        System.out.println("INSIDE POST");
        //Send message to queue
        //sendMessage();

        //Create Order
        int quantityInStock = getInventory(orderContents.getBookId());
        if(orderContents.getQuantity() > quantityInStock){
            return "Order Not Created";
        }
        else{
            emitLogTopic(orderContents.getBookId(), orderContents.getQuantity());
            return "Order Created";
        }
    }

    private void getListOfBooks() throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .GET()
                .uri(URI.create("http://localhost:4567/books"))
                .setHeader("User-Agent", "Java 11 HttpClient Bot")
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        //Convert server response into JSONArray
        JSONArray jsonArr = new JSONArray(response.body());
        //Convert each JSON element in array into JSONObject to parse by individual fields
        for (int i = 0; i < jsonArr.length(); i++)
        {
            JSONObject jsonObj = jsonArr.getJSONObject(i);
            //getString(key) method access individuals json keys and returns their value
            System.out.println(jsonObj.getString("bookId"));
        }
    }
    private int getInventory(String bookId) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .GET()
                .uri(URI.create("http://inventory-api:4567/books/" + bookId))
                .setHeader("User-Agent", "Java 11 HttpClient Bot")
                .setHeader("Content-Type", "application/json")
                .setHeader("accept", "application/json")
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        JSONObject book = new JSONObject(response.body().toString());
        return book.getInt("quantityOnHand");
    }
    private void sendMessage() throws IOException, TimeoutException {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {
            channel.queueDeclare(QUEUE_NAME, false, false, false, null);
            String message = "Hello World!";
            channel.basicPublish("", QUEUE_NAME, null, message.getBytes(StandardCharsets.UTF_8));
            System.out.println(" [x] Sent '" + message + "'");
        }
    }
    private void emitLogTopic(String bookId, int quantity) throws IOException, TimeoutException {
        //Construct Order as JSON
        JsonObject order = new JsonObject();
        order.addProperty("bookId", bookId);
        order.addProperty("orderQuantity", quantity);

        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("rabbitmq");
        factory.setPort(5672);
        try (Connection connection = factory.newConnection(); Channel channel = connection.createChannel()) {
            channel.exchangeDeclare(EXCHANGE_NAME, "topic");

            String routingKey = "order.created";
            String message = order.toString();

            channel.basicPublish(EXCHANGE_NAME, routingKey, null, message.getBytes("UTF-8"));
            System.out.println(" [x] Sent '" + routingKey + "':'" + message + "'");
        }
    }
    private static String getRouting(String[] strings) {
        if (strings.length < 1)
            return "anonymous.info";
        return strings[0];
    }

    private static String getMessage(String[] strings) {
        if (strings.length < 2)
            return "Hello World!";
        return joinStrings(strings, " ", 1);
    }

    private static String joinStrings(String[] strings, String delimiter, int startIndex) {
        int length = strings.length;
        if (length == 0) return "";
        if (length < startIndex) return "";
        StringBuilder words = new StringBuilder(strings[startIndex]);
        for (int i = startIndex + 1; i < length; i++) {
            words.append(delimiter).append(strings[i]);
        }
        return words.toString();
    }
}
