package com.blockcall.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.content.ContentResolver;
import android.net.Uri;
import android.content.ContentValues;
import android.os.Bundle;
import android.telephony.SmsMessage;

public class SmsReceiver extends BroadcastReceiver {
    private static String TAG = SmsReceiver.class.getName();

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d("SmsReceiver", "Broadcast received " + intent.getAction());

        // Extract SMS data
        Bundle bundle = intent.getExtras();
        if (bundle != null) {
            Object[] pdus = (Object[]) bundle.get("pdus");
            if (pdus != null) {
                for (Object pdu : pdus) {
                    SmsMessage smsMessage = SmsMessage.createFromPdu((byte[]) pdu);
                    String sender = smsMessage.getDisplayOriginatingAddress();
                    String message = smsMessage.getMessageBody();
                    long timestamp = smsMessage.getTimestampMillis();

                    // Log received SMS
                    Log.d("SmsReceiver", "Sender: " + sender + ", Message: " + message);

                    // Save SMS to content://sms/
                    saveSmsToDatabase(context, sender, message, timestamp);
                }
            }
        }

    }

    private void saveSmsToDatabase(Context context, String sender, String message, long timestamp) {
        ContentResolver contentResolver = context.getContentResolver();
        ContentValues values = new ContentValues();
        values.put("address", sender);  // Sender's phone number
        values.put("body", message);    // SMS message content
        values.put("date", timestamp);  // Timestamp of the message
        values.put("read", 0);          // 0 for unread, 1 for read
        values.put("type", 1);          // 1 for inbox

        Uri uri = contentResolver.insert(Uri.parse("content://sms/inbox"), values);

        if (uri != null) {
            Log.d("SmsReceiver", "SMS saved to " + uri.toString());
        } else {
            Log.d("SmsReceiver", "Failed to save SMS.");
        }
    }
}
