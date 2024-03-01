import { NavigationContainer } from "@react-navigation/native"
import AuthStack from "./stacks/AuthStack"
import { useDispatch, useSelector } from "react-redux"
import { useLayoutEffect } from "react"
import { loadUserAsync } from "../store/userSlice"
import UserHomeScreen from "../screens/UserHomeScreen"

const AppNavigationContainer = () => {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()

    useLayoutEffect(() => {
        dispatch(loadUserAsync())
    }, [])

    return (
        <NavigationContainer>
            {
                user === null ? <AuthStack /> : <UserHomeScreen />
            }
        </NavigationContainer>
    )
}

export default AppNavigationContainer