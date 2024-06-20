import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../../../screens/ProfileScreen";
import UserSettingsScreen from "../../../screens/UserSettingsScreen";
import UserVehiclesScreen from "../../../screens/UserVehiclesScreen";
import HistoryScreen from "../../../screens/HistoryScreen";
import SelectedHistoryScreen from "../../../screens/SelectedHistoryScreen";

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
            <Stack.Screen
                name="selectedHistory"
                component={SelectedHistoryScreen}
                options={{
                    headerTransparent: true,
                    headerTitle: ''
                }}
            />
        </Stack.Navigator>
    )
}

export default UserProfileStack