/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import styles from './styles'; 

import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput, 
  Button, 
  FlatList, 
  Alert, 
  NativeModules,
  SafeAreaView, 
  Platform
} from 'react-native';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient'; // Adjust the import path as necessary

const { DatabaseHelper, DatabaseModule } = NativeModules;

const App = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [detail, setDetail] = useState('');
    const [data, setData] = useState([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    // //fetchCallLogs, fetchSmsLogs
    const loadData = () => {
        if (Platform.OS === 'ios') {

            // DatabaseModule.getDatabasePath()
            // .then(response=>{
            //     console.log("@1 getDatabasePath ", response)
            // }).catch(error=>{
            //     console.log("@2 getDatabasePath ", error)
            // })

            // Example usage
            DatabaseModule.getAllData()
            .then((response: any) => {
                console.log('Data added:', response);
                setData(response);
            })
            .catch((error: any) => {
                console.error(error);
            });
        } else if (Platform.OS === 'android') {
            DatabaseHelper.fetchCallLogs()
                .then((response: any) => {
                    console.log("fetchCallLogs response :", response)
                })
                .catch((error: any) => console.log(error));

            DatabaseHelper.fetchSmsLogs()
                .then((response: any) => {
                    console.log("fetchSmsLogs response :", response)
                })
                .catch((error: any) => console.log(error));

            DatabaseHelper.getAllData()
                    .then((response: any) => {
                        console.log("loadData cursor :", response)
                        // const results = [];
                        // while (cursor.moveToNext()) {
                        //     results.push({ id: cursor.getString(0), name: cursor.getString(1) });
                        // }
                        setData(response);
                    })
                    .catch((error: any) => console.log(error));
        }
    };

    const getDataByID = (id: any) => {
        if (Platform.OS === 'ios') {

            console.log("getDataByID :", id)
            DatabaseModule.getDataById(id)
            .then((response: any) => {
                console.log("getDataById cursor :", response)
                // if (cursor && cursor.moveToFirst()) {
                //     const data = { id: cursor.getString(0), name: cursor.getString(1) };
                //     console.log(data); // Do something with the data
                //     cursor.close(); // Close the cursor after processing
                // }
            })
            .catch((error: any) => console.log(error));
        } else if (Platform.OS === 'android') {
            DatabaseHelper.getDataById(id)
                .then((response: any) => {
                console.log("getDataById cursor :", response)
                    // if (cursor && cursor.moveToFirst()) {
                    //     const data = { id: cursor.getString(0), name: cursor.getString(1) };
                    //     console.log(data); // Do something with the data
                    //     cursor.close(); // Close the cursor after processing
                    // }
                })
                .catch((error: any) => console.log(error));
        }
    };

    const addData = () => {
        if (Platform.OS === 'ios') {
            let reporter = "A1"
            DatabaseModule.addData(phoneNumber, detail, reporter)
            .then((response: any) => {
                        setPhoneNumber('');
                        setDetail('');
                        loadData();
                        console.log("DatabaseModule.addData")
                        Alert.alert('Success', 'OK to add data');
                    })
                    .catch((error: any) => {
                        console.log(error);
                        Alert.alert('Error', 'Failed to add data');
                    });
        }else if (Platform.OS === 'android') {
            let item = {phoneNumber, detail, reporter: "A2"}
            DatabaseHelper.addData(item)
                .then((response: any) => {
                    setPhoneNumber('');
                    setDetail('');
                    loadData();
                })
                .catch((error: any) => {
                    console.log(error);
                    Alert.alert('Error', 'Failed to add data');
                });
        }
    };

    // addDatas
    const addDatas = async(items?: string[]) => {
        if (Platform.OS === 'ios') {
            const dataArray = [
                { PHONE_NUMBER: '1234567890', DETAIL: 'Detail 1', REPORTER: 'Reporter 1' },
                { PHONE_NUMBER: '0987654321', DETAIL: 'Detail 2', REPORTER: 'Reporter 2' },
            ];
        
            try {
                const result = await DatabaseModule.addDatas(dataArray);
                console.log("Data added successfully:", result);

                loadData();
            } catch (error) {
                console.error("Error adding data:", error);
            }

        }else if (Platform.OS === 'android') {
            DatabaseHelper.addDatas(items)
            .then(() => {
                // setPhoneNumber('');
                loadData();
            })
            .catch((error: any) => {
                console.log(error);
                Alert.alert('Error', 'Failed to add data');
            });
        }
        
    };

    const deleteData = (id: any) => {
        if (Platform.OS === 'ios') {
            // 
            DatabaseModule.deleteDataWithID(id)
            .then(() => {
                        loadData();
                        console.log("DatabaseModule.addData")
                        Alert.alert('Success', 'OK Delete');
                    })
                    .catch((error: any) => {
                        console.log(error);
                        Alert.alert('Error', 'Failed Delete');
                    });
        }else if (Platform.OS === 'android') {
            DatabaseHelper.deleteData(id)
                .then(() => loadData())
                .catch((error: any) => {
                    console.log(error);
                    Alert.alert('Error', 'Failed to delete data');
                });
        }
    };

    const updateData = (editingId: any) => {
        if (Platform.OS === 'ios') {

            //  updateDataWithID
            if (editingId) {
                let id = editingId;
                let reporter =  'A1';
                DatabaseModule.updateDataWithID(id, phoneNumber, detail, reporter)
                    .then((response: any) => {
                        setPhoneNumber('');
                        setEditingId(null);
                        setDetail('')
                        loadData();
                        Alert.alert('Success', 'OK updateData');
                    })
                    .catch((error: any) => {
                        console.log(error);
                        Alert.alert('Error', 'Failed to update data');
                    });
            }
        }else if (Platform.OS === 'android') {
            if (editingId) {
                let updateItem = { id: editingId, phoneNumber, detail, reporter: 'A1' }
                DatabaseHelper.updateData(updateItem)
                    .then((response: any) => {
                        setPhoneNumber('');
                        setEditingId(null);
                        loadData();
                    })
                    .catch((error: any) => {
                        console.log(error);
                        Alert.alert('Error', 'Failed to update data');
                    });
            }
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
        <ApolloProvider client={client}>
            <SafeAreaView>
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
                    <Button title={"Adds"} onPress={()=> addDatas()} />
                    <FlatList
                        data={data}
                        keyExtractor={item => item.ID}
                        renderItem={({ item }) => (
                            <View>
                            <Text>{item.PHONE_NUMBER}: {item.DETAIL}</Text>
                            {/* <Button title="Add Datas" onPress={() => addDatas(items)} /> */}
                            <Button title="Delete" onPress={() => deleteData(item.ID)} />
                            <Button title="Update" onPress={() => updateData(item.ID)} />
                            <Button title="Get By ID" onPress={() => getDataByID(item.ID)} />
                            </View>
                        )}
                        // //  "DETAIL": "@1", "ID": 1, "PHONE_NUMBER": "0329424", "REPORTER": "A1"
                    />
                </View>
            </SafeAreaView>
        </ApolloProvider>
    );
};



export default App;
