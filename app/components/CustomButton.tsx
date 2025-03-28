import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'google';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
}) => {
  if (variant === 'google') {
    return (
      <TouchableOpacity 
        style={[
          styles.buttonContainer, 
          styles.googleButtonContainer, 
          disabled && styles.disabledButton,
          style
        ]} 
        onPress={onPress}
        disabled={disabled}
      >
        <View style={styles.googleButtonInner}>
          <Text style={[styles.googleButtonText, textStyle]}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[
        styles.buttonContainer, 
        disabled && styles.disabledButton,
        style
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      <LinearGradient
        colors={['#1B3182', '#132259']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <LinearGradient
          colors={['#3150C7', '#213993']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 48,
    marginBottom: 15,
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradientBorder: {
    flex: 1,
    padding: 1,
    borderRadius: 25,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#4052DB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'NewEdge',
  },
  googleButtonContainer: {
    borderWidth: 1,
    borderColor: '#E4E6EB',
  },
  googleButtonInner: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#000',
    fontSize: 15,
    fontFamily: 'NewEdge',
  },
  disabledButton: {
    opacity: 0.5,
  },
}); 