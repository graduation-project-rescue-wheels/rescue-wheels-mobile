import { useEffect } from 'react'
import TechnicianHomeScreen from '../../../screens/TechnicianHomeScreen'
import TechnicianRequestsMapScreen from '../../../screens/TechnicianRequestsMapScreen'
import UserProfileStack from '../userStacks/UserProfileStack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import TechnicianTabBar from '../../tab_bars/TechnicianTabBar'
import * as Notifications from 'expo-notifications'
import { registerForNotifications } from '../../../utils/notifications'

const Tab = createBottomTabNavigator()

const TechnicianStack = () => {
    useEffect(() => {
        Notifications.getPermissionsAsync().then(async permission => {
            if (permission.granted) {
                await registerForNotifications()
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
            tabBar={(props) => <TechnicianTabBar {...props} />}
            screenOptions={{
                headerTitleStyle: {
                    fontFamily: 'Poppins-Medium'
                }
            }}
        >
            <Tab.Screen name="Home" component={TechnicianHomeScreen} />
            <Tab.Screen name="Emergency-stack" component={TechnicianRequestsMapScreen}
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

export default TechnicianStack