import { StyleSheet, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import PoppinsText from './PoppinsText'

const HistoryFlatListEmptyComponent = () => {
    return (
        <View style={styles.container}>
            <MaterialIcons name='history' style={{ fontSize: 30 }} />
            <PoppinsText>Your previous requests will appear here</PoppinsText>
        </View>
    )
}

export default HistoryFlatListEmptyComponent

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    }
})