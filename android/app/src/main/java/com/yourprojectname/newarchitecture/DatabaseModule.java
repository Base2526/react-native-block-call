package com.yourprojectname.newarchitecture;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;

import android.database.Cursor;

import java.util.ArrayList;
import java.util.List;

public class DatabaseModule extends ReactContextBaseJavaModule {
    private final DatabaseHelper databaseHelper;

    public DatabaseModule(ReactApplicationContext reactContext) {
        super(reactContext);
        databaseHelper = new DatabaseHelper(reactContext);
    }

    @Override
    public String getName() {
        return "DatabaseHelper";
    }

    @ReactMethod
    public void addData(ReadableMap itemMap, Promise promise) {
        Item item = new Item();
        item.setPhoneNumber(itemMap.getString("phoneNumber"));
        item.setDetail(itemMap.getString("detail"));
        item.setReporter(itemMap.getString("reporter"));

        boolean success = databaseHelper.addData(item);
        if (success) {
            promise.resolve(true);
        } else {
            promise.reject("INSERT_ERROR", "Failed to insert data");
        }
    }

    @ReactMethod
    public void addDatas(ReadableArray items, Promise promise) {
        List<Item> itemList = new ArrayList<>();
        for (int i = 0; i < items.size(); i++) {
            ReadableMap itemMap = items.getMap(i);
            int id = itemMap.getInt("id");
            String name = itemMap.getString("name");
            String detail = itemMap.getString("detail");
            String reporter = itemMap.getString("reporter");
            Item item = new Item(id, name, detail, reporter);
            itemList.add(item);
        }
        boolean success = databaseHelper.addDatas(itemList);
        promise.resolve(success);
    }

    @ReactMethod
    public void getDataById(String id,Promise promise) {
        String cursor = databaseHelper.getDataById(id);
        promise.resolve(cursor);
    }

    @ReactMethod
    public void getDataByName(String phoneNumber, Promise promise) {
        String cursor = databaseHelper.getDataByPhoneNumber(phoneNumber);
        promise.resolve(cursor);
    }

    @ReactMethod
    public void getAllData(Promise promise) {
        WritableArray cursor = databaseHelper.getAllData();
        promise.resolve(cursor);
    }

    @ReactMethod
    public void updateData(Item item, Promise promise) {
        boolean result = databaseHelper.updateData(item);
        promise.resolve(result);
    }

    @ReactMethod
    public void deleteData(String id, Promise promise) {
        Integer result = databaseHelper.deleteData(id);
        promise.resolve(result);
    }
}
