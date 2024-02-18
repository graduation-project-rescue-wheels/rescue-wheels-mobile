import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import SignupScreen from './src/screens/SignupScreen';
import ForgotPassword from './src/screens/ForgotScreen';
import ResetPassword from './src/screens/ResetPassword';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* <LoginScreen /> */}
      {/* <SignupScreen /> */}
      {/* <ForgotPassword /> */}
      <ResetPassword />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
