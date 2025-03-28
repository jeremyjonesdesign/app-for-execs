import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '../components/CustomButton';

// Étape 1 : Sélection du dashboard
const DashboardStep = ({ 
  onNext, 
  selectedItems, 
  setSelectedItems
}: { 
  onNext: () => void, 
  selectedItems: number[],
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>
}) => {
  const metrics = [
    { title: 'Revenue', value: '-84.2%', trend: '↓', current: '2,451€' },
    { title: 'Average Cart', value: '+12.8%', trend: '↑', current: '95€' },
    { title: 'Conversion Rate', value: '+23.5%', trend: '↑', current: '3.2%' },
    { title: 'Number of Sessions', value: '-5.7%', trend: '↓', current: '12,845' },
    { title: 'Session Time', value: '+15.3%', trend: '↑', current: '4m23s' },
    { title: 'Bounce Rate', value: '-8.9%', trend: '↓', current: '42%' },
    { title: 'New Users', value: '+31.2%', trend: '↑', current: '856' },
    { title: 'Page Views', value: '+17.6%', trend: '↑', current: '25,632' },
    { title: 'Return Rate', value: '+42.1%', trend: '↑', current: '28%' },
    { title: 'Cart Abandonment', value: '-12.4%', trend: '↓', current: '67%' },
    { title: 'Average Order Value', value: '+9.3%', trend: '↑', current: '127€' },
    { title: 'Customer Lifetime Value', value: '+25.8%', trend: '↑', current: '850€' },
    { title: 'Cost per Acquisition', value: '-15.7%', trend: '↓', current: '22€' },
    { title: 'Click-through Rate', value: '+18.9%', trend: '↑', current: '4.8%' },
    { title: 'Mobile Traffic', value: '+33.4%', trend: '↑', current: '72%' },
    { title: 'Desktop Traffic', value: '-28.6%', trend: '↓', current: '28%' }
  ];

  const toggleItem = (index: number) => {
    setSelectedItems(prev => {
      if (prev.includes(index)) {
        return prev.filter(item => item !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.subtitle}>
        Select the data you'd like to see on my dashboard — of course, you can change it anytime using Sense.
      </Text>

      <ScrollView style={styles.listContainer}>
        {metrics.map((metric, index) => (
          <TouchableOpacity 
            key={index}
            activeOpacity={1}
            style={[
              styles.listItem,
              selectedItems.includes(index) && styles.listItemSelected
            ]}
            onPress={() => toggleItem(index)}
          >
            <Text style={[
              styles.itemTitle,
              selectedItems.includes(index) && styles.itemTitleSelected
            ]}>
              {metric.title}
            </Text>
            <View style={styles.itemRightContent}>
              <Text style={[
                styles.itemPercent,
                selectedItems.includes(index) && styles.itemPercentSelected
              ]}>
                {metric.trend} {metric.value}
              </Text>
              <Text style={[
                styles.itemValue,
                selectedItems.includes(index) && styles.itemValueSelected
              ]}>
                {metric.current}
              </Text>
              <View style={[styles.radioButton, selectedItems.includes(index) && styles.radioButtonSelected]}>
                {selectedItems.includes(index) && <View style={styles.radioButtonInner} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Étape 2 : Sélection des référents
const ReferentsStep = ({ 
  onNext, 
  selectedReferent,
  setSelectedReferent
}: { 
  onNext: () => void, 
  selectedReferent: number | null,
  setSelectedReferent: React.Dispatch<React.SetStateAction<number | null>>
}) => {
  const referents = [
    { initials: 'JA', name: 'Jane Austin', role: 'Head of design', avatar: null },
    { initials: 'IA', name: 'Ilan Abehassera', role: 'VP Strategy', avatar: require('../../assets/images/ilan.png') },
    { initials: 'PC', name: 'Pierre-Louis Chinazzo', role: 'Pre-Sales', avatar: null },
  ];

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.subtitle}>
        Easily send alerts to your entire team by selecting the appropriate referents.
      </Text>

      <ScrollView style={styles.listContainer}>
        {referents.map((referent, index) => (
          <TouchableOpacity 
            key={index}
            activeOpacity={1}
            style={[
              styles.listItem,
              selectedReferent === index && styles.listItemSelected
            ]}
            onPress={() => setSelectedReferent(index)}
          >
            <View style={styles.referentLeftContent}>
              {referent.avatar ? (
                <Image source={referent.avatar} style={styles.referentAvatar} />
              ) : (
                <View style={styles.referentInitials}>
                  <Text style={styles.initialsText}>{referent.initials}</Text>
                </View>
              )}
              <View style={styles.referentInfo}>
                <Text style={[
                  styles.referentName,
                  selectedReferent === index && styles.referentNameSelected
                ]}>
                  {referent.name}
                </Text>
                <Text style={styles.referentRole}>{referent.role}</Text>
              </View>
            </View>
            <View style={[styles.radioButton, selectedReferent === index && styles.radioButtonSelected]}>
              {selectedReferent === index && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedReferent, setSelectedReferent] = useState<number | null>(null);

  const handleBack = () => {
    if (currentStep === 1) {
      setCurrentStep(0);
    } else {
      router.push('/');
    }
  };

  const handleNextStep = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: currentStep === 0 ? "Create your dashboard" : "Select your referents",
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleStyle: {
            fontFamily: 'NewEdge',
            fontSize: 18,
            color: '#000',
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={handleBack}
              style={styles.headerButton}
            >
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Text style={[styles.stepIndicator, styles.headerRight]}>
              {currentStep + 1}/2
            </Text>
          ),
          headerTitleAlign: 'center',
        }}
      />
      
      {currentStep === 0 ? (
        <DashboardStep 
          onNext={handleNextStep} 
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      ) : (
        <ReferentsStep 
          onNext={() => router.push('/screens/HomeScreen')} 
          selectedReferent={selectedReferent}
          setSelectedReferent={setSelectedReferent}
        />
      )}

      <View style={styles.buttonContainer}>
        <CustomButton
          variant="next"
          title={currentStep === 1 ? "Done" : "Next"}
          onPress={() => {
            if (currentStep === 1) {
              router.push('/screens/HomeScreen');
            } else {
              setCurrentStep(prev => prev + 1);
            }
          }}
          disabled={(currentStep === 0 && selectedItems.length === 0) || 
                   (currentStep === 1 && selectedReferent === null)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stepContainer: {
    flex: 1,
    padding: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_300Light',
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 8,
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E3E3E8',
    marginHorizontal: 16,
    shadowColor: '#EBEBEB',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.6,
  },
  listItemSelected: {
    backgroundColor: '#F5F7FF',
    borderColor: '#4052DB',
  },
  itemTitle: {
    fontSize: 15,
    fontFamily: 'NewEdge',
    color: '#000',
  },
  itemTitleSelected: {
    color: '#4052DB',
  },
  itemRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemPercent: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#C2C5CD',
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(194, 197, 205, 0.2)',
  },
  itemPercentSelected: {
    color: '#4052DB',
    borderColor: '#DCE2F6',
  },
  itemValue: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#C2C5CD',
    marginRight: 12,
  },
  itemValueSelected: {
    color: '#4052DB',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(194, 197, 205, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#4052DB',
    backgroundColor: 'transparent',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4052DB',
  },
  referentLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  referentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  referentInitials: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#666',
  },
  referentInfo: {
    marginLeft: 12,
  },
  referentName: {
    fontSize: 15,
    fontFamily: 'NewEdge',
    color: '#000',
  },
  referentNameSelected: {
    color: '#4052DB',
  },
  referentRole: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#C2C5CD',
  },
  referentRoleSelected: {
    color: '#4052DB',
  },
  stepIndicator: {
    fontSize: 16,
    fontFamily: 'NewEdge',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerRight: {
    marginRight: 16,
    color: '#666',
    fontFamily: 'NewEdge',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: -20,
    },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
  },
}); 