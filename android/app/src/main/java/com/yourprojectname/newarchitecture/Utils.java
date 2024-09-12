package com.yourprojectname.newarchitecture;

import android.content.ContentResolver;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.provider.ContactsContract;

import java.util.ArrayList;
import java.util.List;

public class Utils {

    public static ContactInfo getContactInfo(Context context, String phoneNumber) {
        String contactName = "Unknown";
        String photoUri = null;
        ContentResolver contentResolver = context.getContentResolver();
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

    public static List<SmsMessage> getSmsMessagesByThreadId(Context context, long threadId) {
        List<SmsMessage> messages = new ArrayList<>();
        Uri uri = Uri.parse("content://sms/");
        String selection = "thread_id = ?";
        String[] selectionArgs = new String[]{String.valueOf(threadId)};

        ContentResolver contentResolver = context.getContentResolver();
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

}
