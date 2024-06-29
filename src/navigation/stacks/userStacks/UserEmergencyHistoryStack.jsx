import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HistoryScreen from "../../../screens/HistoryScreen";
import SelectedHistoryScreen from "../../../screens/SelectedHistoryScreen";

const Stack = createNativeStackNavigator()

const UserEmergencyHistoryStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Emergency" component={HistoryScreen} />
            <Stack.Screen name="SelectedHistory" component={SelectedHistoryScreen} />
        </Stack.Navigator>
    )
}

export default UserEmergencyHistoryStack