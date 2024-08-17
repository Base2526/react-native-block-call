package com.yourprojectname;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import android.Manifest;
import android.app.role.RoleManager;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.CallLog;
import android.provider.Telephony;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class MainActivity extends ReactActivity {

  private static final int PERMISSIONS_REQUEST_CODE = 100;

  private static final String ROLE= RoleManager.ROLE_SMS;
  private static final int REQUEST_CODE_SET_DEFAULT_SMS=1001;
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "YourProjectName";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
   * (Paper).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }

    @Override
    protected boolean isConcurrentRootEnabled() {
      // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
      // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
//    setContentView(R.layout.activity_main);

    requestPermissions();

    if (!Telephony.Sms.getDefaultSmsPackage(getApplicationContext()).equals(getApplicationContext().getPackageName())) {
      Intent intent = new Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT);
      intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, getApplicationContext().getPackageName());
      startActivity(intent);
    }
  }

//  private void askDefaultSmsHandlerPermission() {
//    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//      // Use RoleManager as shown above
//    } else {
//      // For Android 9 and belowIntentintent=newIntent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT);
//      intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, getPackageName());
//      startActivityForResult(intent, REQUEST_CODE_SET_DEFAULT_SMS);
//    }
//  }

//  private void askDefaultSmsHandlerPermission() {
//    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//      RoleManagerroleManager= getSystemService(RoleManager.class);
//      if (roleManager != null && roleManager.isRoleAvailable(ROLE)) {
//        if (!roleManager.isRoleHeld(ROLE)) {
//          IntentroleRequestIntent= roleManager.createRequestRoleIntent(ROLE);
//          startActivityForResult(roleRequestIntent, REQUEST_CODE_SET_DEFAULT_SMS);
//        } else {
//          showToast("App is already the default SMS handler.");
//        }
//      } else {
//        showToast("RoleManager is unavailable or role is not available.");
//      }
//    } else {
//      // For Android versions below 10Intentintent=newIntent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT);
//      intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, getPackageName());
//      startActivityForResult(intent, REQUEST_CODE_SET_DEFAULT_SMS);
//    }
//  }

  private void requestPermissions() {
    String[] permissions = {
            Manifest.permission.READ_PHONE_STATE,
            Manifest.permission.READ_CALL_LOG,
            Manifest.permission.RECEIVE_SMS,
            Manifest.permission.ANSWER_PHONE_CALLS,
            Manifest.permission.READ_SMS,
            Manifest.permission.READ_CONTACTS
    };

    List<String> permissionsNeeded = new ArrayList<>();
    for (String permission : permissions) {
      if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
        permissionsNeeded.add(permission);
      }
    }

    if (!permissionsNeeded.isEmpty()) {
      ActivityCompat.requestPermissions(this, permissionsNeeded.toArray(new String[0]), PERMISSIONS_REQUEST_CODE);
    } else {
      // All permissions are already granted
      onPermissionsGranted();
    }
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);

    if (requestCode == PERMISSIONS_REQUEST_CODE) {
      boolean allGranted = true;
      for (int result : grantResults) {
        if (result != PackageManager.PERMISSION_GRANTED) {
          allGranted = false;
          break;
        }
      }

      if (allGranted) {
        // All permissions granted
        onPermissionsGranted();
      } else {
        // Handle the case where permissions are denied
        Toast.makeText(this, "Some permissions were denied", Toast.LENGTH_SHORT).show();
      }
    }
  }

  private void onPermissionsGranted() {
    // Your logic here, e.g., accessing contacts, starting the camera, or accessing location
    //    readOldSms();
    //    fetchOldCallLogs();
    Toast.makeText(this, "All permissions granted!", Toast.LENGTH_SHORT).show();
  }

  private void readOldSms() {
    Uri smsUri = Uri.parse("content://sms/");
    Cursor cursor = getContentResolver().query(smsUri, null, null, null, null);

    if (cursor != null) {
      while (cursor.moveToNext()) {
        String address = cursor.getString(cursor.getColumnIndexOrThrow("address"));
        String body = cursor.getString(cursor.getColumnIndexOrThrow("body"));
        String date = cursor.getString(cursor.getColumnIndexOrThrow("date"));

        // Log or display the SMS
        Log.d("OldSms", "From: " + address + ", Body: " + body + ", Date: " + date);
      }
      cursor.close();
    }
  }

  private void fetchOldCallLogs() {
    Uri callLogUri = Uri.parse("content://call_log/calls");
    ContentResolver contentResolver = getContentResolver();
    Cursor cursor = contentResolver.query(callLogUri, null, null, null, null);

    if (cursor != null) {
      while (cursor.moveToNext()) {
        String number = cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.NUMBER));
        String type = cursor.getString(cursor.getColumnIndexOrThrow(CallLog.Calls.TYPE));
        long date = cursor.getLong(cursor.getColumnIndexOrThrow(CallLog.Calls.DATE));

        // Process the call log data here
        Log.d("OldCallLog", "Number: " + number + ", Type: " + type + ", Date: " + new Date(date));
      }
      cursor.close();
    }
  }
}
