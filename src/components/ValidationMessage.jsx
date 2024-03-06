import { StyleSheet } from 'react-native'
import PoppinsText from './PoppinsText'

const ValidationMessage = ({ state }) => {
    return state.validation.isValid ?
        null : <PoppinsText style={styles.validationMessageText}>{state.validation.message}</PoppinsText>
}

export default ValidationMessage

const styles = StyleSheet.create({
    validationMessageText: {
        color: 'red',
        marginBottom: 16,
        alignSelf: 'flex-start'
    }
})