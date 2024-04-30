import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RepairCentersScreen from "../../../screens/RepairCentersScreen";
import SelectedRepairCenterScreen from "../../../screens/SelectedRepairCenterScreen";

const Stack = createNativeStackNavigator()

const UserRepairCenterStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="repair centers" component={RepairCentersScreen} />
            <Stack.Screen name="selectedRc" component={SelectedRepairCenterScreen} />
        </Stack.Navigator>
    )
}

export default UserRepairCenterStack