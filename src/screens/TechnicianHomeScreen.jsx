import React, { useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import PoppinsText from '../components/PoppinsText'

const TechnicianHomeScreen = () => {

    const { user } = useSelector(state => state.user)
    const username = useMemo(() => `${user.firstName} ${user.lastName}`, [user.firstName, user.lastName])
    const isFirstHalfOfDay = useMemo(() => new Date().getHours() < 12, [])


    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }}>
                {
                    isFirstHalfOfDay ?
                        <PoppinsText style={styles.greetingText}>Good morning, <PoppinsText style={{ color: 'black' }}>
                            {username}
                        </PoppinsText>
                        </PoppinsText>
                        : <PoppinsText style={styles.greetingText}>Good afternoon, <PoppinsText style={{ color: 'black' }}>
                            {username}
                        </PoppinsText>
                        </PoppinsText>
                }
            </ScrollView>
        </View>
    )
}

export default TechnicianHomeScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white'
    },
    greetingText: {
        fontSize: 20,
        color: '#E48700'
    },
})