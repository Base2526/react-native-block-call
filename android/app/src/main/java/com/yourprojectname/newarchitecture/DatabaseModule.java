package com.yourprojectname.newarchitecture;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import android.annotation.SuppressLint;
import android.content.ContentResolver;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.provider.CallLog;
import android.provider.ContactsContract;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    private WritableMap createResponse(Boolean status, double executionTime, WritableArray data, String message) {
        WritableMap response = Arguments.createMap();
        response.putBoolean("status", status);
        response.putDouble("executionTime", executionTime  / (1000 * 60) ); // convert to minute
        response.putArray("data", data);
        response.putString("message", message);
        return response;
    }

    @ReactMethod
    public void addData(ReadableMap itemMap, Promise promise) {
        String phoneNumber = itemMap.getString("phoneNumber");
        // Check if the phone number already exists in the database
        if (databaseHelper.isPhoneNumberExists(phoneNumber)) {
            promise.reject("DUPLICATE_ERROR", "Phone number already exists");
            return;
        }

        DataItem item = new DataItem();
        item.setPhoneNumber(phoneNumber);
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
        List<DataItem> itemList = new ArrayList<>();
        for (int i = 0; i < items.size(); i++) {
            ReadableMap itemMap = items.getMap(i);
            int id = itemMap.getInt("id");
            String name = itemMap.getString("name");
            String detail = itemMap.getString("detail");
            String reporter = itemMap.getString("reporter");
            DataItem item = new DataItem(id, name, detail, reporter);
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
        long startTime = System.currentTimeMillis();
        try {
            WritableArray cursor = databaseHelper.getAllData();
//            promise.resolve(cursor);
            long endTime = System.currentTimeMillis();
            long executionTime = endTime - startTime;
            promise.resolve(createResponse(true, executionTime, cursor, ""));
        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            long executionTime = endTime - startTime;
            promise.reject("LOGS_ERROR", createResponse(false, executionTime, null, e.getMessage()));
        }
    }

    @ReactMethod
    public void updateData(DataItem item, Promise promise) {
        boolean result = databaseHelper.updateData(item);
        promise.resolve(result);
    }

    @ReactMethod
    public void deleteData(String id, Promise promise) {
        Integer result = databaseHelper.deleteData(id);
        promise.resolve(result);
    }

    @ReactMethod
    public void fetchCallLogs(Promise promise){
        long startTime = System.currentTimeMillis();
        try {
            Uri callLogUri = Uri.parse("content://call_log/calls");
            ContentResolver contentResolver = getReactApplicationContext().getContentResolver();
            Cursor cursor = contentResolver.query(callLogUri, null, null, null, null);
            if (cursor != null) {
                WritableArray callList = Arguments.createArray();
                while (cursor.moveToNext()) {
                    String id = cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls._ID));
                    String number = cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.NUMBER));
                    String type = cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.TYPE));
                    String date = cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.DATE));

                    // Fetch contact name associated with the number
                    ContactInfo contactInfo = Utils.getContactInfo(getReactApplicationContext(), number);

                    // Process the call log data here
                    Log.d("OldCallLog", "Number: " + number + ", Type: " + type + ", Date: " + date);

                    // Create a WritableMap for each CallItem
                    WritableMap callItem = Arguments.createMap();
                    callItem.putString("id", id);
                    callItem.putString("name", contactInfo.name); // Add the contact name to the call item
                    callItem.putString("photoUri", contactInfo.photoUri); // Add the contact photo URI
                    callItem.putString("number", number);
                    callItem.putString("type", type);
                    callItem.putString("date", date);


                    // Add the WritableMap to the WritableArray
                    callList.pushMap(callItem);
                }
                cursor.close();

                long endTime = System.currentTimeMillis();
                long executionTime = endTime - startTime;
                promise.resolve(createResponse(true, executionTime, callList, ""));
            }
        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            long executionTime = endTime - startTime;
            promise.reject("LOGS_ERROR", createResponse(false, executionTime, null, e.getMessage()));
        }
    }

    @ReactMethod
    public void fetchSmsLogs(Promise promise) {
        long startTime = System.currentTimeMillis();
        try {
            Uri smsUri = Uri.parse("content://sms/");
            Cursor cursor = getReactApplicationContext().getContentResolver().query(smsUri, null, null, null, null);

            if (cursor != null) {
                // A map to hold SMS grouped by address
                HashMap<String, WritableArray> smsMap = new HashMap<>();

                while (cursor.moveToNext()) {
                    String id = cursor.getString(cursor.getColumnIndexOrThrow("_id"));
                    String address = cursor.getString(cursor.getColumnIndexOrThrow("address"));
                    String body = cursor.getString(cursor.getColumnIndexOrThrow("body"));
                    String date = cursor.getString(cursor.getColumnIndexOrThrow("date"));
                    String type = cursor.getString(cursor.getColumnIndexOrThrow("type"));
                    int read = cursor.getInt(cursor.getColumnIndexOrThrow("read"));
                    String status = cursor.getString(cursor.getColumnIndexOrThrow("status"));
                    String thread_id = cursor.getString(cursor.getColumnIndexOrThrow("thread_id"));

                    // Fetch contact name associated with the number
                    ContactInfo contactInfo =  Utils.getContactInfo(getReactApplicationContext(), address);

                    // Create a WritableMap for each smsItem
                    WritableMap smsItem = Arguments.createMap();
                    smsItem.putString("id", id);
                    smsItem.putString("number", address);
                    smsItem.putString("body", body);
                    smsItem.putString("date", date);
                    smsItem.putString("name", contactInfo.name); // Add contact name
                    smsItem.putString("photoUri", contactInfo.photoUri); // Add contact photo URI
                    smsItem.putString("type", type);
                    smsItem.putInt("read", read);
                    smsItem.putString("status", status);
                    smsItem.putString("thread_id", thread_id);

                    // Add the smsItem to the corresponding WritableArray in the map
                    if (!smsMap.containsKey(address)) {
                        smsMap.put(address, Arguments.createArray());
                    }
                    smsMap.get(address).pushMap(smsItem);
                }
                cursor.close();

                // Convert the map to a WritableArray for the response
                WritableArray groupedSmsList = Arguments.createArray();
                for (Map.Entry<String, WritableArray> entry : smsMap.entrySet()) {
                    WritableMap groupedSms = Arguments.createMap();
                    groupedSms.putString("address", entry.getKey());
                    groupedSms.putArray("messages", entry.getValue());
                    groupedSmsList.pushMap(groupedSms);
                }

                long endTime = System.currentTimeMillis();
                long executionTime = endTime - startTime;
                promise.resolve(createResponse(true, executionTime, groupedSmsList, ""));
            } else {
                long endTime = System.currentTimeMillis();
                long executionTime = endTime - startTime;

                promise.reject("LOGS_ERROR", createResponse(false, executionTime, null, "Failed to retrieve SMS logs."));
            }
        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            long executionTime = endTime - startTime;
            promise.reject("LOGS_ERROR", createResponse(false, executionTime, null, e.getMessage()));
        }
    }

    @ReactMethod
    public void fetchSmsMessagesByThreadId(String threadId, Promise promise){
        try {
            List<SmsMessage> messages = Utils.getSmsMessagesByThreadId(getReactApplicationContext(), Long.parseLong(threadId));
            WritableArray writableArray = Arguments.createArray();
            for (SmsMessage sms : messages) {
                WritableMap smsMap = Arguments.createMap();
                smsMap.putString("id", sms.getId());
                smsMap.putString("address", sms.getAddress());
                smsMap.putString("body", sms.getBody());
                smsMap.putDouble("date", sms.getDate());
                smsMap.putInt("type", sms.getType());

                smsMap.putInt("read", sms.isRead());
                smsMap.putString("status", sms.getStatus());

                writableArray.pushMap(smsMap);
            }
            promise.resolve(writableArray);
        } catch (Exception e) {
            promise.reject("ERROR", e);
        }
    }
}
