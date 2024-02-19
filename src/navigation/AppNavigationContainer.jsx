import { NavigationContainer } from "@react-navigation/native"
import AuthStack from "./AuthStack"
import { useSelector } from "react-redux"
import Home from "../screens/Home"

const AppNavigationContainer = () => {
    const { user } = useSelector(state => state.user)

    return (
        <NavigationContainer>
            {
                user === null ? <AuthStack /> : <Home />
            }
        </NavigationContainer>
    )
}

export default AppNavigationContainer