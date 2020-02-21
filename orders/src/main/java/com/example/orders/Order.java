package com.example.orders;
import java.net.*;

public class Order {
    private long orderId;
    private String bookId;
    private int quantityOrdered;
    String status;

    public Order() {
        this.orderId = 0;
        this.bookId = "";
        this.quantityOrdered = 0;
    }
    public Order(String bookId, int quantityOrdered){
        this.orderId = 0;
        this.bookId = bookId;
        this.quantityOrdered = quantityOrdered;
    }

    public long getOrderId(){
        return this.orderId;
    }
    public void setOrderId(long orderId){
        this.orderId = orderId;
    }
    public String getBookId(){
        return this.bookId;
    }
    public void setBookId(String bookId){
        this.bookId = bookId;
    }
    public int getQuantityOrdered(){
        return this.quantityOrdered;
    }
    public void setQuantityOrdered(int quantityOrdered){
        this.quantityOrdered = quantityOrdered;
    }

}
