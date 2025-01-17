package com.yourprojectname.newarchitecture;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.telecom.TelecomManager;
import android.telephony.TelephonyManager;
import android.util.Log;
import androidx.core.app.ActivityCompat;
import org.json.JSONException;
import org.json.JSONObject;

public class PhoneCallReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d("PhoneCallReceiver", "Broadcast received");
        if (intent.getAction().equals(TelephonyManager.ACTION_PHONE_STATE_CHANGED)) {
            String state = intent.getStringExtra(TelephonyManager.EXTRA_STATE);
            if (TelephonyManager.EXTRA_STATE_RINGING.equals(state)) {
                // Check permissions using the context parameter
                if (ActivityCompat.checkSelfPermission(context, Manifest.permission.READ_SMS) != PackageManager.PERMISSION_GRANTED &&
                        ActivityCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_NUMBERS) != PackageManager.PERMISSION_GRANTED &&
                        ActivityCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
                    // Log the request for permissions
                    Log.d("PhoneCallReceiver", "requestPermissions");
                    return;
                }

                String incomingNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER);
                // Log or handle the incoming number
                if (incomingNumber != null) {
                    // Do something with the incoming number
                    Log.d("PhoneCallReceiver", "Incoming number: " + incomingNumber);
                    try {
                        if (isBlockedNumber(context, incomingNumber)) {
                            endCall(context);
                        }
                    } catch (JSONException e) {
                        throw new RuntimeException(e);
                    }
                } else {
                    Log.e("PhoneCallReceiver", "Handle the null case");
                }
            }
        }
    }

    private boolean isBlockedNumber(Context context, String incomingNumber) throws JSONException {
        // Replace this with your logic to check against a list of blocked numbers

        String check = (new DatabaseHelper(context)).getDataByPhoneNumber(incomingNumber);
        Log.i("PhoneCallReceiver ", check);

        if (check.equals("{}")) {

        } else {
//            JSONObject object = new JSONObject(check);
//            String id = object.getString("id");
//            String name = object.getString("name");
//            Log.i("PhoneCallReceiver", object.toString());

            return true;
        }
        return false; // Example blocked number
    }

    private void endCall(Context context) {
        // Logic to end the call (requires special permissions on Android 9 and above)
        TelecomManager telecomManager = (TelecomManager) context.getSystemService(Context.TELECOM_SERVICE);
        if (telecomManager != null) {
//            ComponentName compName = new ComponentName(context, EndCallService.class);
            if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ANSWER_PHONE_CALLS) != PackageManager.PERMISSION_GRANTED) {
                // TODO: Consider calling
                //    ActivityCompat#requestPermissions
                // here to request the missing permissions, and then overriding
                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                //                                          int[] grantResults)
                // to handle the case where the user grants the permission. See the documentation
                // for ActivityCompat#requestPermissions for more details.
                Log.i("", "");
                return;
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                telecomManager.endCall(); // This requires the caller to be the default phone app
            }
        }

//        Intent intent = new Intent(context, EndCallService.class);
//        context.startService(intent);
//        EndCallService service = new EndCallService();
//        service.endCall();
    }
}

