import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LineChart as GiftedLineChart } from 'react-native-gifted-charts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold 
} from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { CustomButton } from '../components/CustomButton';
import { router } from 'expo-router';
import { BurgerMenu } from '../components/BurgerMenu';

const generateDaysOfMonth = () => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  
  const days = eachDayOfInterval({
    start: monthStart,
    end: monthEnd
  });

  return days.map(day => ({
    date: format(day, 'd'),
    weekday: format(day, 'EEE', { locale: fr }).charAt(0).toUpperCase(),
    isSelected: isToday(day),
    fullDate: day,
    data: {
      revenue: Math.floor(Math.random() * 4000000) + 1000000,
      graphData: Array(7).fill(0).map(() => Math.floor(Math.random() * 100000))
    }
  }));
};

const generateMetricData = (metricType: string) => {
  switch (metricType) {
    case 'Revenue':
      const revenue = Math.floor(Math.random() * 3000000) + 1000000;
      return {
        value: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(revenue),
        graphData: Array(8).fill(0).map(() => Math.floor(Math.random() * (revenue * 0.8)))
      };
    case 'Average Cart':
      const avgCart = Math.floor(Math.random() * 1500) + 500;
      return {
        value: `${avgCart}€`,
        graphData: Array(8).fill(0).map(() => Math.floor(Math.random() * avgCart))
      };
    case 'Conversation Rate':
      const convRate = (Math.random() * 3 + 1).toFixed(1);
      return {
        value: `${convRate}%`,
        graphData: Array(8).fill(0).map(() => parseFloat((Math.random() * 3 + 1).toFixed(1)))
      };
    case 'Number of Sessions':
      const sessions = Math.floor(Math.random() * 1000) + 200;
      return {
        value: sessions.toString(),
        graphData: Array(8).fill(0).map(() => Math.floor(Math.random() * sessions))
      };
    case 'Session Time':
      const minutes = Math.floor(Math.random() * 8) + 2;
      const seconds = Math.floor(Math.random() * 60);
      return {
        value: `${minutes}min ${seconds}s`,
        graphData: Array(8).fill(0).map(() => minutes * 60 + Math.floor(Math.random() * 60))
      };
    case 'Bounce Rate':
      const bounceRate = (Math.random() * 2).toFixed(2);
      return {
        value: `${bounceRate}%`,
        graphData: Array(8).fill(0).map(() => parseFloat((Math.random() * 2).toFixed(2)))
      };
    default:
      return {
        value: '0',
        graphData: Array(8).fill(0)
      };
  }
};

