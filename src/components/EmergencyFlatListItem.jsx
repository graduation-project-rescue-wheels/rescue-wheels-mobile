import { StyleSheet, TouchableOpacity } from 'react-native'
import PoppinsText from './PoppinsText'

const EmergencyFlatListItem = ({ label, Icon, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
        >
            <Icon />
            <PoppinsText>{label}</PoppinsText>
        </TouchableOpacity>
    )
}

export default EmergencyFlatListItem

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 16,
        borderColor: '#ADADAD',
        padding: 8,
        width: '100%',
        marginBottom: 8
    }
})