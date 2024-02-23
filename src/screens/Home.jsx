import { Button, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { signOutAsync } from '../store/userSlice'

const Home = () => {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()

    return (
        <View>
            <Text>{user.email}</Text>
            <Button
                title='Sign out'
                onPress={() => dispatch(signOutAsync())}
            />
        </View>
    )
}

export default Home

const styles = StyleSheet.create({})