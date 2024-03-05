import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import PoppinsText from './PoppinsText'
import { AntDesign } from '@expo/vector-icons'
import { useEffect, useRef } from 'react'

const EditableText = ({ Icon, state, onChangeText, keyboardType, placeholder, setState, onBlur }) => {
    const inputRef = useRef()

    useEffect(() => {
        if (state.editable && inputRef.current) {
            inputRef.current.focus()
        } else if (!state.editable && inputRef.current) {
            inputRef.current.blur()
        }
    }, [state.editable])

    return (
        <View style={styles.container}>
            <View style={{
                ...styles.infoView,
                borderColor: state.editable ?
                    '#E48700' : state.validation.isValid ? '#ADADAD' : 'red'
            }}>
                <Icon />
                {state.editable ?
                    <View style={styles.flexRow}>
                        <TextInput
                            value={state.value}
                            onChangeText={onChangeText}
                            keyboardType={keyboardType}
                            placeholder={placeholder}
                            style={styles.textInput}
                            ref={inputRef}
                            onBlur={() => {
                                onBlur()
                                setState(prev => ({
                                    ...prev,
                                    editable: false
                                }))
                            }}
                        />
                        <TouchableOpacity
                            style={styles.editableBtn}
                            onPress={() => setState(prev => ({ ...prev, editable: false }))}
                        >
                            <AntDesign name='closecircleo' />
                        </TouchableOpacity>
                    </View> : <View style={styles.flexRow}>
                        {
                            state.value.length === 0 ?
                                <PoppinsText style={styles.placeholder}>First name</PoppinsText> :
                                <PoppinsText>{state.value}</PoppinsText>
                        }
                        <TouchableOpacity
                            style={styles.editableBtn}
                            onPress={() => {
                                setState(prev => ({ ...prev, editable: true }))
                            }}
                        >
                            <AntDesign name='edit' style={styles.editableIcon} />
                        </TouchableOpacity>
                    </View>
                }
            </View>
            {
                !state.validation.isValid && <PoppinsText style={styles.validationMessageText}>{state.validation.message}</PoppinsText>
            }
        </View>
    )
}

export default EditableText

const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1
    },
    editableBtn: {
        padding: 8
    },
    editableIcon: {
        color: '#666666',
        fontSize: 16
    },
    textInput: {
        fontFamily: 'Poppins-Medium',
        flex: 1
    },
    validationMessageText: {
        color: 'red'
    },
    infoView: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 16,
        padding: 8,
        marginBottom: 8
    },
    placeholder: {
        color: '#ADADAD'
    }
})