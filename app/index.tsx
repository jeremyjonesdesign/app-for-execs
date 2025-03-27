import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';

// Empêcher le splash screen de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    'NewEdge': require('../assets/fonts/NewEdge666-RegularRounded.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = () => {
    router.replace('/screens/HomeScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo-dark.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <TextInput
          style={[
            styles.input,
            focusedInput === 'email' && styles.inputFocused
          ]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          onFocus={() => setFocusedInput('email')}
          onBlur={() => setFocusedInput(null)}
        />

        <TextInput
          style={[
            styles.input,
            focusedInput === 'password' && styles.inputFocused
          ]}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onFocus={() => setFocusedInput('password')}
          onBlur={() => setFocusedInput(null)}
        />

        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.forgotPassword}>Forgot your password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
          <LinearGradient
            colors={['#3150C7', '#213993']}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButtonContainer} onPress={() => {}}>
            <View style={styles.googleButtonInner}>
              <Text style={styles.googleButtonText}>Sign In with Google</Text>
            </View>
        </TouchableOpacity>
      </View>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.signUpLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 150,
    height: 60,
  },
  logoText: {
    fontSize: 40,
    fontFamily: 'NewEdge',
    marginTop: 10,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 15,
    fontFamily: 'Inter_300Light',
  },
  inputFocused: {
    borderColor: '#4052DB',
    borderWidth: 1,
    shadowColor: '#C3CBD9',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  forgotPassword: {
    color: '#9C9D9F',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter_300Light',
    fontSize: 12,
  },
  buttonContainer: {
    height: 48,
    marginBottom: 15,
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: '#4052DB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'NewEdge',
  },
  googleButtonContainer: {
    height: 48,
    marginBottom: 30,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E4E6EB',
  },
  gradientBorder: {
    flex: 1,
    padding: 2,
    borderRadius: 25,
  },
  googleButtonInner: {
    flex: 1,
    backgroundColor: 'none',
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#000',
    backgroundColor: 'none',
    fontSize: 15,
    fontFamily: 'NewEdge',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
  },
  signUpText: {
    color: '#666',
    fontFamily: 'Inter_300Light',
  },
  signUpLink: {
    color: '#000',
    textDecorationLine: 'underline',
    fontFamily: 'Inter_400SemiBold',
  },
});
