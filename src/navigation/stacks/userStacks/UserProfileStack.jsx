import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../../../screens/ProfileScreen";
import UserSettingsScreen from "../../../screens/UserSettingsScreen";
import UserVehiclesScreen from "../../../screens/UserVehiclesScreen";
import HistoryScreen from "../../../screens/HistoryScreen";

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
            <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
    )
}

export default UserProfileStack