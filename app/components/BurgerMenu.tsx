import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  TextInput
} from 'react-native';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

interface BurgerMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({ isVisible, onClose }) => {
  const translateX = React.useRef(new Animated.Value(-300)).current;
  const [searchText, setSearchText] = React.useState('');
  const [inputFocused, setInputFocused] = React.useState(false);

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: isVisible ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const chatHistory = [
    { label: 'Why you revenue is dropping?', time: '28 min ago', route: '/chat/1', tag: 'Revenue' },
    { label: 'Revenue forecast Q2', time: '1h ago', route: '/chat/2', tag: 'Forecast' },
    { label: 'Customer segmentation', time: '2h ago', route: '/chat/3', tag: 'Customers' },
    { label: 'Monthly report', time: '1d ago', route: '/chat/4', tag: 'Report' },
  ];

  const filteredHistory = chatHistory.filter(item => 
    item.label.toLowerCase().includes(searchText.toLowerCase()) ||
    item.tag.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      {isVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        </TouchableOpacity>
      )}
      
      <Animated.View
        style={[
          styles.menu,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.searchContainer}>
          <Icon 
            name="search" 
            size={20} 
            color={inputFocused ? '#000' : '#8E8E93'} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations"
            placeholderTextColor="#8E8E93"
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
          {searchText !== '' && (
            <TouchableOpacity 
              onPress={() => setSearchText('')}
              style={styles.clearButton}
            >
              <Icon name="close" size={16} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.menuItems}>
          {filteredHistory.length === 0 ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No conversations found</Text>
            </View>
          ) : (
            filteredHistory.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                }}
              >
                <View style={styles.chatItemContent}>
                  <View style={styles.tagContainer}>
                    <Text style={styles.tagText}>{item.tag}</Text>
                  </View>
                  <Text style={styles.menuItemText}>{item.label}</Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  menu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#FFF',
    zIndex: 1001,
    paddingTop: 60,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#324FBE',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 12,
    tintColor: '#fff',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'NewEdge',
  },
  menuItems: {
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EAEAEF',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#9C9D9F',
    fontFamily: 'Inter_300Light',
  },
  chatItemContent: {
    flex: 1,
  },
  timeText: {
    color: '#A8ACC2',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  menuItem: {
    flexDirection: 'row',
    padding: 16,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  menuItemText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
    color: '#000',
  },
  tagContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EAEAEF',
  },
  tagText: {
    color: '#9C9D9F',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  clearButton: {
    padding: 4,
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
}); 