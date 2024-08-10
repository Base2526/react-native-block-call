/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput, 
  Button, 
  FlatList, 
  Alert, 
  NativeModules 
} from 'react-native';

const { DatabaseHelper } = NativeModules;

const App = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [detail, setDetail] = useState('');
    const [data, setData] = useState([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const loadData = () => {
        DatabaseHelper.getAllData()
            .then(cursor => {
                console.log("loadData cursor :", cursor)
                // const results = [];
                // while (cursor.moveToNext()) {
                //     results.push({ id: cursor.getString(0), name: cursor.getString(1) });
                // }
                setData(cursor);
            })
            .catch(error => console.log(error));
    };

    const getDataByPhoneNumber = (id) => {
        DatabaseHelper.getDataById(id)
            .then(cursor => {
            console.log("getDataById cursor :", cursor)
                // if (cursor && cursor.moveToFirst()) {
                //     const data = { id: cursor.getString(0), name: cursor.getString(1) };
                //     console.log(data); // Do something with the data
                //     cursor.close(); // Close the cursor after processing
                // }
            })
            .catch(error => console.log(error));
    };

    const addData = () => {
        let item = {phoneNumber, detail, reporter: "A2"}
        DatabaseHelper.addData(item)
            .then(() => {
                setPhoneNumber('');
                setDetail('');
                loadData();
            })
            .catch(error => {
                console.log(error);
                Alert.alert('Error', 'Failed to add data');
            });
    };

    // addDatas
    const addDatas = (items: string[]) => {
        DatabaseHelper.addDatas(items)
            .then(() => {
                // setPhoneNumber('');
                loadData();
            })
            .catch(error => {
                console.log(error);
                Alert.alert('Error', 'Failed to add data');
            });
    };

    const deleteData = (id) => {
        DatabaseHelper.deleteData(id)
            .then(() => loadData())
            .catch(error => {
                console.log(error);
                Alert.alert('Error', 'Failed to delete data');
            });
    };

    const updateData = (editingId) => {
        if (editingId) {
            let updateItem = { id: editingId, phoneNumber, detail, reporter: 'A1' }
            DatabaseHelper.updateData(updateItem)
                .then(() => {
                    setPhoneNumber('');
                    setEditingId(null);
                    loadData();
                })
                .catch(error => {
                    console.log(error);
                    Alert.alert('Error', 'Failed to update data');
                });
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(()=>{
        console.log("data :", data)
    }, [data])

    const items = [
        { id: 1, phoneNumber: '0988264820', detail: 'Detail 1', reporter: 'A1' },
        { id: 2, phoneNumber: '0619946936', detail: 'Detail 2', reporter: 'A2' },
        // Add more items as needed
    ];

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Enter Phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.input}
            />
            <TextInput
                placeholder="Enter Detail"
                value={detail}
                onChangeText={setDetail}
                style={styles.input}
            />
            <Button title={editingId ? "Update" : "Add"} onPress={editingId ? updateData : addData} />
            <FlatList
                data={data}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View>
                    <Text>{item.phoneNumber}: {item.detail}</Text>
                    {/* <Button title="Add Datas" onPress={() => addDatas(items)} /> */}
                    <Button title="Delete" onPress={() => deleteData(item.id)} />
                    <Button title="Update" onPress={() => updateData(item.id)} />
                    <Button title="Get By ID" onPress={() => getDataByPhoneNumber(item.id)} />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 10,
  },
  itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
  },
});

export default App;
