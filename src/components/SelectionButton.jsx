import { StyleSheet, TouchableOpacity } from 'react-native'
import PoppinsText from './PoppinsText'

const SelectionButton = ({ state, Icon, onPress, placeholder, hasValidation, value }) => {
    return (
        <TouchableOpacity style={{
            ...styles.selectionBtn,
            borderColor: hasValidation ?
                state.validation.isValid ? '#ADADAD' : 'red' : 'black'
        }}
            onPress={onPress}
        >
            <Icon />
            {
                value.length === 0 ?
                    <PoppinsText style={{ color: '#ADADAD' }}>{placeholder}</PoppinsText> : <PoppinsText>{value}</PoppinsText>
            }
        </TouchableOpacity>
    )
}

export default SelectionButton

const styles = StyleSheet.create({
    selectionBtn: {
        width: '100%',
        borderWidth: 1,
        marginVertical: 16,
        borderRadius: 16,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
    }
})