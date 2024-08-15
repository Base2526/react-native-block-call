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

//    @ReactMethod
//    public void fetchSmsLogs(Promise promise){
//        Uri smsUri = Uri.parse("content://sms/");
//        Cursor cursor = getReactApplicationContext().getContentResolver().query(smsUri, null, null, null, null);
//
//        if (cursor != null) {
//            /*
//            *   1. _id: The unique identifier for the SMS message.
//                2. address: The phone number or address from which the SMS was sent or received.
//                3. body: The actual content of the SMS message.
//                4. date: The timestamp of when the SMS was sent or received (in milliseconds).
//                5. type: The type of the SMS message (e.g., incoming, outgoing, draft).
//                6. thread_id: The ID of the conversation thread to which this SMS belongs.
//                7. read: A boolean indicating whether the SMS has been read (1 for read, 0 for unread).
//                8. status: The status of the SMS message (e.g., sent, failed).
//            * */
//            WritableArray smsList = Arguments.createArray();
//            while (cursor.moveToNext()) {
//                String id = cursor.getString(cursor.getColumnIndexOrThrow("_id"));
//                String address = cursor.getString(cursor.getColumnIndexOrThrow("address"));
//                String body = cursor.getString(cursor.getColumnIndexOrThrow("body"));
//                String date = cursor.getString(cursor.getColumnIndexOrThrow("date"));
//                String type = cursor.getString(cursor.getColumnIndexOrThrow("type"));
//                int read = cursor.getInt(cursor.getColumnIndexOrThrow("read"));
//                String status = cursor.getString(cursor.getColumnIndexOrThrow("status"));
//                String thread_id = cursor.getString(cursor.getColumnIndexOrThrow("thread_id"));
//
//                // Log or display the SMS
//                Log.d("OldSms", "From: " + address + ", Body: " + body + ", Date: " + date);
//
//                // Fetch contact name associated with the number
//                ContactInfo contactInfo = getContactInfo(address);
//
//                // Create a WritableMap for each smsItem
//                WritableMap smsItem = Arguments.createMap();
//                smsItem.putString("id", id);
//                smsItem.putString("number", address);
//                smsItem.putString("body", body);
//                smsItem.putString("date", date);
//
//                smsItem.putString("name", contactInfo.name); // Add contact name
//                smsItem.putString("photoUri", contactInfo.photoUri); // Add contact photo URI
//
//                smsItem.putString("type", type);
//                smsItem.putInt("read", read);
//                smsItem.putString("status", status);
//                smsItem.putString("thread_id", thread_id);
//
//                // Add the WritableMap to the WritableArray
//                smsList.pushMap(smsItem);
//            }
//            cursor.close();
//            promise.resolve(smsList);
//        }
//        promise.resolve(null);
//    }

    @ReactMethod
    public void fetchSmsLogs(Promise promise) {
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
                ContactInfo contactInfo = getContactInfo(address);

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

            promise.resolve(groupedSmsList);
        } else {
            promise.reject("Error", "Failed to retrieve SMS logs.");
        }
    }

    @ReactMethod
    public void fetchSmsMessagesByThreadId(String threadId, Promise promise){
        try {

            List<SmsMessage> messages = getSmsMessagesByThreadId(Long.parseLong(threadId));
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

    private List<SmsMessage> getSmsMessagesByThreadId(long threadId) {
        List<SmsMessage> messages = new ArrayList<>();
        Uri uri = Uri.parse("content://sms/");
        String selection = "thread_id = ?";
        String[] selectionArgs = new String[]{String.valueOf(threadId)};

        ContentResolver contentResolver = getReactApplicationContext().getContentResolver();
        Cursor cursor = contentResolver.query(uri, null, selection, selectionArgs, null);
        if (cursor != null) {
            while (cursor.moveToNext()) {
                SmsMessage sms = new SmsMessage();
                sms.setId(cursor.getString(cursor.getColumnIndexOrThrow("_id")));
                sms.setAddress(cursor.getString(cursor.getColumnIndexOrThrow("address")));
                sms.setBody(cursor.getString(cursor.getColumnIndexOrThrow("body")));
                sms.setDate(cursor.getLong(cursor.getColumnIndexOrThrow("date")));
                sms.setType(cursor.getInt(cursor.getColumnIndexOrThrow("type")));

                sms.setRead(cursor.getInt(cursor.getColumnIndexOrThrow("read")));
                sms.setStatus(cursor.getString(cursor.getColumnIndexOrThrow("status")));

                messages.add(sms);
            }
            cursor.close();
        }
        return messages;
    }

    /*
    *   1. _id: The unique identifier for the SMS message.
        2. address: The phone number or address from which the SMS was sent or received.
        3. body: The actual content of the SMS message.
        4. date: The timestamp of when the SMS was sent or received (in milliseconds).
        5. type: The type of the SMS message (e.g., incoming, outgoing, draft).
        6. thread_id: The ID of the conversation thread to which this SMS belongs.
        7. read: A boolean indicating whether the SMS has been read (1 for read, 0 for unread).
        8. status: The status of the SMS message (e.g., sent, failed).
    * */
    private static class SmsMessage {
        String id;
        String address;
        String body;
        long date;
        int type;
        int read;
        String status;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getBody() {
            return body;
        }

        public void setBody(String body) {
            this.body = body;
        }

        public long getDate() {
            return date;
        }

        public void setDate(long date) {
            this.date = date;
        }

        public int getType() {
            return type;
        }

        public void setType(int type) {
            this.type = type;
        }

        public int isRead() {
            return read;
        }

        public void setRead(int read) {
            this.read = read;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}
