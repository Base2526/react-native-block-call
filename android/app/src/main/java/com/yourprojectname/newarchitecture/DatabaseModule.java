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
        DataItem item = new DataItem();
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
        WritableArray cursor = databaseHelper.getAllData();
        promise.resolve(cursor);
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

    private ContactInfo getContactInfo(String phoneNumber) {
        String contactName = "Unknown";
        String photoUri = null;
        ContentResolver contentResolver = getReactApplicationContext().getContentResolver();
        Uri uri = Uri.withAppendedPath(ContactsContract.PhoneLookup.CONTENT_FILTER_URI, Uri.encode(phoneNumber));
        Cursor cursor = contentResolver.query(uri, new String[]{
                ContactsContract.PhoneLookup.DISPLAY_NAME,
                ContactsContract.PhoneLookup.PHOTO_URI
        }, null, null, null);

        if (cursor != null) {
            if (cursor.moveToFirst()) {
                contactName = cursor.getString(cursor.getColumnIndex(ContactsContract.PhoneLookup.DISPLAY_NAME));
                photoUri = cursor.getString(cursor.getColumnIndex(ContactsContract.PhoneLookup.PHOTO_URI));
            }
            cursor.close();
        }

        return new ContactInfo(contactName, photoUri); // Return contact name and photo URI
    }

    private static class ContactInfo {
        String name;
        String photoUri;

        ContactInfo(String name, String photoUri) {
            this.name = name;
            this.photoUri = photoUri;
        }
    }

    @ReactMethod
    public void fetchCallLogs(Promise promise){
        Uri callLogUri = Uri.parse("content://call_log/calls");
        ContentResolver contentResolver = getReactApplicationContext().getContentResolver();
        Cursor cursor = contentResolver.query(callLogUri, null, null, null, null);
        if (cursor != null) {
            WritableArray callList = Arguments.createArray();
            while (cursor.moveToNext()) {
                String number = cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.NUMBER));
                String type = cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.TYPE));
                String date = cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.DATE));

                // Fetch contact name associated with the number
                ContactInfo contactInfo = getContactInfo(number);

                // Process the call log data here
                Log.d("OldCallLog", "Number: " + number + ", Type: " + type + ", Date: " + date);

                // Create a WritableMap for each CallItem
                WritableMap callItem = Arguments.createMap();
                callItem.putString("name", contactInfo.name); // Add the contact name to the call item
                callItem.putString("photoUri", contactInfo.photoUri); // Add the contact photo URI
                callItem.putString("number", number);
                callItem.putString("type", type);
                callItem.putString("date", date);

                // Add the WritableMap to the WritableArray
                callList.pushMap(callItem);
            }
            cursor.close();
            promise.resolve(callList);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void fetchSmsLogs(Promise promise){
        Uri smsUri = Uri.parse("content://sms/");
        Cursor cursor = getReactApplicationContext().getContentResolver().query(smsUri, null, null, null, null);

        if (cursor != null) {
            WritableArray smsList = Arguments.createArray();
            while (cursor.moveToNext()) {
                String number = cursor.getString(cursor.getColumnIndexOrThrow("address"));
                String body = cursor.getString(cursor.getColumnIndexOrThrow("body"));
                String date = cursor.getString(cursor.getColumnIndexOrThrow("date"));

                // Log or display the SMS
                Log.d("OldSms", "From: " + number + ", Body: " + body + ", Date: " + date);

                // Fetch contact name associated with the number
                ContactInfo contactInfo = getContactInfo(number);

                // Create a WritableMap for each smsItem
                WritableMap smsItem = Arguments.createMap();
                smsItem.putString("number", number);
                smsItem.putString("body", body);
                smsItem.putString("date", date);

                smsItem.putString("name", contactInfo.name); // Add contact name
                smsItem.putString("photoUri", contactInfo.photoUri); // Add contact photo URI


                // Add the WritableMap to the WritableArray
                smsList.pushMap(smsItem);
            }
            cursor.close();
            promise.resolve(smsList);
        }
        promise.resolve(null);
    }
}
