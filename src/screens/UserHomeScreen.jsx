import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import PoppinsText from '../components/PoppinsText'
import { useMemo } from 'react'
import NoHistory from '../components/NoHistory'
import { MaterialIcons } from '@expo/vector-icons';
import NoOffers from '../components/NoOffers'
import { mainColor, secondryColor } from '../colors'

const UserHomeScreen = () => {
    const { user } = useSelector(state => state.user)
    const isFirstHalfOfDay = useMemo(() => new Date().getHours() < 12, [])
    const username = useMemo(() => `${user.firstName} ${user.lastName}`, [user.firstName, user.lastName])

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
                <PoppinsText style={styles.sectionTitle}>Offers</PoppinsText>
                <View style={styles.cardView}>
                    <FlatList
                        style={{ marginBottom: 32 }}
                        data={[]}
                        keyExtractor={(item) => item._id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ListEmptyComponent={<NoOffers />}
                        contentContainerStyle={{ alignItems: 'center', flex: 1 }}
                    />
                </View>
                <PoppinsText style={styles.sectionTitle}>History</PoppinsText>
                <View style={styles.cardView}>
                    <View style={styles.historySectionTitleView}>
                        <PoppinsText>Previous repair center visits</PoppinsText>
                        <TouchableOpacity>
                            <PoppinsText style={styles.seeAllText}>see all</PoppinsText>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        style={{ marginBottom: 32 }}
                        data={[]}
                        keyExtractor={(item) => item._id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ListEmptyComponent={<NoHistory message="You didn't visit any of our repair centers" />}
                        contentContainerStyle={{ alignItems: 'center', flex: 1 }}
                    />
                </View>
                <View style={{ height: 80 }} />
            </ScrollView>
            <TouchableOpacity style={styles.supportBtn}>
                <MaterialIcons
                    name='support-agent'
                    style={styles.supportBtnIcon}
                />
            </TouchableOpacity>
        </View>
    )
}

export default UserHomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white'
    },
    greetingText: {
        fontSize: 20,
        color: mainColor
    },
    historySectionTitleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    helpText: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 8
    },
    seeAllText: {
        color: '#666666'
    },
    cardView: {
        backgroundColor: secondryColor,
        borderRadius: 16,
        padding: 8,
        elevation: 5,
        marginBottom: 16,
        marginHorizontal: 8
    },
    supportBtn: {
        position: 'absolute',
        backgroundColor: secondryColor,
        padding: 8,
        borderRadius: 50,
        bottom: 85,
        right: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5
    },
    supportBtnIcon: {
        fontSize: 40,
        color: mainColor
    },
    selectedEmergencyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        alignSelf: 'baseline',
        width: '100%'
    },
    selectedEmergencyLabel: {
        fontSize: 20
    },
    selectedEmergencyIcon: {
        fontSize: 20,
        marginRight: 8
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 8
    },
    modalBtn: {
        padding: 8
    },
    flatListModalView: {
        height: 120,
        marginBottom: 8
    },
    sectionTitle: {
        fontSize: 24
    }
})