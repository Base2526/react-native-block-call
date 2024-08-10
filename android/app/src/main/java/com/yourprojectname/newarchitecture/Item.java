package com.yourprojectname.newarchitecture;

public class Item {

    private int id;
    private String phoneNumber;
    private String detail;
    private String reporter;

    public Item(){}

    // Constructor
    public Item(int id, String phoneNumber, String detail, String reporter) {
        this.id = id;
        this.phoneNumber = phoneNumber;
        this.detail = detail;
        this.reporter = reporter;
    }

    // Getters
    public int getId() {
        return id;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getDetail() {
        return detail;
    }

    public String getReporter() {
        return reporter;
    }

    // Optionally, you can also implement setters if needed
    public void setId(int id) {
        this.id = id;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public void setReporter(String reporter) {
        this.reporter = reporter;
    }
}
