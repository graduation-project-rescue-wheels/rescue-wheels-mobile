import { FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import HistoryFlatListItem from '../components/HistoryFlatListItem'
import HistoryFlatListEmptyComponent from '../components/HistoryFlatListEmptyComponent'
import { useEffect, useState } from 'react'
import { mainColor } from '../colors'
import { getUserHistory } from '../api/EmergencyRequest'
import showToast from '../components/Toast'

const HistoryScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [requests, setRequests] = useState([])

    const fetchRequests = async () => {
        try {
            setIsLoading(true)
            const response = await getUserHistory()

            if (response.status === 200) {
                setRequests(response.data.requests)
            }
        } catch (err) {
            console.log(err);
            showToast("Couldn't load your history. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
                data={requests}
                renderItem={({ item }) => <HistoryFlatListItem item={item} onPress={() => navigation.navigate('selectedHistory', { item })} />}
                keyExtractor={(item, _) => item._id}
                ListFooterComponent={<View style={{ height: 80 }} />}
                ListEmptyComponent={<HistoryFlatListEmptyComponent />}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchRequests} colors={[mainColor]} />}
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