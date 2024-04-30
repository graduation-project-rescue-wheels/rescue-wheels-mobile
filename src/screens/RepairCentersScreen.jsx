import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { getAllRepairCenters } from '../api/repairCenter'
import RepairCenterFlatListItem from '../components/RepairCenterFlatListItem'

const RepairCentersScreen = ({ navigation }) => {
    const [repairCenters, setRepairCenters] = useState([])

    const fetchRepairCenters = async () => {
        const rcs = (await getAllRepairCenters()).data.data
        setRepairCenters(rcs)
    }

    useEffect(() => {
        fetchRepairCenters()
    }, [])

    return (
        <View style={styles.constainer}>
            <FlatList
                data={repairCenters}
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