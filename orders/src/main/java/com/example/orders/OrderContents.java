package com.example.orders;

public class OrderContents {
    private String bookId;
    private int quantity;
    public OrderContents(String bookId, int quantity){
        this.bookId = bookId;
        this.quantity = quantity;
    }
    public String getBookId(){
        return this.bookId;
    }
    public int getQuantity(){
        return this.quantity;
    }
}
