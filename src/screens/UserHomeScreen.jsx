import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import PoppinsText from '../components/PoppinsText'
import { useMemo } from 'react'
import UserServicesFlatListItem from '../components/UserServicesFlatListItem'
import NoHistory from '../components/NoHistory'
import { MaterialIcons } from '@expo/vector-icons';

const UserHomeScreen = () => {
    const { user } = useSelector(state => state.user)
    const isFirstHalfOfDay = useMemo(() => new Date().getHours() < 12, [])
    const services = [
        {
            imageSrc: require('../assets/images/siren.png'),
            label: 'Emergency',
            onPress: () => {
                //TODO
            }
        },
        {
            imageSrc: require('../assets/images/service-station.png'),
            label: 'Repair centers',
            onPress: () => {
                //TODO
            }
        }
    ]

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }}>
                {
                    isFirstHalfOfDay ?
                        <PoppinsText style={styles.greetingText}>Good morning, <PoppinsText style={{ color: 'black' }}>
                            {user.username}
                        </PoppinsText>
                        </PoppinsText>
                        : <PoppinsText style={styles.greetingText}>Good afternoon, <PoppinsText style={{ color: 'black' }}>
                            {user.username}
                        </PoppinsText>
                        </PoppinsText>
                }
                <PoppinsText style={styles.helpText}>
                    How can we help you?
                </PoppinsText>
                <FlatList
                    style={{ marginBottom: 16 }}
                    data={services}
                    renderItem={({ item }) => <UserServicesFlatListItem
                        imageSrc={item.imageSrc}
                        label={item.label}
                        onPress={item.onPress}
                    />}
                    keyExtractor={(_, index) => index}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
                <View style={styles.cardView}>
                    <View style={styles.historySectionTitleView}>
                        <PoppinsText>Your previous emergencies</PoppinsText>
                        <TouchableOpacity>
                            <PoppinsText style={styles.seeAllText}>see all</PoppinsText>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        style={{ marginBottom: 32 }}
                        data={user.history}
                        keyExtractor={(item) => item._id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ListEmptyComponent={<NoHistory message="You don't have any previous emergencies" />}
                        contentContainerStyle={{ alignItems: user.history ? 'flex-start' : 'center', flex: 1 }}
                    />
                </View>
                <View style={styles.cardView}>
                    <View style={styles.historySectionTitleView}>
                        <PoppinsText>Your previous visits to our repair centers</PoppinsText>
                        <TouchableOpacity>
                            <PoppinsText style={styles.seeAllText}>see all</PoppinsText>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        style={{ marginBottom: 32 }}
                        data={user.history}
                        keyExtractor={(item) => item._id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ListEmptyComponent={<NoHistory message="You didn't visit any of our repair centers" />}
                        contentContainerStyle={{ alignItems: user.history ? 'flex-start' : 'center', flex: 1 }}
                    />
                </View>
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
        padding: 8
    },
    greetingText: {
        fontSize: 20,
        color: '#E48700'
    },
    historySectionTitleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    helpText: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 16
    },
    seeAllText: {
        color: '#666666'
    },
    cardView: {
        backgroundColor: '#F6EEE3',
        borderRadius: 16,
        padding: 8,
        elevation: 5,
        marginBottom: 16,
        marginHorizontal: 8
    },
    supportBtn: {
        position: 'absolute',
        backgroundColor: '#E48700',
        padding: 8,
        borderRadius: 50,
        bottom: 50,
        right: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    supportBtnIcon: {
        fontSize: 40,
        color: 'white'
    }
})