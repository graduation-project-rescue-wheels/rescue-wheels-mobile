import { StyleSheet, TouchableOpacity, View } from "react-native"
import CustomModal from "./CustomModal"
import PoppinsText from "./PoppinsText"
import CustomTextInput from "./CustomTextInput"
import { useState } from "react"
import { MaterialIcons, FontAwesome, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import SelectionButton from "./SelectionButton"
import { validateLicensePlate, validateModelYear, validateVehicleEnergySource, validateVehicleMaker, validateVehicleModel, validateVehicleType } from "../utils/inputValidations"
import { useDispatch } from "react-redux"
import ValidationMessage from "./ValidationMessage"
import { addVehicleAsync } from "../store/userAsyncThunks"
import { mainColor } from "../colors"

const AddVehicleModal = ({ onRequestClose, visible }) => {
    const [make, setMake] = useState({
        value: '',
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [model, setModel] = useState({
        value: '',
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [licensePlate, setLicensePlate] = useState({
        value: '',
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [modelYear, setModelYear] = useState({
        value: '',
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [type, setType] = useState({
        value: '',
        validation: {
            isValid: true,
            message: ''
        },
        Icon: null
    })
    const [energySource, setEnergySource] = useState({
        value: '',
        validation: {
            isValid: true,
            message: ''
        },
        Icon: null
    })
    const [typeModalVisible, setTypeModalVisible] = useState(false)
    const [energySourceModalVisible, setEnergySourceModalVisible] = useState(false)
    const dispatch = useDispatch()

    const handleMakeTextInputOnBlur = () => {
        setMake(prev => ({
            ...prev,
            validation: validateVehicleMaker(make.value),
            isFocused: false
        }))
    }

    const handleModelTextInputonBlur = () => {
        setModel(prev => ({
            ...prev,
            validation: validateVehicleModel(model.value),
            isFocused: false
        }))
    }

    const handleLicensePlateTextInputOnBlur = () => {
        setLicensePlate(prev => ({
            ...prev,
            validation: validateLicensePlate(licensePlate.value),
            isFocused: false
        }))
    }

    const handleMoedlYearTextInPutOnBlur = () => {
        setModelYear(prev => ({
            ...prev,
            validation: validateModelYear(modelYear.value),
            isFocused: false
        }))
    }

    const handleAddBtnOnPress = () => {
        const makeValidationResult = validateVehicleMaker(make.value)
        const modelValidationResult = validateVehicleModel(model.value)
        const licensePlateValidationResult = validateLicensePlate(licensePlate.value)
        const modelYearValidationResult = validateModelYear(modelYear.value)
        const typeValidationResult = validateVehicleType(type.value)
        const energySourceValidationResult = validateVehicleEnergySource(energySource.value)

        setMake(prev => ({
            ...prev,
            validation: makeValidationResult
        }))
        setModel(prev => ({
            ...prev,
            validation: modelValidationResult
        }))
        setLicensePlate(prev => ({
            ...prev,
            validation: licensePlateValidationResult
        }))
        setModelYear(prev => ({
            ...prev,
            validation: modelYearValidationResult
        }))
        setType(prev => ({
            ...prev,
            validation: typeValidationResult
        }))
        setEnergySource(prev => ({
            ...prev,
            validation: energySourceValidationResult
        }))

        if (makeValidationResult.isValid &&
            modelValidationResult.isValid &&
            licensePlateValidationResult.isValid &&
            modelYearValidationResult.isValid &&
            typeValidationResult.isValid &&
            energySourceValidationResult.isValid) {
            dispatch(addVehicleAsync({
                make: make.value,
                model: model.value,
                licensePlate: licensePlate.value,
                type: type.value,
                energySource: energySource.value,
                modelYear: modelYear.value,
                onRequestClose
            }))
        }
    }

    return (
        <CustomModal
            onRequestClose={onRequestClose}
            visible={visible}
        >
            {/*type modal*/}
            <CustomModal
                visible={typeModalVisible}
                onRequestClose={() => setTypeModalVisible(false)}
            >
                <PoppinsText style={styles.title}>Select type</PoppinsText>
                <SelectionButton
                    Icon={() => <AntDesign name="car" style={styles.icon} />}
                    value={'car'}
                    onPress={() => {
                        setType(prev => ({
                            ...prev,
                            value: 'car',
                            Icon: () => <AntDesign name="car" style={styles.icon} />
                        }))
                        setTypeModalVisible(false)
                    }}
                />
                <SelectionButton
                    Icon={() => <MaterialIcons name="motorcycle" style={styles.icon} />}
                    value={'motorcycle'}
                    onPress={() => {
                        setType(prev => ({
                            ...prev,
                            value: 'motorcycle',
                            Icon: () => <MaterialIcons name="motorcycle" style={styles.icon} />
                        }))
                        setTypeModalVisible(false)
                    }}
                />
                <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={() => {
                        setTypeModalVisible(false)
                        setType(prev => ({ ...prev, value: '', Icon: null }))
                    }}
                >
                    <PoppinsText style={{ ...styles.modalBtnText, color: '#ADADAD' }}>Cancel</PoppinsText>
                </TouchableOpacity>
            </CustomModal>
            {/*energy source modal */}
            <CustomModal
                visible={energySourceModalVisible}
                onRequestClose={() => setEnergySourceModalVisible(false)}
            >
                <PoppinsText style={styles.title}>Select energy source</PoppinsText>
                <SelectionButton
                    Icon={() => <MaterialCommunityIcons name="fuel" style={styles.icon} />}
                    value={'petrol'}
                    onPress={() => {
                        setEnergySource(prev => ({
                            ...prev,
                            value: 'petrol',
                            Icon: () => <MaterialCommunityIcons name="fuel" style={styles.icon} />
                        }))
                        setEnergySourceModalVisible(false)
                    }}
                />
                <SelectionButton
                    Icon={() => <MaterialCommunityIcons name="fuel" style={styles.icon} />}
                    value={'diesel'}
                    onPress={() => {
                        setEnergySource(prev => ({
                            ...prev,
                            value: 'diesel',
                            Icon: () => <MaterialCommunityIcons name="fuel" style={styles.icon} />
                        }))
                        setEnergySourceModalVisible(false)
                    }}
                />
                <SelectionButton
                    Icon={() => <MaterialCommunityIcons name="ev-plug-type2" style={styles.icon} />}
                    value={'EV'}
                    onPress={() => {
                        setEnergySource(prev => ({
                            ...prev,
                            value: 'EV',
                            Icon: () => <MaterialCommunityIcons name="ev-plug-type2" style={styles.icon} />
                        }))
                        setEnergySourceModalVisible(false)
                    }}
                />
                <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={() => {
                        setEnergySourceModalVisible(false)
                        setEnergySource(prev => ({ ...prev, value: '', Icon: null }))
                    }}
                >
                    <PoppinsText style={{ ...styles.modalBtnText, color: '#ADADAD' }}>Cancel</PoppinsText>
                </TouchableOpacity>
            </CustomModal>
            <PoppinsText style={styles.title}>Add vehicle</PoppinsText>
            <View style={styles.flexRow}>
                <View style={{ ...styles.columnView, marginRight: 16 }}>
                    <PoppinsText>Vehicle make</PoppinsText>
                    <CustomTextInput
                        state={make}
                        Icon={() => <MaterialIcons name="drive-file-rename-outline"
                            style={{
                                ...styles.icon,
                                color: make.isFocused ? mainColor : make.validation.isValid ? '#ADADAD' : 'red'
                            }}
                        />}
                        onChangeText={e => setMake(prev => ({ ...prev, value: e }))}
                        placeholder={'Make'}
                        onBlur={handleMakeTextInputOnBlur}
                        onFocus={() => setMake(prev => ({ ...prev, isFocused: true }))}
                    />
                    <ValidationMessage state={make} />
                </View>
                <View style={styles.columnView}>
                    <PoppinsText>Vehicle model</PoppinsText>
                    <CustomTextInput
                        state={model}
                        Icon={() => <MaterialIcons name="drive-file-rename-outline"
                            style={{
                                ...styles.icon,
                                color: model.isFocused ? mainColor : model.validation.isValid ? '#ADADAD' : 'red'
                            }}
                        />}
                        onChangeText={e => setModel(prev => ({ ...prev, value: e }))}
                        placeholder={'Model'}
                        onBlur={handleModelTextInputonBlur}
                        onFocus={() => setModel(prev => ({ ...prev, isFocused: true }))}
                    />
                    <ValidationMessage state={model} />
                </View>
            </View>
            <View style={styles.flexRow}>
                <View style={styles.columnView}>
                    <PoppinsText style={styles.label}>License plate</PoppinsText>
                    <CustomTextInput
                        Icon={() => <FontAwesome name="drivers-license-o"
                            style={{
                                ...styles.icon,
                                color: licensePlate.isFocused ? mainColor : licensePlate.validation.isValid ? '#ADADAD' : 'red'
                            }}
                        />}
                        state={licensePlate}
                        onChangeText={e => setLicensePlate(prev => ({ ...prev, value: e }))}
                        placeholder={'License plate'}
                        onBlur={handleLicensePlateTextInputOnBlur}
                        onFocus={() => setLicensePlate(prev => ({ ...prev, isFocused: true }))}
                    />
                    <ValidationMessage state={licensePlate} />
                </View>
                <View style={styles.columnView}>
                    <PoppinsText style={styles.label}>Production year</PoppinsText>
                    <CustomTextInput
                        state={modelYear}
                        Icon={() => <AntDesign name="calendar"
                            style={{
                                ...styles.icon,
                                color: modelYear.isFocused ? mainColor : modelYear.validation.isValid ? '#ADADAD' : 'red'
                            }}
                        />}
                        onChangeText={e => setModelYear(prev => ({ ...prev, value: e }))}
                        placeholder={'YYYY'}
                        onBlur={handleMoedlYearTextInPutOnBlur}
                        onFocus={() => setModelYear(prev => ({ ...prev, isFocused: true }))}
                        keyboardType={'numeric'}
                    />
                    <ValidationMessage state={modelYear} />
                </View>
            </View>
            <View style={styles.flexRow}>
                <View style={{ ...styles.columnView, marginRight: 16 }}>
                    <PoppinsText>Select vehicle type</PoppinsText>
                    <SelectionButton
                        state={type}
                        Icon={() => type.Icon === null ? <AntDesign
                            name="select1"
                            style={{
                                ...styles.icon, color: type.isFocused ?
                                    mainColor : type.validation.isValid ? '#ADADAD' : 'red'
                            }}
                        /> : <type.Icon />}
                        placeholder={'Type'}
                        onPress={() => setTypeModalVisible(true)}
                        hasValidation={true}
                        value={type.value}
                    />
                    <ValidationMessage state={type} />
                </View>
                <View style={styles.columnView}>
                    <PoppinsText>Select energy source</PoppinsText>
                    <SelectionButton
                        state={energySource}
                        Icon={() => energySource.Icon === null ? <AntDesign
                            name="select1"
                            style={{
                                ...styles.icon, color: energySource.isFocused ?
                                    mainColor : energySource.validation.isValid ? '#ADADAD' : 'red'
                            }}
                        /> : <energySource.Icon />}
                        placeholder={'Energy source'}
                        onPress={() => setEnergySourceModalVisible(true)}
                        hasValidation={true}
                        value={energySource.value}
                    />
                    <ValidationMessage state={energySource} />
                </View>
            </View>
            <View style={styles.flexRow}>
                <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={onRequestClose}
                >
                    <PoppinsText style={{ ...styles.modalBtnText, color: '#ADADAD' }}>Cancel</PoppinsText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={handleAddBtnOnPress}
                >
                    <PoppinsText style={{ ...styles.modalBtnText, color: 'green' }}>Add</PoppinsText>
                </TouchableOpacity>
            </View>
        </CustomModal>
    )
}

export default AddVehicleModal

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        paddingBottom: 8
    },
    icon: {
        paddingRight: 8,
        fontSize: 20
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    columnView: {
        width: '49%',
        justifyContent: 'space-between'
    },
    label: {
        alignSelf: 'flex-start'
    },
    modalBtnText: {
        fontSize: 12
    },
    modalBtn: {
        padding: 8
    }
})