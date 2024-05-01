import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { getAllRepairCenters } from '../api/repairCenter'
import RepairCenterFlatListItem from '../components/RepairCenterFlatListItem'
import CustomTextInput from '../components/CustomTextInput'
import { Feather } from '@expo/vector-icons';

const RepairCentersScreen = ({ navigation }) => {
    const [repairCenters, setRepairCenters] = useState([])
    const [searchQuery, setsearchQuery] = useState({
        value: '',
        isFocused: false
    })
    const [filteredRCs, setfilteredRCs] = useState([])


    const fetchRepairCenters = async () => {
        const rcs = (await getAllRepairCenters()).data.data
        setRepairCenters(rcs)
        setfilteredRCs(rcs)
    }

    const handleSearch = () => {
        if (searchQuery.value.length > 0) {
            setfilteredRCs(repairCenters.filter(rc =>
                rc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
            ))
        } else setfilteredRCs(repairCenters)
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
                data={filteredRCs}
                renderItem={({ item }) => <RepairCenterFlatListItem item={item} navigation={navigation} />}
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