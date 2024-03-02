import { StyleSheet, View } from 'react-native'
import PoppinsText from './PoppinsText'
import { MaterialIcons } from '@expo/vector-icons';

const NoOffers = () => {
    return (
        <View style={styles.container}>
            <MaterialIcons name='local-offer' style={styles.icon} />
            <PoppinsText style={styles.text}>We don't have any offers currently.</PoppinsText>
        </View>
    )
}

export default NoOffers

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