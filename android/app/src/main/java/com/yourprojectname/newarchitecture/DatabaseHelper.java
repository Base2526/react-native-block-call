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
    private static final String COL_1 = "ID";
    private static final String COL_2 = "PHONE_NUMBER";
    private static final String COL_3 = "DETAIL";
    private static final String COL_4 = "REPORTER";

    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, 1);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE " + TABLE_NAME + " (ID INTEGER PRIMARY KEY AUTOINCREMENT, PHONE_NUMBER TEXT, DETAIL TEXT, REPORTER TEXT, UPDATE_AT DATE DEFAULT CURRENT_TIMESTAMP)");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_NAME);
        onCreate(db);
    }

    // Add a new entry
    public boolean addData(Item i) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues contentValues = new ContentValues();
        contentValues.put(COL_2, i.getPhoneNumber());
        contentValues.put(COL_3, i.getDetail());
        contentValues.put(COL_4, i.getReporter());
        long result = db.insert(TABLE_NAME, null, contentValues);
        return result != -1; // returns true if insert was successful
    }

    public boolean addDatas(List<Item> datas) {
        SQLiteDatabase db = this.getWritableDatabase();
        db.beginTransaction(); // Start transaction
        try {
            for (Item data : datas) {
                ContentValues contentValues = new ContentValues();
                contentValues.put(COL_2, data.getPhoneNumber());
                contentValues.put(COL_3, data.getDetail());
                contentValues.put(COL_4, data.getReporter());
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
                String result = "{ \"id\": \"" + cursor.getString(0)
                                + "\", \"phoneNumber\": \"" + cursor.getString(1) + "\""
                                + "\", \"detail\": \"" + cursor.getString(2) + "\""
                                + "\", \"reporter\": \"" + cursor.getString(3) + "\" }";
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
                String result = "{ \"id\": \"" + cursor.getString(0)
                                + "\", \"phoneNumber\": \"" + cursor.getString(1) + "\" "
                                + "\", \"detail\": \"" + cursor.getString(2) + "\" "
                                + "\", \"reporter\": \"" + cursor.getString(3) + "\" }";
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
            item.putString("id", String.valueOf(cursor.getInt(0))); // Assuming ID is an integer
            item.putString("phoneNumber", cursor.getString(1));
            item.putString("detail", cursor.getString(2));
            item.putString("reporter", cursor.getString(3));
            results.pushMap(item);
        }
        cursor.close(); // Always close the cursor to avoid memory leaks
        return results;
    }

    // Update an entry
    public boolean updateData(Item i) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues contentValues = new ContentValues();
//        contentValues.put(COL_1, i.getId());
        contentValues.put(COL_2, i.getPhoneNumber());
        contentValues.put(COL_3, i.getDetail());
        contentValues.put(COL_4, i.getReporter());
        db.update(TABLE_NAME, contentValues, "ID = ?", new String[]{String.valueOf(i.getId())});
        return true;
    }

    // Delete an entry
    public Integer deleteData(String id) {
        SQLiteDatabase db = this.getWritableDatabase();
        return db.delete(TABLE_NAME, "ID = ?", new String[]{id});
    }
}

