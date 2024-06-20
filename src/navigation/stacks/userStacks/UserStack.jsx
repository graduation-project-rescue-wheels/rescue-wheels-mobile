import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import UserHomeScreen from "../../../screens/UserHomeScreen"
import UserTabBar from "../../tab_bars/UserTabBar"
import UserProfileStack from "./UserProfileStack"
import UserEmergencyStack from "./UserEmergencyStack"
import UserRepairCenterStack from "./UserRepairCenterStack"
import * as Notifications from 'expo-notifications'
import { useEffect } from "react"
import { registerForNotifications } from "../../../utils/notifications"

const Tab = createBottomTabNavigator()

const UserStack = () => {
    useEffect(() => {
        Notifications.getPermissionsAsync().then(async permission => {
            if (permission.granted) {
                await registerForNotifications()
                console.log('registered');
            } else {
                const permissionResult = await Notifications.requestPermissionsAsync()

                if (permissionResult.granted) {
                    await registerForNotifications()
                }
            }
        })
    }, [])

    return (
        <Tab.Navigator
            initialRouteName="Home"
            tabBar={(props) => <UserTabBar {...props} />}
            screenOptions={{
                headerTitleStyle: {
                    fontFamily: 'Poppins-Medium'
                }
            }}
        >
            <Tab.Screen name="Home" component={UserHomeScreen} />
            <Tab.Screen name="Emergency-stack" component={UserEmergencyStack}
                options={{
                    headerShown: false
                }}
            />
            <Tab.Screen name="RC-Stack" component={UserRepairCenterStack}
                options={{
                    headerShown: false
                }}
            />
            <Tab.Screen
                name="Profile-stack"
                component={UserProfileStack}
                options={{
                    headerShown: false
                }}
            />
        </Tab.Navigator>
    )
}

export default UserStack