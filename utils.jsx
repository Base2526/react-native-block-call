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

export const getDate = (format: string = 'MM/DD'): string =>{
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero
  const year = today.getFullYear();
  const date = today.getDate().toString().padStart(2, '0'); // Add leading zero

  switch (format) {
    case 'DD/MM':
      return `${date}/${month}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${date}`;
    default: // 'MM/DD'
      return `${month}/${date}`;
  }
}