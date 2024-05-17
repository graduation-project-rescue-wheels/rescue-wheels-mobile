import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';

const StarFlatListItem = ({ onPress, rate, index }) => {
    return (
        <Pressable onPress={onPress}>
            {
                index < rate ? <AntDesign name="star" size={30} color="#E48700" /> : <AntDesign name="staro" size={30} color="#E48700" />
            }
        </Pressable>
    )
}

export default StarFlatListItem

const styles = StyleSheet.create({})