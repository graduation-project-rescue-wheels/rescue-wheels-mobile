import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../../../screens/ProfileScreen";
import UserSettingsScreen from "../../../screens/UserSettingsScreen";
import UserVehiclesScreen from "../../../screens/UserVehiclesScreen";

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
            <Stack.Screen name="Your vehicles" component={UserVehiclesScreen} />
        </Stack.Navigator>
    )
}

export default UserProfileStack