const StatItem = ({ label, value, change, onSelect, isSelected }) => {
  const isPositive = change >= 0;
  
  return (
    <TouchableOpacity 
      style={styles.statItem}
      onPress={() => onSelect(label)}
    >
      <View style={styles.statLeft}>
        <Image 
          source={require('../../assets/images/sense-icon.png')} 
          style={[
            styles.statIcon,
            { tintColor: isSelected ? '#324FBE' : '#E8EAF6' }
          ]} 
        />
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      
      <View style={styles.statRight}>
        <View style={[
          styles.changeContainer, 
          { backgroundColor: isPositive ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 23, 68, 0.1)' }
        ]}>
          <Icon 
            name={isPositive ? 'arrow-upward' : 'arrow-downward'} 
            size={12} 
            color={isPositive ? '#00C853' : '#FF1744'} 
            style={styles.changeIcon}
          />
          <Text style={[
            styles.changeText,
            { color: isPositive ? '#00C853' : '#FF1744' }
          ]}>
            {Math.abs(change)}%
          </Text>
        </View>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    'NewEdge': require('../../assets/fonts/NewEdge666-RegularRounded.ttf'),
  });

  const scrollViewRef = useRef(null);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [revenueData, setRevenueData] = useState([
    { value: 20000 },
    { value: 45000 },
    { value: 28000 },
    { value: 80000 },
    { value: 99000 },
    { value: 43000 },
    { value: 50000 },
    { value: 60000 }
  ]);
  const [currentRevenue, setCurrentRevenue] = useState('3 001 264€');
  const [selectedMetric, setSelectedMetric] = useState('Revenue');
  const [metricsData, setMetricsData] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  
  const days = generateDaysOfMonth();

  const scrollToSelectedDate = (index) => {
    const itemWidth = 52; // largeur de l'item (40) + marginRight (12)
    const screenWidth = Dimensions.get('window').width;
    const offset = index * itemWidth - (screenWidth / 2) + (itemWidth / 2);
    
    scrollViewRef.current?.scrollTo({
      x: Math.max(0, offset),
      animated: true
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setCurrentDate(selectedDate);
      updateAllMetricsData(selectedDate);
    }
  };

  const handleDaySelect = (day, index) => {
    setSelectedDay(day.fullDate);
    scrollToSelectedDate(index);
    updateAllMetricsData(day.fullDate);
  };

  const handleMetricSelect = (metric) => {
    setSelectedMetric(metric);
    updateGraphData(metric);
  };

  // Générer les données initiales pour toutes les métriques
  useEffect(() => {
    updateAllMetricsData(currentDate);
  }, []);

  const updateAllMetricsData = (date) => {
    const metrics = [
      'Revenue',
      'Average Cart',
      'Conversation Rate',
      'Number of Sessions',
      'Session Time',
      'Bounce Rate'
    ];

    const newMetricsData = {};
    metrics.forEach(metric => {
      const data = generateMetricData(metric);
      newMetricsData[metric] = {
        label: metric,
        currentValue: data.value,
        graphData: data.graphData,
        change: ((Math.random() * 40) - 20).toFixed(1) // Variation entre -20% et +20%
      };
    });

    setMetricsData(newMetricsData);
    // Mettre à jour le graphique avec les données de la métrique sélectionnée
    updateGraphData(selectedMetric, newMetricsData);
  };

  const updateGraphData = (metric, data = metricsData) => {
    const points = data[metric].graphData.map((value, index) => ({
      value: value,
      label: ['8AM', '10', '12', '2PM', '4', '6', '8', '10'][index]
    }));
    setRevenueData(points);
    setCurrentRevenue(data[metric].currentValue);
  };

  // Scroll to today's date on initial render
  useEffect(() => {
    const todayIndex = days.findIndex(day => isToday(day.fullDate));
    if (todayIndex !== -1) {
      // Petit délai pour s'assurer que le ScrollView est rendu
      setTimeout(() => scrollToSelectedDate(todayIndex), 100);
    }
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={['#1C3286', '#1A2E7A']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topContainer}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => setIsMenuVisible(true)}>
              <Icon name="menu" size={24} color="#BCC6EB" />
            </TouchableOpacity>
            <Text style={styles.dateText}>
              {format(selectedDay, "'Today,' h:mm a", { locale: fr })}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="notifications" size={24} color="#BCC6EB" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatar}>
              <Image source={require('../../assets/images/ilan.png')} style={styles.avatarImage} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.revenueSection}>
          <View style={styles.revenueLabelContainer}>
            <Image 
              source={require('../../assets/images/sense-icon.png')} 
              style={styles.revenueIcon}
            />
            <Text style={styles.revenueLabel}>{selectedMetric}</Text>
          </View>
          <Text style={styles.revenueAmount}>{currentRevenue}</Text>
        </View>

        <GiftedLineChart
          style={{
            marginTop: 10,
          }}
          data={revenueData}
          height={120}
          width={Dimensions.get('window').width + 40}
          color="rgba(255,255,255,0.5)"
          thickness={1}
          curved={true}
          dataPointsColor="rgba(255,255,255,0.8)"
          dataPointsRadius={3}
          areaChart={true}
          startFillColor="#223C9E"
          endFillColor="#1A2F7D"
          xAxisLabelTextStyle={{
            color: '#BCC6EB',
            fontSize: 12,
            fontFamily: 'Inter_300Light',
            lineHeight: 22,
            textAlign: 'center'
          }}
          showVerticalLines={false}
          xAxisColor="transparent"
          yAxisColor="transparent"
          backgroundColor="transparent"
          showHorizontalLines={false}
          showGrid={false}
          hideRules={true}
          rulesType="none"
          hideYAxisText={true}
        />

        <View style={styles.daysWrapper}>


          <ScrollView 
            ref={scrollViewRef}
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.daysContainer}
            contentContainerStyle={styles.daysContentContainer}
          >
            {days.map((day, index) => (
              <TouchableOpacity 
                key={day.date} 
                style={[
                  styles.dayItem, 
                  format(selectedDay, 'd') === day.date && styles.selectedDay
                ]}
                onPress={() => handleDaySelect(day, index)}
              >
                <Text style={[
                  styles.dayWeekday,
                  format(selectedDay, 'd') === day.date && styles.selectedDayText
                ]}>
                  {day.weekday}
                </Text>
                <Text style={[
                  styles.dayNumber,
                  format(selectedDay, 'd') === day.date && styles.selectedDayText
                ]}>
                  {day.date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.statsContainer}>
          {Object.entries(metricsData).map(([metric, data]) => (
            <StatItem 
              key={metric}
              label={metric}
              value={data.currentValue}
              change={parseFloat(data.change)}
              onSelect={() => handleMetricSelect(metric)}
              isSelected={selectedMetric === metric}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footerContainer}>
        <CustomButton
          variant="sense-icon"
          title="Ask Sense"
          onPress={() => router.push('/screens/SenseChat')}
        />
      </View>

      <BurgerMenu 
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topContainer: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  dateText: {
    fontFamily: 'NewEdge',
    color: '#BCC6EB',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#5069C8',
    borderRadius: 100,
    padding: 8,
    verticalAlign: 'middle',
    paddingTop: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  revenueSection: {
    paddingTop: 8,
    paddingHorizontal: 20,
  },
  revenueLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Centre verticalement les éléments
  },
  revenueIcon: {
    width: 16,
    height: 16,
    tintColor: '#324FBE',
    marginRight: 8,
  },
  revenueLabel: {
    fontFamily: 'NewEdge',
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
    paddingTop: 5,
  },
  revenueAmount: {
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
    fontSize: 32,
    marginTop: 8,
  },
  chart: {
    marginVertical: 0,
    position: 'relative',
    left: 0,
    shadowColor: 'red',
  },
  daysWrapper: {
    position: 'relative',
    marginTop: 20,
    marginBottom:4,
  },
  daysContainer: {
    zIndex: 1,
  },
  daysContentContainer: {
    paddingHorizontal: 20,
    paddingRight: Dimensions.get('window').width / 2,
    paddingLeft: Dimensions.get('window').width / 2 - 52,
  },
  dayItem: {
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#1E358C',
  },
  selectedDay: {
    backgroundColor: '#324FBE',
  },
  dayWeekday: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: '#BCC6EB',

  },
  dayNumber: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#BCC6EB',
  },
  selectedDayText: {
    color: '#fff',
    opacity: 1,
  },
  statsContainer: {
    padding: 20,
  },
  dayText: {
    fontFamily: 'Inter_400Regular',
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 16,
    height: 16,
    marginRight: 12,
  },
  statLabel: {
    fontFamily: 'NewEdge',
    fontSize: 15,
    color: '#000',
  },
  statRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  changeIcon: {
    marginRight: 2,
  },
  changeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  statValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#000',
    minWidth: 80,
    textAlign: 'right',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {

  },
  footerContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  buttonShadowContainer: {
    borderRadius: 30,
    // Drop shadow
    shadowColor: '#E3E3E3',
    shadowOffset: {
      width: 2,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  gradientBorder: {
    borderRadius: 30,
    padding: 1, // L'épaisseur de la bordure en gradient
  },
  askButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  innerShadow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    // Inner shadow effect
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1,
  },
  senseIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    verticalAlign: 'middle',
  },
  askButtonText: {
    fontFamily: 'NewEdge',
    color: '#fff',
    fontSize: 14,
    verticalAlign: 'middle',
  },
  daysSideGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 60,
    zIndex: 2,
    overflow: 'hidden',
  },
  daysSideGradientRight: {
    left: undefined,
    right: 0,
  },
  selectedStatItem: {
    backgroundColor: '#324FBE',
  },
}); 