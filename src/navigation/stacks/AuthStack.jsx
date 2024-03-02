import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../../screens/LoginScreen'
import SignupScreen from '../../screens/SignupScreen'
import ForgotScreen from '../../screens/ForgotScreen'
import ResetPassword from '../../screens/ResetPassword'

const Stack = createNativeStackNavigator()

const AuthStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name='Sign in' component={LoginScreen} />
            <Stack.Screen name='Sign up' component={SignupScreen} />
            <Stack.Screen name='Forgot password' component={ForgotScreen} />
            <Stack.Screen name='Reset password' component={ResetPassword} />
        </Stack.Navigator>
    )
}

export default AuthStack