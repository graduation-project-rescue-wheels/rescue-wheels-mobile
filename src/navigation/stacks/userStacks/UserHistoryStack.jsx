import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HistoryScreen from '../../../screens/HistoryScreen'
import RepairCenterHistory from "../../../screens/RepairCenterHistory";
import HistoryTabBar from "../../tab_bars/HistoryTabBar";
import UserEmergencyHistoryStack from "./UserEmergencyHistoryStack";
import { useSelector } from "react-redux";

const Tab = createMaterialTopTabNavigator()

const UserHistoryStack = () => {
    const { user } = useSelector(state => state.user)
    return (
        <Tab.Navigator
            initialRouteName="EmergencyStack"
            tabBar={(props) => <HistoryTabBar {...props} />}
        >
            <Tab.Screen name="EmergencyStack" component={UserEmergencyHistoryStack} options={{ title: 'Emergency' }} />
            {user.role === 'User' && <Tab.Screen name="Repair centers" component={RepairCenterHistory} />}
        </Tab.Navigator>
    )
}

export default UserHistoryStack