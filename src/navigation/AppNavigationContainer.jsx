import { NavigationContainer } from "@react-navigation/native"
import AuthStack from "./AuthStack"
import { useDispatch, useSelector } from "react-redux"
import Home from "../screens/Home"
import { useLayoutEffect } from "react"
import { loadUserAsync } from "../store/userSlice"

const AppNavigationContainer = () => {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()

    useLayoutEffect(() => {
        dispatch(loadUserAsync())
    }, [])

    return (
        <NavigationContainer>
            {
                user === null ? <AuthStack /> : <Home />
            }
        </NavigationContainer>
    )
}

export default AppNavigationContainer