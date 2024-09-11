/**
 * @format
 */
import 'react-native-gesture-handler';

import {AppRegistry, SafeAreaView, Text} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => <SafeAreaView style={styles.container}>
<Text style={styles.text}>Hello World!</Text>
</SafeAreaView>);
