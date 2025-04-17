import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
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

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: isVisible ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const menuItems = [
    { icon: 'star', label: 'Sense History', badge: '542' },
    { icon: 'dashboard', label: 'Dashboard' },
    { icon: 'schedule', label: 'Journey Analysis' },
    { icon: 'filter-alt', label: 'Funnel' },
    { icon: 'compare', label: 'Page Comparator' },
    { icon: 'grid-on', label: 'Zoning Analysis' },
    { icon: 'play-circle-outline', label: 'Session Replay' },
    { icon: 'error', label: 'Error Analysis' },
    { icon: 'show-chart', label: 'Impact' },
    { icon: 'insights', label: 'Insights' },
  ];

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
          <Icon name="search" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#8E8E93"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.menuItems}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                onClose();
                if (item.label === 'Journey Analysis') {
                  router.push('/screens/JourneyAnalysis' as any);
                } else if (item.label === 'Dashboard') {
                  router.replace('/screens/HomeScreen' as any);
                }
              }}
            >
              <Icon name={item.icon} size={24} color="#000" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>{item.label}</Text>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F7',
    margin: 16,
    padding: 12,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 20,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  badge: {
    backgroundColor: '#F2F3F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#000',
    fontSize: 12,
  },
}); 