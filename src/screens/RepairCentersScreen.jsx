import { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native'
import { getAllRepairCenters } from '../api/repairCenter'
import RepairCenterFlatListItem from '../components/RepairCenterFlatListItem'
import CustomTextInput from '../components/CustomTextInput'
import { Feather, AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'
import { SORT_ALPHABETICALLY, SORT_BY_LOCATION } from '../utils/constants'
import { calculateDistance } from '../utils/locations'
import * as Location from 'expo-location'
import showToast, { LOCATION_PERMISSION_DENIED } from '../components/Toast'
import PoppinsText from '../components/PoppinsText'

const RepairCentersScreen = ({ navigation }) => {
    const [repairCenters, setRepairCenters] = useState([])
    const [searchQuery, setsearchQuery] = useState({
        value: '',
        isFocused: false
    })
    const [filteredRCs, setFilteredRCs] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedSortOption, setSelectedSortOption] = useState(SORT_BY_LOCATION)
    const [isAscendingOrder, setIsAscendingOrder] = useState(true)

    const sortingDirection = useRef(new Animated.Value(0)).current

    const handleSortingDirection = useCallback(() => {
        Animated.spring(sortingDirection, {
            toValue: !isAscendingOrder ? 0 : 180,
            useNativeDriver: true
        }).start()
        setIsAscendingOrder(prev => !prev)
        if (searchQuery.value.length > 0) setFilteredRCs(prev => prev.reverse())
        else setRepairCenters(prev => prev.reverse())
    }, [isAscendingOrder, searchQuery.value])

    const pickerOnValueChange = useCallback(async (value, _) => {
        setSelectedSortOption(value)

        if (value === SORT_ALPHABETICALLY) {
            sortRcsAlphabetically()
        } else {
            const locationPermission = await Location.getForegroundPermissionsAsync()

            if (locationPermission.granted) {
                const currentLocation = await Location.getCurrentPositionAsync()
                sortRcsByLocation(currentLocation)

            } else {
                const locationPermission = await Location.requestForegroundPermissionsAsync()

                if (locationPermission.granted) {
                    const currentLocation = await Location.getCurrentPositionAsync()
                    sortRcsByLocation(currentLocation)
                } else {
                    showToast(LOCATION_PERMISSION_DENIED)
                    sortRcsAlphabetically()
                    setSelectedSortOption(SORT_ALPHABETICALLY)
                }
            }
        }
    }, [isAscendingOrder])

    const compareRCAlphabetically = (a, b) => {
        const aLowerCase = a.name.toLowerCase()
        const bLowerCase = b.name.toLowerCase()

        if (aLowerCase > bLowerCase) return 1
        else if (bLowerCase > aLowerCase) return -1
        return 0
    }

    const compareRCByLocation = (a, b, location) => {
        const aDistance = calculateDistance(location.coords.longitude, location.coords.latitude, a.location.coords.longitude, a.location.coords.latitude)
        const bDistance = calculateDistance(location.coords.longitude, location.coords.latitude, b.location.coords.longitude, b.location.coords.latitude)

        if (aDistance > bDistance) return 1
        else if (bDistance > aDistance) return -1
        return 0
    }

    const sortRcsAlphabetically = () => {
        if (searchQuery.value.length > 0) {
            setFilteredRCs(prev => {
                if (isAscendingOrder) return [...prev].sort(compareRCAlphabetically)
                else return [...prev].sort(compareRCAlphabetically).reverse()
            })
        } else {
            setRepairCenters(prev => {
                if (isAscendingOrder) return [...prev].sort(compareRCAlphabetically)
                else return [...prev].sort(compareRCAlphabetically).reverse()
            })
        }
    }

    const sortRcsByLocation = (location) => {
        if (searchQuery.value.length > 0) {
            setFilteredRCs(prev => {
                if (isAscendingOrder) return [...prev].sort((a, b) => compareRCByLocation(a, b, location))
                else return [...prev].sort((a, b) => compareRCByLocation(a, b, location)).reverse()
            })
        } else {
            setRepairCenters(prev => {
                if (isAscendingOrder) return [...prev].sort((a, b) => compareRCByLocation(a, b, location))
                else return [...prev].sort((a, b) => compareRCByLocation(a, b, location)).reverse()
            })
        }
    }

    const fetchRepairCenters = async () => {
        try {
            setIsLoading(true);

            const rcsData = (await getAllRepairCenters()).data.data;

            let sortedRcs;
            if (selectedSortOption === SORT_ALPHABETICALLY) {
                sortedRcs = rcsData.sort(compareRCAlphabetically);
            } else {
                const locationPermission = await Location.getForegroundPermissionsAsync();

                if (locationPermission.granted) {
                    const currentLocation = await Location.getCurrentPositionAsync();
                    sortedRcs = rcsData.sort((a, b) => compareRCByLocation(a, b, currentLocation));
                } else {
                    const locationPermission = await Location.requestForegroundPermissionsAsync();

                    if (locationPermission.granted) {
                        const currentLocation = await Location.getCurrentPositionAsync();
                        sortedRcs = rcsData.sort((a, b) => compareRCByLocation(a, b, currentLocation));
                    } else {
                        showToast(LOCATION_PERMISSION_DENIED);
                        sortedRcs = rcsData.sort((a, b) => compareRCAlphabetically(a, b));
                        setSelectedSortOption(SORT_ALPHABETICALLY)
                    }
                }
            }

            if (searchQuery.value.length > 0) {
                sortedRcs = sortedRcs.filter(rc =>
                    rc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
                )
                if (isAscendingOrder) setFilteredRCs(sortedRcs)
                else setFilteredRCs(sortedRcs.reverse())
            } else {
                if (isAscendingOrder) setRepairCenters(sortedRcs)
                else setRepairCenters(sortedRcs.reverse())
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (searchQuery.value.length > 0) {
            setFilteredRCs(repairCenters.filter(rc =>
                rc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
            ))

        } else setFilteredRCs(repairCenters)
    }

    useEffect(() => {
        fetchRepairCenters()
    }, [])

    useEffect(() => {
        handleSearch()
    }, [searchQuery.value])

    return (
        <View style={styles.constainer}>
            <CustomTextInput
                Icon={() => <Feather
                    name="search"
                    size={24}
                    color={searchQuery.isFocused ? '#E48700' : '#adadad'} />}
                onBlur={() => setsearchQuery({ ...searchQuery, isFocused: false })}
                onFocus={() => setsearchQuery({ ...searchQuery, isFocused: true })}
                onChangeText={e => setsearchQuery({ ...searchQuery, value: e })}
                placeholder='Search for repair centers'
                state={searchQuery}
            >
            </CustomTextInput>
            <FlatList
                data={searchQuery.value.length > 0 ? filteredRCs : repairCenters}
                renderItem={({ item }) => <RepairCenterFlatListItem item={item} navigation={navigation} />}
                keyExtractor={(item) => item._id}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchRepairCenters} colors={['#E48700']} />}
                ListFooterComponent={<View style={{ height: 80 }} />}
                ListHeaderComponent={<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <PoppinsText>Sort</PoppinsText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 0.7 }}>
                        <Picker
                            selectedValue={selectedSortOption}
                            onValueChange={pickerOnValueChange}
                            style={{ flexGrow: 1, fontFamily: 'Poppins-Medium', borderRadius: 16 }}
                            itemStyle={{ fontFamily: 'Poppins-Medium' }}
                            prompt='Select sorting method'
                        >
                            <Picker.Item label='Alphabetically' value={SORT_ALPHABETICALLY} />
                            <Picker.Item label='By location' value={SORT_BY_LOCATION} />
                        </Picker>
                        <TouchableOpacity
                            style={{ padding: 8 }}
                            onPress={handleSortingDirection}
                        >
                            <Animated.View style={{
                                transform: [{
                                    rotateZ: sortingDirection.interpolate({
                                        inputRange: [0, 180],
                                        outputRange: ['0deg', '-180deg']
                                    })
                                }]
                            }}>
                                <AntDesign name='arrowup' size={20} />
                            </Animated.View>
                        </TouchableOpacity>
                    </View>
                </View>}
            />
        </View>
    )
}

export default RepairCentersScreen

const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 8
    }
})