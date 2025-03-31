import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SenseChat() {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleMessageChange = (text: string) => {
    setMessage(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Revenue</Text>
        <TouchableOpacity 
          onPress={handleClose}
          style={styles.closeButton}
        >
          <Icon name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.chatContainer}>
        {/* Message utilisateur */}
        <View style={styles.userMessageWrapper}>
          <LinearGradient
            colors={['#EBEEF9', '#DDE0EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.messageBorderGradient}
          >
            <View style={styles.userMessageContainer}>
              <Text style={[styles.messageText, styles.userMessageText]}>
                Want to know why your revenue is dropping?
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Message du bot */}
        <View style={styles.botMessageWrapper}>
          <Image 
            source={require('../../assets/images/sense-icon.png')} 
            style={styles.senseIcon} 
          />
            <View style={styles.botMessageContainer}>
              <Text style={styles.messageText}>
                Sure, I can help you with this subject.{'\n'}
                Should I let your referent know about this and the revenue decrease?
              </Text>
            </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.activeButton]}>
            <Text style={[styles.buttonText, styles.activeButtonText]}>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[
          styles.inputWrapper,
          isInputFocused && styles.inputWrapperActive
        ]}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask Sense about Revenue"
            value={message}
            onChangeText={handleMessageChange}
            multiline={false}
            numberOfLines={1}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
          <LinearGradient
            colors={message.length > 0 ? ['#3150C7', '#213993'] : ['#F5F7FF', '#F5F7FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.sendButtonGradient,
              message.length > 0 && styles.sendButtonGradientActive
            ]}
          >
            <TouchableOpacity 
              style={[
                styles.sendButton,
                message.length > 0 && styles.sendButtonActive
              ]}
              disabled={message.length === 0}
            >
              <Icon 
                name="arrow-upward" 
                size={24} 
                color={message.length > 0 ? "#FFF" : "#A8ACC2"} 
              />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.bottomActions}>
          <View style={styles.leftIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="add" size={24} color="#A8ACC2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="notifications-none" size={24} color="#A8ACC2" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontFamily: 'NewEdge',
    fontSize: 18,
    color: '#000',
    paddingTop: 4,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 60,
  },
  chatContainer: {
    flex: 1,
    padding: 20,
  },
  userMessageWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 15,
    marginBottom: 20,
  },
  userMessageContainer: {
    backgroundColor: '#F4F6FA',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 0,
    padding: 16,
    shadowColor: "#324FBE",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  botMessageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    borderRadius: 15,
    
  },
  botMessageContainer: {
    backgroundColor: '#FFF',
    width: '80%',
  },
  messageBorderGradient: {
    padding: 1,
    maxWidth: '80%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 0,
  },
  messageText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: '#000',
  },
  userMessageText: {
    fontFamily: 'Inter_400Regular',
    color: '#000',
    fontSize: 14,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8EAF6',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#F6F8FC',
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#000',
  },
  activeButtonText: {
    color: '#000',
  },
  inputWrapper: {
    color: "#E2E4EC",
    borderTopWidth: 1,
    borderTopColor: '#EBEEF9',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#EBEEF9",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  inputWrapperActive: {
    shadowColor: "#324FBE",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#000',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',

    paddingVertical: 12,
  },
  leftIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  sendButtonGradient: {
    borderRadius: 12,
    padding: 1,
  },
  sendButtonGradientActive: {
    shadowColor: "#324FBE",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 11,
    backgroundColor: 'white',
  },
  sendButtonActive: {
    backgroundColor: '#304FC3',
  },
  senseIcon: {
    width: 16,
    height: 16,
    tintColor: '#E2E4EC',
    marginRight: 12,
  },
}); 