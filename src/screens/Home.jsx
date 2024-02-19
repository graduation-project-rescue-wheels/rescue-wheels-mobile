import { Button, StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { signOut } from '../store/userSlice'

const Home = () => {
    const dispatch = useDispatch()

    return (
        <View>
            <Button
                title='Sign out'
                onPress={() => dispatch(signOut())}
            />
        </View>
    )
}

export default Home

const styles = StyleSheet.create({})