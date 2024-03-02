import { StyleSheet, View } from 'react-native'
import PoppinsText from './PoppinsText'
import { MaterialIcons } from '@expo/vector-icons';

const NoVehicles = ({ onPress }) => {
    return (
        <View style={styles.container}>
            <MaterialIcons name='car-crash' style={styles.icon} />
            <PoppinsText style={styles.text}>You don't have any registered vehicles. <PoppinsText
                style={{ color: '#E48700' }}
                onPress={onPress}
            >
                Add vehicle
            </PoppinsText>
            </PoppinsText>
        </View>
    )
}

export default NoVehicles

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