import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HistoryScreen from '../../../screens/HistoryScreen'
import RepairCenterHistory from "../../../screens/RepairCenterHistory";
import HistoryTabBar from "../../tab_bars/HistoryTabBar";

const Tab = createMaterialTopTabNavigator()

const UserHistoryStack = () => {
    return (
        <Tab.Navigator
            initialRouteName="Emergency"
            tabBar={(props) => <HistoryTabBar {...props} />}
        >
            <Tab.Screen name="Emergency" component={HistoryScreen} />
            <Tab.Screen name="Repair centers" component={RepairCenterHistory} />
        </Tab.Navigator>
    )
}

export default UserHistoryStack