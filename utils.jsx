import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to save an object by name
export const saveObject = async (name: string, object: any) => {
    try {
      const jsonValue = JSON.stringify(object);
      await AsyncStorage.setItem(name, jsonValue);
      console.log(`${name} saved successfully.`);
    } catch (e) {
      console.error('Error saving object:', e);
    }
};

export const getObject = async (name: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(name);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error retrieving object:', e);
      return null;
    }
};