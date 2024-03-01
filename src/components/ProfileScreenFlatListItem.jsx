import { StyleSheet, TouchableOpacity } from 'react-native'
import PoppinsText from './PoppinsText'

const ProfileScreenFlatListItem = ({ Icon, label, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
        >
            <Icon />
            <PoppinsText style={styles.label}>{label}</PoppinsText>
        </TouchableOpacity>
    )
}

export default ProfileScreenFlatListItem

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
        marginVertical: 4,
        borderWidth: 1,
        borderColor: '#ADADAD',
        borderRadius: 16
    },
    label: {
        marginLeft: 8,
        fontSize: 20
    }
})