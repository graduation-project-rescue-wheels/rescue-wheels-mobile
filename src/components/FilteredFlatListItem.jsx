import React from 'react'
import PoppinsText from './PoppinsText'
import { StyleSheet, TouchableOpacity } from 'react-native'

const FilteredFlatListItem = ({label, onPress, containerStyle, labelStyle}) => {
    return (
        <TouchableOpacity
            style={{...styles.container, ...containerStyle}}
            onPress={onPress}
        >
            <PoppinsText style={labelStyle}>{label}</PoppinsText>
        </TouchableOpacity>
    )
}

export default FilteredFlatListItem

const styles = StyleSheet.create({
    container: {
        padding: 8,
        borderRadius: 16,
        elevation: 5,
        margin: 8
    }
})