import { StyleSheet, TextInput, View } from 'react-native'

const CustomTextInput = ({ state, placeholder, secureTextEntry, onChangeText, onFocus, onBlur, Icon, keyboardType }) => {
    return (
        <View style={{
            ...styles.inputView,
            borderColor: state.isFocused ? '#E48700' : state.validation.isValid ? '#ADADAD' : 'red'
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