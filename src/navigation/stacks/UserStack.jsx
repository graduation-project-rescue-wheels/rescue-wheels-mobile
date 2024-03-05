import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import UserHomeScreen from "../../screens/UserHomeScreen"
import UserTabBar from "../tab_bars/UserTabBar"
import UserProfileStack from "./UserProfileStack"

const Tab = createBottomTabNavigator()

const UserStack = () => {
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