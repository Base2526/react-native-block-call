package com.blockcall.architecture;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import android.content.ContentResolver;
import android.database.Cursor;
import android.net.Uri;
import android.provider.CallLog;
import android.telephony.SmsManager;
import android.util.Log;

import java.util.ArrayList;
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
            promise.resolve( Utils.createResponse(true, executionTime, cursor, ""));
        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            long executionTime = endTime - startTime;
            promise.reject("LOGS_ERROR", Utils.createResponse(false, executionTime, null, e.getMessage()));
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

    /*
        CallLog.Calls.TYPE
        -  CallLog.Calls.INCOMING_TYPE (1): Incoming call.
        -  CallLog.Calls.OUTGOING_TYPE (2): Outgoing call.
        -  CallLog.Calls.MISSED_TYPE (3): Missed call.
        -  CallLog.Calls.REJECTED_TYPE (4): Rejected call.
        -  CallLog.Calls.BLOCKED_TYPE (5): Blocked call.
    * */
    @ReactMethod
    public void fetchCallLogs(Promise promise) {
        long startTime = System.currentTimeMillis();
        try {
            Uri callLogUri = Uri.parse("content://call_log/calls");
            ContentResolver contentResolver = getReactApplicationContext().getContentResolver();
            Cursor cursor = contentResolver.query(callLogUri, null, null, null, null);

            if (cursor != null) {
                // Use a HashMap to group call logs by phone number
                HashMap<String, WritableArray> groupedCallLogs = new HashMap<>();

                while (cursor.moveToNext()) {
                    String id = cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls._ID));
                    String number = cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.NUMBER));
                    String type = cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.TYPE));
                    String date = cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.DATE));

                    // Fetch contact name and photo associated with the number
                    ContactInfo contactInfo = Utils.getContactInfo(getReactApplicationContext(), number);

                    // Create a WritableMap for each CallItem
                    WritableMap callItem = Arguments.createMap();
                    callItem.putString("id", id);
                    callItem.putString("name", contactInfo.name);
                    callItem.putString("photoUri", contactInfo.photoUri);
                    callItem.putString("number", number);
                    callItem.putString("type", type);
                    callItem.putString("date", date);

                    // Check if the number is already in the grouped map
                    if (!groupedCallLogs.containsKey(number)) {
                        groupedCallLogs.put(number, Arguments.createArray());
                    }

                    // Add the call item to the corresponding group in the HashMap
                    groupedCallLogs.get(number).pushMap(callItem);
                }

                cursor.close();

                // Create a WritableArray to return the grouped call logs
                WritableArray groupedCallList = Arguments.createArray();

                for (Map.Entry<String, WritableArray> entry : groupedCallLogs.entrySet()) {
                    WritableMap group = Arguments.createMap();
                    group.putString("number", entry.getKey());
                    group.putArray("callLogs", entry.getValue());
                    groupedCallList.pushMap(group);
                }

                long endTime = System.currentTimeMillis();
                long executionTime = endTime - startTime;
                promise.resolve(Utils.createResponse(true, executionTime, groupedCallList, ""));
            }
        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            long executionTime = endTime - startTime;
            promise.reject("LOGS_ERROR", Utils.createResponse(false, executionTime, null, e.getMessage()));
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
                    smsItem.putString("address", address);
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

                    WritableArray messages = entry.getValue();

                    groupedSms.putString("id", messages.getMap(0).getString("id"));
                    groupedSms.putString("address", entry.getKey());
                    groupedSms.putArray("messages", messages);
                    groupedSmsList.pushMap(groupedSms);
                }

                long endTime = System.currentTimeMillis();
                long executionTime = endTime - startTime;
                promise.resolve(Utils.createResponse(true, executionTime, groupedSmsList, ""));
            } else {
                long endTime = System.currentTimeMillis();
                long executionTime = endTime - startTime;

                promise.reject("LOGS_ERROR", Utils.createResponse(false, executionTime, null, "Failed to retrieve SMS logs."));
            }
        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            long executionTime = endTime - startTime;
            promise.reject("LOGS_ERROR", Utils.createResponse(false, executionTime, null, e.getMessage()));
        }
    }

    @ReactMethod
    public void fetchSmsThreadIdLogs(String number, Promise promise) {
        long startTime = System.currentTimeMillis();
        try {
            Log.d("fetchSmsThreadIdLogs", "start :" + number );
            Uri smsUri = Uri.parse("content://sms/");
            String[] projection = new String[] { "_id", "address", "body", "date" }; // Specify the columns you want to retrieve
            String selection = "address = ?";
            String[] selectionArgs = new String[] { number }; // Replace with the address you want to filter by

            Cursor cursor = getReactApplicationContext().getContentResolver().query(smsUri, null, selection, selectionArgs, null);

            WritableArray threadIds = Arguments.createArray();
            if (cursor != null) {
                try {
                    while (cursor.moveToNext()) {
//                        String id = cursor.getString(cursor.getColumnIndex("_id"));
//                        String address = cursor.getString(cursor.getColumnIndex("address"));
//                        String body = cursor.getString(cursor.getColumnIndex("body"));
//                        long date = cursor.getLong(cursor.getColumnIndex("date"));

                        String id =  cursor.getString(cursor.getColumnIndexOrThrow("_id"));
                        String thread_id = cursor.getString(cursor.getColumnIndexOrThrow("thread_id"));

                        // Process the SMS data
//                        Log.d("fetchSmsThreadIdLogs", "thread_id: " + thread_id );

//                        threadId.add(thread_id);

                        threadIds.pushString(thread_id);
                    }

                    WritableArray newThreadIds = Utils.removeDuplicates(threadIds);

                    long endTime = System.currentTimeMillis();
                    long executionTime = endTime - startTime;
                    promise.resolve(Utils.createResponse(true, executionTime, newThreadIds, ""));
                } catch (Exception e) {
                    long endTime = System.currentTimeMillis();
                    long executionTime = endTime - startTime;
                    promise.reject("LOGS_ERROR", Utils.createResponse(false, executionTime, null, e.getMessage()));
                } finally {
                    cursor.close();
                }
            }

            long endTime = System.currentTimeMillis();
            long executionTime = endTime - startTime;
            promise.resolve(Utils.createResponse(true, executionTime, threadIds, ""));
        } catch (Exception e) {
            Log.e("fetchSmsThreadIdLogs",  e.getMessage() );
            long endTime = System.currentTimeMillis();
            long executionTime = endTime - startTime;
            promise.reject("LOGS_ERROR", Utils.createResponse(false, executionTime, null, e.getMessage()));
        }
    }

    /*
    Telephony.Sms.TYPE
        Telephony.Sms.MESSAGE_TYPE_INBOX – Represents an incoming SMS message. 
        Telephony.Sms.MESSAGE_TYPE_SENT – Represents an SMS message that has been sent.
        Telephony.Sms.MESSAGE_TYPE_DRAFT – Represents an SMS draft.
        Telephony.Sms.MESSAGE_TYPE_OUTBOX – Represents an SMS message that is in the outbox, waiting to be sent.
    */
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

                // Fetch contact name associated with the number
                ContactInfo contactInfo =  Utils.getContactInfo(getReactApplicationContext(), sms.getAddress());

                smsMap.putString("name", contactInfo.name); // Add contact name
                smsMap.putString("photoUri", contactInfo.photoUri); // Add contact photo URI

                smsMap.putInt("read", sms.isRead());
                smsMap.putString("status", sms.getStatus());

                writableArray.pushMap(smsMap);
            }
            promise.resolve(writableArray);
        } catch (Exception e) {
            promise.reject("ERROR", e);
        }
    }

    @ReactMethod
    public void sendTextSMS(String phoneNumber, String message, Promise promise){
        long startTime = System.currentTimeMillis();

        SmsManager smsManager = SmsManager.getDefault();
        try {
            smsManager.sendTextMessage(phoneNumber, null, message, null, null);

            long endTime = System.currentTimeMillis();
            long executionTime = endTime - startTime;
            promise.resolve(Utils.createResponse(true, executionTime,  null, ""));
        } catch (Exception e) {
            promise.reject("ERROR", e);
        }
    }
}
