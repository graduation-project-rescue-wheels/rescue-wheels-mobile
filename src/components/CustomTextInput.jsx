import { StyleSheet, TextInput, View } from 'react-native'
import { mainColor } from '../colors'

const CustomTextInput = ({ hasValidation = false, state, placeholder, secureTextEntry, onChangeText, onFocus, onBlur, Icon, keyboardType, autoCapitalize }) => {
    return (
        <View style={{
            ...styles.inputView,
            borderColor: hasValidation ?
                state.isFocused ? mainColor :
                    state.validation.isValid ? '#ADADAD' : 'red' : state.isFocused ? mainColor : '#ADADAD'
        }}>
            <Icon />
            <TextInput
                placeholder={placeholder}
                value={state.value}
                secureTextEntry={secureTextEntry}
                onChangeText={onChangeText}
                style={styles.textInput}
                placeholderTextColor={'#ADADAD'}
                onFocus={onFocus}
                onBlur={onBlur}
                keyboardType={keyboardType}
                cursorColor={mainColor}
                autoCapitalize={autoCapitalize}
            />
        </View>
    )
}

export default CustomTextInput

const styles = StyleSheet.create({
    inputView: {
        width: '100%',
        borderWidth: 1,
        marginVertical: 16,
        borderRadius: 16,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        width: '100%',
        paddingVertical: 4,
        flex: 1,
        fontFamily: 'Poppins-Medium'
    }
})