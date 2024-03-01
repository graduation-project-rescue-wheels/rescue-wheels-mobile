import { StyleSheet, View } from 'react-native'
import PoppinsText from './PoppinsText'
import { MaterialIcons } from '@expo/vector-icons'

const NoHistory = ({ message }) => {
    return (
        <View style={styles.container}>
            <MaterialIcons
                name='history'
                style={styles.icon}
            />
            <PoppinsText style={styles.text}>{message}</PoppinsText>
        </View>
    )
}

export default NoHistory

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 16,
        flex: 1
    },
    icon: {
        fontSize: 40,
        color: '#666666'
    },
    text: {
        color: '#666666'
    }
})