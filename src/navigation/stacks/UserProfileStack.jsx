import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../../screens/ProfileScreen";
import UserSettingsScreen from "../../screens/UserSettingsScreen";

const Stack = createNativeStackNavigator()

const UserProfileStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleStyle: {
                    fontFamily: 'Poppins-Medium'
                }
            }}
        >
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={UserSettingsScreen} />
        </Stack.Navigator>
    )
}

export default UserProfileStack