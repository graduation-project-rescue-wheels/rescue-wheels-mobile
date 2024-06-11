import { FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import HistoryFlatListItem from '../components/HistoryFlatListItem'
import HistoryFlatListEmptyComponent from '../components/HistoryFlatListEmptyComponent'
import { useState } from 'react'
import { loadUserAsync } from '../store/userAsyncThunks'
import { mainColor } from '../colors'

const HistoryScreen = ({navigation}) => {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const onRefresh = () => {
        setIsLoading(true)
        dispatch(loadUserAsync())
        setIsLoading(false)
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={[...user.Requests_IDS].reverse().map(e => {
                    return e
                })}
                renderItem={({ item }) => <HistoryFlatListItem item={item} onPress={() => navigation.navigate('selectedHistory', { sHistory: item })} />}
                keyExtractor={(item, _) => item}
                ListFooterComponent={<View style={{ height: 80 }} />}
                ListEmptyComponent={<HistoryFlatListEmptyComponent />}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={[mainColor]} />}
            />
        </View>
    )
}

export default HistoryScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8,
        backgroundColor: 'white'
    }
})