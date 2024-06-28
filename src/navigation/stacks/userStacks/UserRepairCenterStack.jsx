import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RepairCentersScreen from "../../../screens/RepairCentersScreen";
import SelectedRepairCenterScreen from "../../../screens/SelectedRepairCenterScreen";

const Stack = createNativeStackNavigator()

const UserRepairCenterStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="repair centers"
            screenOptions={{
                headerTitleStyle: {
                    fontFamily: 'Poppins-Medium'
                }
            }}
        >
            <Stack.Screen name="repair centers" component={RepairCentersScreen} />
            <Stack.Screen
                name="selectedRc"
                component={SelectedRepairCenterScreen}
                options={{
                    headerTransparent: true,
                    headerTitle: ''
                }}
            />
        </Stack.Navigator>
    )
}

export default UserRepairCenterStack