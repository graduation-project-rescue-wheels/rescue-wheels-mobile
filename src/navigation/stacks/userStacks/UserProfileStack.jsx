import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../../../screens/ProfileScreen";
import UserSettingsScreen from "../../../screens/UserSettingsScreen";
import UserVehiclesScreen from "../../../screens/UserVehiclesScreen";
import UserHistoryStack from "./UserHistoryStack";

const Stack = createNativeStackNavigator()

const UserProfileStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="Profile"
            screenOptions={{
                headerTitleStyle: {
                    fontFamily: 'Poppins-Medium'
                }
            }}
        >
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={UserSettingsScreen} />
            <Stack.Screen name="Your vehicles" component={UserVehiclesScreen} />
            <Stack.Screen name="History-stack" component={UserHistoryStack} options={{ title: 'History' }} />
        </Stack.Navigator>
    )
}

export default UserProfileStack