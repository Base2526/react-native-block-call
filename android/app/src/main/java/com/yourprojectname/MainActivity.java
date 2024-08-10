package com.yourprojectname;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
public class MainActivity extends ReactActivity {

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

  private static final int REQUEST_CODE = 100;
  private static final int REQUEST_CODE_READ_CALL_LOG = 101;
  private static final int REQUEST_CODE_ANSWER_PHONE_CALLS = 102;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
//    setContentView(R.layout.activity_main);

//    checkPermission();
    checkPermissionANSWER_PHONE_CALLS();
//    checkPermissionREAD_CALL_LOG();
  }

  private void checkPermission() {
    if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
      // Request permission
      ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.READ_PHONE_STATE}, REQUEST_CODE);
    } else {
      // Permission already granted
      Log.d("MainActivity", "Permission granted. You can access phone state.");
      // Call your method that requires the permission here
    }
  }

  private void checkPermissionREAD_CALL_LOG() {
    if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_CALL_LOG) != PackageManager.PERMISSION_GRANTED) {
      // Request permission
      ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.READ_CALL_LOG}, REQUEST_CODE_READ_CALL_LOG);
    } else {
      // Permission already granted
      Log.d("MainActivity", "Permission granted. You can access phone state.");
      // Call your method that requires the permission here
    }
  }

  private void checkPermissionANSWER_PHONE_CALLS() {
    if (ContextCompat.checkSelfPermission(this, Manifest.permission.ANSWER_PHONE_CALLS) != PackageManager.PERMISSION_GRANTED) {
      // Request permission
      ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ANSWER_PHONE_CALLS}, REQUEST_CODE_ANSWER_PHONE_CALLS);
    } else {
      // Permission already granted
      Log.d("MainActivity", "Permission granted. You can access phone state.");
      // Call your method that requires the permission here
    }
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    if (requestCode == REQUEST_CODE) {
      if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
        Log.d("MainActivity", "Permission granted by user.");
        // Permission granted, call your method that requires the permission here
      } else {
        Log.d("MainActivity", "Permission denied by user.");
        // Handle the case where the permission was denied
      }
    }else if(requestCode == REQUEST_CODE_READ_CALL_LOG){
      Log.d("MainActivity", "REQUEST_CODE_READ_CALL_LOG.");
    }else if(requestCode == REQUEST_CODE_ANSWER_PHONE_CALLS){
      Log.d("MainActivity", "REQUEST_CODE_ANSWER_PHONE_CALLS.");
    }
  }
}
