package com.yourprojectname.newarchitecture;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.List;

public class DatabaseHelper extends SQLiteOpenHelper {
    private static final String DATABASE_NAME = "mydatabase.db";
    private static final String TABLE_NAME = "mytable";
    private static final String COL_ID = "ID";
    private static final String COL_PHONE_NUMBER = "PHONE_NUMBER";
    private static final String COL_DETAIL = "DETAIL";
    private static final String COL_REPORTER = "REPORTER";
    private static final String COL_STATUS = "STATUS";
    private static final String COL_CREATE_AT = "CREATE_AT";
    private static final String COL_UPDATE_AT = "UPDATE_AT";


    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, 1);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE " + TABLE_NAME + " ("+
                                        COL_ID +" INTEGER PRIMARY KEY AUTOINCREMENT, "+
                                        COL_PHONE_NUMBER +" TEXT, "+
                                        COL_DETAIL +" TEXT, "+
                                        COL_REPORTER +" TEXT, "+
                                        COL_STATUS +" INTEGER DEFAULT 1, "+
                                        COL_CREATE_AT +" DATE DEFAULT CURRENT_TIMESTAMP, " +
                                        COL_UPDATE_AT +" DATE DEFAULT CURRENT_TIMESTAMP)");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_NAME);
        onCreate(db);
    }

    // Add a new entry
    public boolean addData(DataItem i) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues contentValues = new ContentValues();
        contentValues.put(COL_PHONE_NUMBER, i.getPhoneNumber());
        contentValues.put(COL_DETAIL, i.getDetail());
        contentValues.put(COL_REPORTER, i.getReporter());
        long result = db.insert(TABLE_NAME, null, contentValues);
        return result != -1; // returns true if insert was successful
    }

    public boolean addDatas(List<DataItem> datas) {
        SQLiteDatabase db = this.getWritableDatabase();
        db.beginTransaction(); // Start transaction
        try {
            for (DataItem data : datas) {
                ContentValues contentValues = new ContentValues();
                contentValues.put(COL_PHONE_NUMBER, data.getPhoneNumber());
                contentValues.put(COL_DETAIL, data.getDetail());
                contentValues.put(COL_REPORTER, data.getReporter());
                long result = db.insert(TABLE_NAME, null, contentValues);
                if (result == -1) {
                    return false; // If any insert fails, rollback transaction
                }
            }
            db.setTransactionSuccessful(); // Mark transaction as successful
        } finally {
            db.endTransaction(); // End transaction
        }
        return true; // All inserts were successful
    }

//    Get all entries
//    public Cursor getAllData() {
//        SQLiteDatabase db = this.getWritableDatabase();
//        return db.rawQuery("SELECT * FROM " + TABLE_NAME, null);
//    }


    // Get entry by ID
    public String getDataById(String id) {
        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.rawQuery("SELECT * FROM " + TABLE_NAME + " WHERE ID = ?", new String[]{id});

        if (cursor != null) {
            if (cursor.moveToFirst()) {
                String result = "{ \""+COL_ID+"\": \"" + cursor.getString(0)
                                + "\", \""+COL_PHONE_NUMBER+"\": \"" + cursor.getString(1) + "\""
                                + "\", \""+COL_DETAIL+"\": \"" + cursor.getString(2) + "\""
                                + "\", \""+ COL_REPORTER +"\": \"" + cursor.getString(3) + "\" }";
                cursor.close();
                return result; // return JSON string
            }
            cursor.close();
        }
        return "{}"; // return empty JSON if not found
    }

    // Get entry by phone number
    public String getDataByPhoneNumber(String phoneNumber) {
        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.rawQuery("SELECT * FROM " + TABLE_NAME + " WHERE PHONE_NUMBER = ?", new String[]{phoneNumber});

        if (cursor != null) {
            if (cursor.moveToFirst()) {
                String result = "{ \""+ COL_ID +"\": \"" + cursor.getString(0)
                                + "\", \""+ COL_PHONE_NUMBER +"\": \"" + cursor.getString(1) + "\" "
                                + "\", \""+ COL_DETAIL +"\": \"" + cursor.getString(2) + "\" "
                                + "\", \""+ COL_REPORTER +"\": \"" + cursor.getString(3) + "\" }";
                cursor.close();
                return result; // return JSON string
            }
            cursor.close();
        }
        return "{}"; // return empty JSON if not found
    }

    // Get all entries
    public WritableArray getAllData() {
        SQLiteDatabase db = this.getWritableDatabase();
        Cursor cursor = db.rawQuery("SELECT * FROM " + TABLE_NAME, null);
        WritableArray results = Arguments.createArray();

        while (cursor.moveToNext()) {
            WritableMap item = Arguments.createMap();
            item.putString(COL_ID, String.valueOf(cursor.getInt(0))); // Assuming ID is an integer
            item.putString(COL_PHONE_NUMBER, cursor.getString(1));
            item.putString(COL_DETAIL, cursor.getString(2));
            item.putString(COL_REPORTER, cursor.getString(3));
            results.pushMap(item);
        }
        cursor.close(); // Always close the cursor to avoid memory leaks
        return results;
    }

    // Update an entry
    public boolean updateData(DataItem i) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues contentValues = new ContentValues();
//        contentValues.put(COL_1, i.getId());
        contentValues.put(COL_PHONE_NUMBER, i.getPhoneNumber());
        contentValues.put(COL_DETAIL, i.getDetail());
        contentValues.put(COL_REPORTER, i.getReporter());
        db.update(TABLE_NAME, contentValues, "ID = ?", new String[]{String.valueOf(i.getId())});
        return true;
    }

    // Delete an entry
    public Integer deleteData(String id) {
        SQLiteDatabase db = this.getWritableDatabase();
        return db.delete(TABLE_NAME, "ID = ?", new String[]{id});
    }
}

