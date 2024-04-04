import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

const Connecting = () => {
    const bigCircleScale = useRef(new Animated.Value(1)).current
    const mediumCircleScale = useRef(new Animated.Value(1)).current
    const smallCircleScale = useRef(new Animated.Value(1)).current

    useEffect(() => {
        const animate = Animated.loop(
            Animated.sequence([
                Animated.timing(bigCircleScale, {
                    toValue: 0.9,
                    useNativeDriver: true
                }),
                Animated.timing(mediumCircleScale, {
                    toValue: 0.9,
                    useNativeDriver: true
                }),
                Animated.timing(smallCircleScale, {
                    toValue: 0.9,
                    useNativeDriver: true
                }),
                Animated.timing(bigCircleScale, {
                    toValue: 1,
                    useNativeDriver: true
                }),
                Animated.timing(mediumCircleScale, {
                    toValue: 1,
                    useNativeDriver: true
                }),
                Animated.timing(smallCircleScale, {
                    toValue: 1,
                    useNativeDriver: true
                }),
            ])
        )

        animate.start()

        return () => {
            animate.stop()
        }
    }, [])
    
    return (
        <View style={styles.container}>
            <Animated.View style={{
                ...styles.circle,
                width: 200,
                height: 200,
                borderRadius: 200,
                transform: [{ scale: bigCircleScale }]
            }}
            />
            <Animated.View style={{
                ...styles.circle,
                width: 150,
                height: 150,
                borderRadius: 150,
                position: 'absolute',
                top: 25,
                transform: [{ scale: mediumCircleScale }]
            }}
            />
            <Animated.View style={{
                ...styles.circle,
                width: 100,
                height: 100,
                borderRadius: 100,
                position: 'absolute',
                top: 50,
                transform: [{ scale: smallCircleScale }]
            }}
            />
        </View>
    )
}

export default Connecting

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 16
    },
    circle: {
        borderWidth: 6,
        borderColor: '#E48700'
    }
})