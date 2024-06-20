import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, FlatList, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
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
import { mainColor, secondryColor } from '../colors'
import FilteredFlatListItem from '../components/FilteredFlatListItem'


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
    const [selectedCategories, setSelectedCategories] = useState([])
    const categoriesList = useMemo(() => [
        "Tyre shop",
        "Electrician",
        "Automechanic",
        "Air conditioner",
        "Body shop",
        "Exhaust system",
    ], [])
    const [unSelectedCategories, setUnSelectedCategories] = useState(categoriesList)

    const sortingDirection = useRef(new Animated.Value(0)).current

    const handleSortingDirection = useCallback(() => {
        Animated.spring(sortingDirection, {
            toValue: !isAscendingOrder ? 0 : 180,
            useNativeDriver: true
        }).start()
        setIsAscendingOrder(prev => !prev)
    }, [isAscendingOrder, searchQuery.value])

    const pickerOnValueChange = useCallback(async (value, _) => {
        setSelectedSortOption(value)
    }, [])

    const fetchRepairCenters = async () => {
        try {
            setIsLoading(true);
            const currentLocation = await Location.getCurrentPositionAsync()

            const rcsData = (await getAllRepairCenters(selectedCategories, selectedSortOption, isAscendingOrder, currentLocation.coords)).data.data;

            setRepairCenters(rcsData)

            if (searchQuery.value.length > 0) {
                setFilteredRCs(rcsData.filter(rc =>
                    rc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
                ))
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
        if (selectedSortOption == SORT_BY_LOCATION) {
            Location.getForegroundPermissionsAsync().then(res => {
                if (res.granted) fetchRepairCenters()
                else {
                    Location.requestForegroundPermissionsAsync().then(res => {
                        if (res.granted) fetchRepairCenters()
                    })
                }
            })
        } else fetchRepairCenters()
    }, [selectedCategories.length, selectedSortOption, isAscendingOrder])

    useEffect(() => {
        handleSearch()
    }, [searchQuery.value])

    useEffect(() => {
        if (selectedCategories.length > 0) {
            if (searchQuery.value.length > 0) {
                setFilteredRCs(() => {
                    let rcs = filteredRCs
                    let filtered = []
                    selectedCategories.forEach(e => {
                        filtered = [...filtered, ...rcs.filter(item => item.description === e)]
                    })
                    return filtered
                })
            }
            else {
                setFilteredRCs(() => {
                    let rcs = repairCenters
                    let filtered = []
                    selectedCategories.forEach(e => {
                        filtered = [...filtered, ...rcs.filter(item => item.description === e)]
                    })
                    return filtered
                })
            }
        }
    }, [selectedCategories.length])


    return (
        <View style={styles.constainer}>
            <CustomTextInput
                Icon={() => <Feather
                    name="search"
                    size={24}
                    color={searchQuery.isFocused ? mainColor : '#adadad'} />}
                onBlur={() => setsearchQuery({ ...searchQuery, isFocused: false })}
                onFocus={() => setsearchQuery({ ...searchQuery, isFocused: true })}
                onChangeText={e => setsearchQuery({ ...searchQuery, value: e })}
                placeholder='Search for repair centers'
                state={searchQuery}
            />
            <FlatList
                data={searchQuery.value.length > 0 ? filteredRCs : repairCenters}
                renderItem={({ item }) => <RepairCenterFlatListItem item={item} navigation={navigation} />}
                keyExtractor={(item) => item._id}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchRepairCenters} colors={[mainColor]} />}
                ListFooterComponent={<View style={{ height: 80 }} />}
                ListHeaderComponent={<View><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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
                </View>
                    <ScrollView
                        horizontal={true}>
                        {
                            selectedCategories.map((item, index) => <FilteredFlatListItem
                                label={item}
                                key={index}
                                containerStyle={{ backgroundColor: mainColor }}
                                labelStyle={{ color: secondryColor }}
                                onPress={() => {
                                    setSelectedCategories(prev => prev.filter(e => item !== e))
                                    setUnSelectedCategories(prev => [item, ...prev])
                                }} />)
                        }
                        {
                            unSelectedCategories.map((item, index) => <FilteredFlatListItem
                                label={item}
                                key={index}
                                containerStyle={{ backgroundColor: secondryColor }}
                                labelStyle={{ color: mainColor }}
                                onPress={() => {
                                    setUnSelectedCategories(prev => prev.filter(e => item !== e))
                                    setSelectedCategories(prev => [item, ...prev])
                                }} />)
                        }

                    </ScrollView>
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