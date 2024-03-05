import { NavigationContainer } from "@react-navigation/native"
import { useDispatch, useSelector } from "react-redux"
import { Suspense, lazy, useLayoutEffect } from "react"
import { loadUserAsync } from "../store/userSlice"

const AuthStack = lazy(() => import('../navigation/stacks/AuthStack'))
const UserStack = lazy(() => import('../navigation/stacks/UserStack'))

const AppNavigationContainer = () => {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()

    useLayoutEffect(() => {
        dispatch(loadUserAsync())
    }, [])

    return (
        <Suspense>
            <NavigationContainer>
                {
                    user === null ? <AuthStack /> : <UserStack />
                }
            </NavigationContainer>
        </Suspense>
    )
}

export default AppNavigationContainer