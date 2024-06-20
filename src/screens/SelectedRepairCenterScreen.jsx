import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Dimensions, Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import MapView, { Callout, Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { MaterialIcons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons'
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet'
import PoppinsText from '../components/PoppinsText'
import { useHeaderHeight } from '@react-navigation/elements'
import MapViewDirections from 'react-native-maps-directions'
import { mainColor, secondryColor } from '../colors'
import SelectionButton from '../components/SelectionButton'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import AvailableTimesFlatListItem from '../components/AvailableTimesFlatListItem'
import showToast, { SMTH_WENT_WRONG } from '../components/Toast'
import CustomTextInput from '../components/CustomTextInput'
import { addReservation, getUpcomingReservations } from '../api/reservation'
import { validateDateAndTime, validateReservationTitle } from '../utils/inputValidations'
import ValidationMessage from '../components/ValidationMessage'
import UpcomingReservationFlatListItem from '../components/UpcomingReservationFlatListItem'
import { getRepairCenterById } from '../api/repairCenter'
import LoadingModal from '../components/LoadingModal'

const { height } = Dimensions.get('window')

const SelectedRepairCenterScreen = ({ route }) => {
    const { rc, id } = route.params
    const headerHeight = useHeaderHeight()

    const [repairCenter, setRepairCenter] = useState(rc)
    const [location, setLocation] = useState(null)
    const [mapPadding, setMapPadding] = useState(85)
    const [date, setDate] = useState({
        value: new Date(),
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [availableTimes, setAvailableTimes] = useState([])
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [selectedTimeInterval, setSelectedTimeInterval] = useState({ start: null, end: null })
    const [description, setDescription] = useState({
        value: '',
        isFocused: false
    })
    const [title, setTitle] = useState({
        value: '',
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [upcomingReservations, setUpcomingReservations] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const mapRef = useRef()
    const markerRef = useRef()
    const myLocationBtnBottom = useRef(new Animated.Value(0)).current
    const upcomingReservationsScrollViewRef = useRef()
    const newReservationScrollViewRef = useRef()

    const snappingPoints = useMemo(() => {
        return [0.35, 1 - headerHeight / height].map(percentage => percentage * height);
    }, [height]); //Snapping points must be in an ascending order

    const startOfDay = useMemo(() => {
        const sDate = new Date(date.value)
        sDate.setHours(12, 0, 0)
        return sDate
    }, [date.value.toISOString()])

    const endOfDay = useMemo(() => {
        const eDate = new Date(date.value)
        eDate.setHours(20, 59, 0)
        return eDate
    }, [date.value.toISOString()])

    const handleSheetChanges = useCallback(index => {
        Animated.spring(myLocationBtnBottom, {
            toValue: -snappingPoints[index],
            useNativeDriver: true
        }).start((finished) => {
            if (finished.value) {
                setMapPadding(-finished.value)
            }
        })
    }, [])

    const getCurrentLocation = async () => {
        const permission = await Location.getForegroundPermissionsAsync()

        if (permission.granted) {
            const location = await Location.getCurrentPositionAsync()

            setLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                longitudeDelta: 0.006866,
                latitudeDelta: 0.004757
            })
        }
    }

    const handleMyLocationBtn = () => {
        mapRef.current.animateToRegion(location)
    }

    const handleCallBtn = () => {
        if (Platform.OS === 'android')
            Linking.openURL(`tel:${repairCenter.phoneNumber}`)
        else if (Platform.OS === 'ios')
            Linking.openURL(`telprompt:${repairCenter.phoneNumber}`)
    }

    const openGPS = () => {
        if (Platform.OS == 'android') {
            Linking.openURL(`google.navigation:q=${repairCenter.location.coords.latitude},${repairCenter.location.coords.longitude}`)
        } else if (Platform.OS == 'ios') {
            Linking.openURL(`maps://app?saddr=${location.latitude},${location.longitude}&daddr=${repairCenter.location.coords.latitude},${repairCenter.location.coords.longitude}`)
        }
    }

    const onChangeDate = (_, selectedDate) => {
        setDate(prev => ({ ...prev, value: selectedDate }))
        setShowDatePicker(false)
    }

    const onChangeTime = (_, selectedDate) => {
        if (selectedDate >= selectedTimeInterval.start && selectedDate <= selectedTimeInterval.end) {
            setDate(prev => ({ ...prev, value: selectedDate }))
            newReservationScrollViewRef.current.scrollToEnd({ animated: true })
        } else {
            showToast(`You must pick a time between ${selectedTimeInterval.start.toLocaleTimeString()} and ${selectedTimeInterval.end.toLocaleTimeString()}`)
        }
        setShowTimePicker(false)
    }

    const handleSubmitOnPress = async () => {
        try {
            setIsLoading(true)
            const dateValidationResult = validateDateAndTime(date.value)
            const titleValidationResult = validateReservationTitle(title.value)

            setDate(prev => ({ ...prev, validation: dateValidationResult }))
            setTitle(prev => ({ ...prev, validation: titleValidationResult }))

            if (dateValidationResult.isValid && titleValidationResult.isValid) {
                const response = await addReservation(repairCenter._id, date.value, description.value, title.value)

                if (response.status === 201) {
                    const rcResponse = await getRepairCenterById(repairCenter._id)

                    if (rcResponse.status === 200) {
                        setRepairCenter(rcResponse.data.data)
                    }
                    setUpcomingReservations(prev => [...prev, response.data.newReservation].sort((a, b) => new Date(Date.parse(a.startDate)) - new Date(Date.parse(b.startDate))))
                    setTitle(prev => ({ ...prev, value: '' }))
                    setDescription(prev => ({ ...prev, value: '' }))
                    newReservationScrollViewRef.current.scrollTo({ y: 0, animated: true })
                    upcomingReservationsScrollViewRef.current.scrollToEnd({ animated: true })
                }
            }
        } catch (err) {
            console.log(err);
            showToast(SMTH_WENT_WRONG)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getCurrentLocation()
        repairCenter && getUpcomingReservations(repairCenter._id)
            .then(res => setUpcomingReservations(res.data.reservations))
            .catch(err => {
                console.log(err);
                showToast("Couldn't get your upcoming reservations. Please try again later.")
            })

        if (id) {
            getRepairCenterById(id)
                .then(res => setRepairCenter(res.data.data))
                .catch(err => {
                    console.log(err);
                    showToast("Couldn't get repair center info. Please try again later.")
                })

            getUpcomingReservations(id)
                .then(res => setUpcomingReservations(res.data.reservations))
                .catch(err => {
                    console.log(err);
                    showToast("Couldn't get your upcoming reservations. Please try again later.")
                })
        }
    }, [])

    useEffect(() => {
        if (mapRef)
            mapRef.current.fitToCoordinates([location, repairCenter?.location.coords])
    }, [mapRef, location, mapPadding])

    useEffect(() => {
        markerRef.current?.showCallout()
    }, [markerRef.current])

    useEffect(() => {
        if (repairCenter) {
            const filteredReservations = repairCenter.Reservations.filter(reservation => date.value.toDateString() === new Date(reservation.startDate).toDateString())
            filteredReservations.sort((a, b) => new Date(Date.parse(a.startDate)) - new Date(Date.parse(b.startDate)))
            let prevTime = startOfDay
            const availableTimes = []

            for (let i = 0; i < filteredReservations.length; i++) {
                const reservationStartDate = new Date(filteredReservations[i].startDate)

                if (prevTime < reservationStartDate) {
                    availableTimes.push({ start: prevTime, end: reservationStartDate })
                }
                prevTime = new Date(filteredReservations[i].endDate)
            }

            if (prevTime < endOfDay) {
                availableTimes.push({ start: prevTime, end: endOfDay })
            }

            setAvailableTimes(availableTimes)
        }
    }, [date.value.toDateString(), repairCenter?.Reservations.length])

    return (
        <View style={styles.container}>
            <LoadingModal visible={isLoading} />
            {
                showDatePicker && <DateTimePicker
                    value={date.value}
                    mode='date'
                    onChange={onChangeDate}
                />
            }
            {
                showTimePicker && <DateTimePicker
                    value={date.value}
                    mode='time'
                    onChange={onChangeTime}
                />
            }
            <MapView
                style={{ flex: 1 }}
                mapPadding={{ bottom: mapPadding, top: headerHeight + 50, left: 32 }}
                showsUserLocation
                showsMyLocationButton={false}
                initialRegion={location}
                ref={mapRef}
                provider='google'
            >
                <MapViewDirections
                    apikey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}
                    origin={location}
                    destination={repairCenter?.location.coords}
                    strokeColor={mainColor}
                    strokeWidth={4}
                />
                {
                    repairCenter && <Marker
                        coordinate={repairCenter.location.coords}
                        ref={markerRef}
                    >
                        <Callout>
                            <PoppinsText>{repairCenter?.name}</PoppinsText>
                        </Callout>
                    </Marker>
                }
            </MapView>
            <Animated.View style={{ bottom: snappingPoints[0] / 3, transform: [{ translateY: myLocationBtnBottom }], ...styles.myLocationBtnView }}>
                <TouchableOpacity style={styles.myLocationBtn} onPress={handleMyLocationBtn}>
                    <MaterialIcons name='my-location' style={styles.icon} />
                </TouchableOpacity>
            </Animated.View>
            <BottomSheet
                snapPoints={snappingPoints}
                index={0}
                onChange={handleSheetChanges}
            >
                <BottomSheetView style={styles.bottomSheetContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <View>
                            <PoppinsText style={styles.title}>{repairCenter?.name}</PoppinsText>
                            <PoppinsText style={styles.description}>{repairCenter?.description}</PoppinsText>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={{ ...styles.circleBtn, marginRight: 8 }}
                                onPress={handleCallBtn}>
                                <MaterialIcons name="call" size={26} color={mainColor} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.circleBtn}
                                onPress={openGPS}
                            >
                                <MaterialCommunityIcons name='map-marker' size={26} color={mainColor} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheetView>
                <BottomSheetScrollView style={styles.bottomSheetContainer} ref={newReservationScrollViewRef}>
                    {
                        upcomingReservations.length > 0 && <>
                            <PoppinsText>Upcoming reservations</PoppinsText>
                            <View style={{ flexDirection: 'row' }}>
                                <BottomSheetScrollView horizontal={true} ref={upcomingReservationsScrollViewRef}>
                                    {upcomingReservations.map(item => <UpcomingReservationFlatListItem item={item} key={item._id} />)}
                                </BottomSheetScrollView>
                            </View>
                        </>
                    }
                    <PoppinsText>Pick a date</PoppinsText>
                    <SelectionButton
                        Icon={() => <Ionicons name='calendar-outline' style={{ fontSize: 20, marginRight: 8, color: date.validation.isValid ? mainColor : 'red' }} />}
                        hasValidation={true}
                        placeholder={'Pick a date'}
                        state={date}
                        value={date.value.toDateString()}
                        onPress={() => setShowDatePicker(true)}
                    />
                    <ValidationMessage state={date} />
                    <View style={{ flexDirection: 'row' }}>
                        <PoppinsText>Pick a time</PoppinsText>
                        <PoppinsText style={{ color: '#666666', marginLeft: 8 }}>{date.value.toLocaleTimeString()}</PoppinsText>
                    </View>
                    {
                        availableTimes.length > 0 && <>
                            {availableTimes.map((item, index) => <AvailableTimesFlatListItem
                                item={item}
                                onPress={() => {
                                    setShowTimePicker(true)
                                    setSelectedTimeInterval(item)
                                }}
                                key={index}
                            />)
                            }
                            <View>
                                <CustomTextInput
                                    Icon={() => <AntDesign name='edit' style={{
                                        fontSize: 20,
                                        color: title.isFocused ?
                                            mainColor : title.validation.isValid ?
                                                '#ADADAD' : 'red',
                                        marginRight: 8
                                    }} />}
                                    onChangeText={e => setTitle(prev => ({ ...prev, value: e }))}
                                    onFocus={() => {
                                        setTitle(prev => ({ ...prev, isFocused: true }))
                                        newReservationScrollViewRef.current.scrollToEnd({ animated: true })
                                    }}
                                    onBlur={() => setTitle(prev => ({ ...prev, isFocused: false, validation: validateReservationTitle(prev.value) }))}
                                    placeholder={'Title'}
                                    state={title}
                                    hasValidation={true}
                                />
                                <ValidationMessage state={title} />
                                <CustomTextInput
                                    hasValidation={false}
                                    onChangeText={e => setDescription(prev => ({ ...prev, value: e }))}
                                    onBlur={() => setDescription(prev => ({ ...prev, isFocused: false }))}
                                    onFocus={() => {
                                        setDescription(prev => ({ ...prev, isFocused: true }))
                                        newReservationScrollViewRef.current.scrollToEnd({ animated: true })
                                    }}
                                    placeholder={'Description (optional)'}
                                    state={description}
                                    Icon={() => <Entypo name='text' style={{
                                        fontSize: 20,
                                        color: description.isFocused ?
                                            mainColor : '#ADADAD',
                                        marginRight: 8
                                    }} />}
                                    multiline={true}
                                />
                                <TouchableOpacity style={styles.btn} onPress={handleSubmitOnPress}>
                                    <PoppinsText style={{ color: mainColor }}>Submit</PoppinsText>
                                </TouchableOpacity>
                                <View style={{ height: 85 }} />
                            </View>
                        </>
                    }
                </BottomSheetScrollView>
            </BottomSheet>
        </View>
    )
}

export default SelectedRepairCenterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    myLocationBtnView: {
        position: 'absolute',
        right: 16
    },
    myLocationBtn: {
        backgroundColor: secondryColor,
        padding: 12,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    icon: {
        fontSize: 30,
        color: mainColor
    },
    bottomSheetContainer: {
        paddingHorizontal: 8,
    },
    title: {
        color: mainColor,
        fontSize: 20
    },
    circleBtn: {
        padding: 8,
        borderRadius: 50,
        backgroundColor: secondryColor
    },
    description: {
        color: '#969696'
    },
    btn: {
        borderRadius: 16,
        padding: 8,
        alignItems: 'center',
        marginTop: 8,
        backgroundColor: secondryColor
    }
})