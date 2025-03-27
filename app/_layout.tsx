import { View, Image, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    SplashScreen.hideAsync();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Animated.View 
        style={[
          styles.splash,
          {
            opacity: fadeAnim,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }
        ]}
      >
        <LinearGradient 
          colors={['#1B3080', '#1A2E7A']}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <Image 
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </LinearGradient>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    zIndex: 999,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 60,
  },
});
