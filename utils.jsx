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

export const getDate = (timestamp, format: string = 'MM/DD'): string => {
  const today = new Date(timestamp);
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero
  const year = today.getFullYear();
  const date = today.getDate().toString().padStart(2, '0'); // Add leading zero
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = today.getHours().toString().padStart(2, '0'); // Add leading zero
  const minutes = today.getMinutes().toString().padStart(2, '0'); // Add leading zero
  const day = dayNames[today.getDay()]; // Get the day name (e.g., 'Thu')

  switch (format) {
    case 'DD/MM':
      return `${date}/${month}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${date}`;
    case 'YYYY/MM/DD Day HH:mm':
      return `${year}/${month}/${date} ${day} ${hours}:${minutes}`;
    default: // 'MM/DD'
      return `${month}/${date}`;
  }
}

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  return `${day}/${month}`;
};
