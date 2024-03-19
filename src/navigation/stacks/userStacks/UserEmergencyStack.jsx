import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EmergencyScreen from "../../../screens/EmergencyScreen";
import UserEmergencyMapScreen from "../../../screens/UserEmergencyMapScreen";

const Stack = createNativeStackNavigator()

const UserEmergencyStack = () => {
    return (
        <Stack.Navigator initialRouteName="Emergency">
            <Stack.Screen name="Emergency" component={EmergencyScreen} />
            <Stack.Screen name="Map" component={UserEmergencyMapScreen} options={{
                headerTransparent: true,
                headerTitle: ''
            }} />
        </Stack.Navigator>
    )
}

export default UserEmergencyStack