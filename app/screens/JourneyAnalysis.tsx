import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  FlatList,
  findNodeHandle,
  UIManager,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BurgerMenu } from '../components/BurgerMenu';
import { CustomButton } from '../components/CustomButton';
import { CircularChart } from '../components/CircularChart';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const PADDING = 20;

// Constantes pour les tailles des graphiques
const CHARTS_CONTAINER_SIZE = 380;
const OUTER_CHART_SIZE = 260;
const OUTER_CHART_STROKE_WIDTH = 20;
const OUTER_CHART_INNER_RADIUS = 105;

const INNER_CHART_SIZE = 170;
const INNER_CHART_STROKE_WIDTH = 20;
const INNER_CHART_INNER_RADIUS = 60;

const INTERACTIVE_AREA_SIZE = 170;
const TOUCH_TARGET_SIZE = 70;

// Nouveau graphique le plus externe
const MOST_OUTER_CHART_SIZE = 340;
const MOST_OUTER_CHART_STROKE_WIDTH = 12;
const MOST_OUTER_CHART_INNER_RADIUS = 148;

// Constantes pour les cartes
const CARD_WIDTH = 250;
const CARD_HEIGHT = 100;
const CARD_MARGIN = 20;

interface ChartData {
  value: number;
  color: string;
  label: string;
  focused?: boolean;
}

// Interface pour les cartes
interface JourneyCard {
  title: string;
  percentage: string;
  description: string;
  color: string;
}

export default function JourneyAnalysis() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showDetailCard, setShowDetailCard] = useState(false);
  const [data, setData] = useState<ChartData[]>([
    { value: 40, color: '#78F5B2', label: '40%', focused: false },
    { value: 30, color: '#E97C64', label: '30%', focused: false },
    { value: 20, color: '#F2C55E', label: '20%', focused: false },
    { value: 10, color: '#000000', label: '10%', focused: false },
  ]);
  
  // Animations pour la carte d'erreur
  const errorCardScale = useRef(new Animated.Value(1)).current;
  const errorCardOpacity = useRef(new Animated.Value(1)).current;
  const detailCardOpacity = useRef(new Animated.Value(0)).current;
  const errorCardTranslateY = useRef(new Animated.Value(0)).current;
  const detailCardScale = useRef(new Animated.Value(0.95)).current;
  const mostOuterChartOpacity = useRef(new Animated.Value(1)).current;
  const page1ButtonOpacity = useRef(new Animated.Value(0)).current;
  const page1ButtonTranslateX = useRef(new Animated.Value(300)).current;
  const landingPageTranslateX = useRef(new Animated.Value(0)).current;
  
  // Référence pour la carte d'erreur
  const errorCardRef = useRef(null);
  // Position X de la carte d'erreur
  const [errorCardX, setErrorCardX] = useState(CARD_MARGIN);
  
  // Données pour le graphique circulaire le plus externe
  const [mostOuterData, setMostOuterData] = useState<ChartData[]>([
    { value: 65, color: '#F0F0F0', label: '65%', focused: false },
    { value: 35, color: '#3150C7', label: '35%', focused: false },
  ]);
  
  // Données pour les cartes - correspondant au graphique interne
  const cards: JourneyCard[] = [
    {
      title: 'Inscription',
      percentage: '40%',
      description: 'des visiteurs complètent leur inscription',
      color: '#78F5B2'
    },
    {
      title: 'Abandon',
      percentage: '30%',
      description: 'quittent pendant le processus d\'inscription',
      color: '#E97C64'
    },
    {
      title: 'Consultation',
      percentage: '20%',
      description: 'visitent sans créer de compte',
      color: '#F2C55E'
    },
    {
      title: 'Erreur',
      percentage: '10%',
      description: 'rencontrent une erreur technique',
      color: '#000000'
    }
  ];
  
  // Données pour le graphique circulaire externe
  const [outerData, setOuterData] = useState<ChartData[]>([
    { value: 35, color: '#E7E7E7', label: '35%', focused: false },
    { value: 10, color: '#000000', label: '10%', focused: false },
  ]);
  
  // Références pour les animations
  const animatedDataRef = useRef<ChartData[]>([...data]);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Animation de la carte erreur
  const handleErrorCardPress = () => {
    if (!showDetailCard) {
      // Déclencher également l'animation du segment circulaire correspondant
      // Cela permet de synchroniser les animations quand on clique sur la carte
      handleSegmentAnimation(3); // Index 3 = segment noir (erreur)
      
      // Masquer IMMÉDIATEMENT le cercle le plus extérieur sans animation
      mostOuterChartOpacity.setValue(0);
      
      // Animer l'apparition du bouton Page 1 et le décalage de Landing Page
      Animated.parallel([
        // Animation de Page 1
        Animated.timing(page1ButtonOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.bezier(0.2, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(page1ButtonTranslateX, {
          toValue:-30,
          duration: 400,
          easing: Easing.bezier(0.2, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        // Animation de Landing Page
        Animated.timing(landingPageTranslateX, {
          toValue: -40, // Décalage moins prononcé vers la gauche (était -40)
          duration: 400,
          easing: Easing.bezier(0.2, 0, 0.2, 1),
          useNativeDriver: true,
        })
      ]).start();
      
      // Afficher la carte détaillée
      setShowDetailCard(true);
      
      Animated.parallel([
        Animated.timing(errorCardScale, {
          toValue: 0.9,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(errorCardOpacity, {
          toValue: 0.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(detailCardOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.bezier(0.2, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(errorCardTranslateY, {
          toValue: -20, // Valeur négative pour monter
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(detailCardScale, {
          toValue: 1,
          duration: 400,
          easing: Easing.bezier(0.2, 0, 0.2, 1),
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Revenir à l'état normal du segment circulaire
      // Seulement si on a déjà animé le segment auparavant
      if (data[3].focused) {
        handleSegmentAnimation(3);
      } else {
        // Si on n'a pas de segment en focus mais que la carte détaillée est visible,
        // il faut quand même réafficher le cercle extérieur
        Animated.timing(mostOuterChartOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
      
      // Animer la disparition du bouton Page 1 et le recentrage de Landing Page
      Animated.parallel([
        // Animation de Page 1
        Animated.timing(page1ButtonOpacity, {
          toValue: 0,
          duration: 250,
          easing: Easing.bezier(0.4, 0, 1, 1),
          useNativeDriver: true,
        }),
        Animated.timing(page1ButtonTranslateX, {
          toValue: -10,
          duration: 250,
          easing: Easing.bezier(0.4, 0, 1, 1),
          useNativeDriver: true,
        }),
        // Animation de Landing Page
        Animated.timing(landingPageTranslateX, {
          toValue: 0, // Retour au centre
          duration: 250,
          easing: Easing.bezier(0.4, 0, 1, 1),
          useNativeDriver: true,
        })
      ]).start();
      
      // Masquer la carte détaillée
      Animated.parallel([
        Animated.timing(errorCardScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(errorCardOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(detailCardOpacity, {
          toValue: 0,
          duration: 250,
          easing: Easing.bezier(0.4, 0, 1, 1),
          useNativeDriver: true,
        }),
        Animated.timing(errorCardTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(detailCardScale, {
          toValue: 0.95,
          duration: 250,
          easing: Easing.bezier(0.4, 0, 1, 1),
          useNativeDriver: true,
        })
      ]).start(() => {
        setShowDetailCard(false);
      });
    }
  };

  // Fonction pour animer uniquement le segment circulaire
  const handleSegmentAnimation = (index: number) => {
    // Crée une copie des données actuelles pour l'animation
    const currentData = [...data];
    const selectedItem = currentData[index];
    
    // Stoppe l'animation en cours si elle existe
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    // Vérifie si on est en train d'étendre ou de réduire le segment
    const expanding = !selectedItem.focused;
    
    // Valeurs par défaut des segments
    const defaultValues = [40, 30, 20, 10];
    
    // Prépare les nouvelles données finales
    let newData;
    
    if (expanding) {
      // Animer l'opacité du cercle extérieur à 0
      Animated.timing(mostOuterChartOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Mettre à jour l'index sélectionné
      setSelectedIndex(index);
      
      // Si on sélectionne le segment noir (index 3)
      if (index === 3) {
        // On garde uniquement le segment noir avec 80% et on ajoute une petite valeur aux autres segments
        // pour éviter que le graphique disparaisse
        newData = [
          { value: 5, color: '#78F5B2', label: '5%', focused: false },
          { value: 5, color: '#E97C64', label: '5%', focused: false },
          { value: 5, color: '#F2C55E', label: '5%', focused: false },
          { value: 85, color: '#000000', label: '85%', focused: true },
        ];
      } else {
        // Pour les autres segments, comportement normal
        newData = currentData.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              value: 80,
              focused: true,
              label: '80%'
            };
          } else {
            // Garder une petite valeur pour les autres segments pour qu'ils restent visibles
            return {
              ...item,
              value: 5,
              focused: false,
              label: '5%'
            };
          }
        });
      }
    } else {
      // Restaurer l'opacité du cercle extérieur
      Animated.timing(mostOuterChartOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Réinitialiser l'index sélectionné
      setSelectedIndex(null);
      
      // Retour aux valeurs par défaut
      newData = currentData.map((item, i) => {
        return {
          ...item,
          value: defaultValues[i],
          focused: false,
          label: `${defaultValues[i]}%`
        };
      });
    }
    
    // Création d'une animation progressive
    const animValue = new Animated.Value(0);
    
    // Ajoute un listener pour suivre les changements de valeur
    animValue.addListener(({value: progress}) => {
      // Calcule les valeurs intermédiaires pour chaque segment pendant l'animation
      const intermediateData = currentData.map((item, i) => {
        const startValue = item.value;
        const endValue = newData[i].value;
        const currentValue = startValue + (endValue - startValue) * progress;
        
        return {
          ...item,
          value: currentValue,
          label: `${Math.round(currentValue)}%`,
          focused: i === index ? newData[i].focused : false
        };
      });
      
      // Met à jour le graphique avec les valeurs intermédiaires
      animatedDataRef.current = intermediateData;
      setData([...intermediateData]);
    });
    
    // Configuration de l'animation avec effet de rebond
    animationRef.current = Animated.spring(animValue, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: false,
    });
    
    // Démarre l'animation
    animationRef.current.start(() => {
      // Nettoyage du listener
      animValue.removeAllListeners();
      
      // Mise à jour finale des données
      setData([...newData]);
    });
  };

  // Cette fonction est appelée lorsqu'un segment du graphique circulaire est pressé.
  const handlePress = (index: number) => {
    // Si c'est le segment d'erreur (index 3), déclencher aussi l'animation de la carte
    if (index === 3) {
      // Mesurer la position de la carte erreur et déclencher son animation
      if (errorCardRef.current) {
        // @ts-ignore - La méthode measure existe sur les refs de TouchableOpacity
        errorCardRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
          setErrorCardX(pageX);
          handleErrorCardPress();
        });
      } else {
        handleErrorCardPress();
      }
      return; // Ne pas continuer avec l'animation du segment, car handleErrorCardPress s'en occupe
    }
    
    // Pour les autres segments, animer normalement
    handleSegmentAnimation(index);
  };

  const renderCard = ({ item, index }: { item: JourneyCard, index: number }) => {
    // Si c'est la carte d'erreur (index 3)
    if (index === 3) {
      return (
        <TouchableOpacity
          onPress={() => {
            // Mesurer la position de la carte d'erreur avant de lancer l'animation
            if (errorCardRef.current) {
              // @ts-ignore - La méthode measure existe sur les refs de TouchableOpacity
              errorCardRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
                setErrorCardX(pageX);
                handleErrorCardPress();
              });
            } else {
              handleErrorCardPress();
            }
          }}
          activeOpacity={0.9}
          ref={errorCardRef}
        >
          <Animated.View 
            style={[
              styles.card, 
              { 
                borderLeftColor: item.color, 
                borderLeftWidth: 4,
                transform: [
                  { scale: errorCardScale },
                  { translateY: errorCardTranslateY }
                ],
                opacity: errorCardOpacity,
                zIndex: showDetailCard ? 0 : 1, // Carte erreur en arrière-plan quand détail est visible
              }
            ]}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.cardDetails}>
                <Text style={styles.cardDescription} numberOfLines={2} ellipsizeMode="tail">
                  {item.percentage} {item.description}
                </Text>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      );
    }
    
    // Pour les autres cartes
    return (
      <View style={[styles.card, { borderLeftColor: item.color, borderLeftWidth: 4 }]}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.cardDetails}>
            <Text style={styles.cardDescription} numberOfLines={2} ellipsizeMode="tail">
              {item.percentage} {item.description}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderDetailCard = () => {
    return (
      <Animated.View 
        style={[
          styles.card, 
          styles.detailCard,
          { 
            borderColor: '#000000', 
            borderWidth: 1,
            borderLeftWidth: 4,
            opacity: detailCardOpacity,
            position: 'absolute',
            transform: [
              { translateY: 0 },
              { scale: detailCardScale }
            ],
            left: errorCardX,
            zIndex: 10,
            overflow: 'hidden', // Assurer que le contenu ne déborde pas
          }
        ]}
      >
        <View style={styles.detailCardBackground}>
          <TouchableOpacity 
            style={styles.cardContent}
            onPress={handleErrorCardPress}
            activeOpacity={0.9}
          >
            <Text style={styles.cardTitle}>Site Exit</Text>
            <View style={styles.cardDetails}>
              <Text style={styles.cardDescription} numberOfLines={2} ellipsizeMode="tail">
                2.74% of sessions exited the site after following this journey
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const InteractiveCircularChart = () => {
    // Forcer l'opacité à 0 quand la carte est visible
    useEffect(() => {
      if (showDetailCard) {
        mostOuterChartOpacity.setValue(0);
      }
    }, [showDetailCard]);
    
    return (
      <View style={styles.chartsContainer}>
        {/* Graphique circulaire le plus externe */}
        <Animated.View 
          style={[
            styles.mostOuterChartContainer,
            { 
              opacity: mostOuterChartOpacity,
              display: showDetailCard ? 'none' : 'flex', // Masquer complètement si la carte est visible
              pointerEvents: showDetailCard ? 'none' : 'auto'
            }
          ]}
        >
          <CircularChart
            data={mostOuterData}
            size={MOST_OUTER_CHART_SIZE}
            strokeWidth={MOST_OUTER_CHART_STROKE_WIDTH}
            innerRadius={MOST_OUTER_CHART_INNER_RADIUS}
            showLabels={false}
          />
        </Animated.View>
        
        {/* Graphique circulaire externe */}
        <View style={styles.outerChartContainer}>
          <CircularChart
            data={outerData}
            size={OUTER_CHART_SIZE}
            strokeWidth={OUTER_CHART_STROKE_WIDTH}
            innerRadius={OUTER_CHART_INNER_RADIUS}
            showLabels={false}
          />
        </View>
        
        {/* Graphique circulaire interne */}
        <View style={styles.innerChartContainer}>
          <CircularChart
            data={data}
            size={INNER_CHART_SIZE}
            strokeWidth={INNER_CHART_STROKE_WIDTH}
            innerRadius={INNER_CHART_INNER_RADIUS}
            showLabels={false}
          />
          
          {/* Zone interactive pour le graphique interne */}
          <View style={styles.interactiveArea}>
            {data.map((_, index) => {
              const angle = (index / data.length) * 2 * Math.PI + Math.PI / data.length;
              const distance = 45; // Distance du centre pour placer les zones tactiles
              
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.touchArea}
                  onPress={() => handlePress(index)}
                >
                  <View
                    style={[
                      styles.touchTarget,
                      {
                        left: INTERACTIVE_AREA_SIZE/2 + Math.cos(angle) * distance,
                        top: INTERACTIVE_AREA_SIZE/2 + Math.sin(angle) * distance,
                        transform: [
                          { translateX: -TOUCH_TARGET_SIZE/2 }, 
                          { translateY: -TOUCH_TARGET_SIZE/2 }
                        ],
                      }
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => setIsMenuVisible(true)}
        >
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Journey Analysis</Text>
          <Text style={styles.subtitle}>Mar 27 → Apr 2 2025 (7days)</Text>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Icon name="edit" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.pageTypeContainer}>
        <View style={styles.pageTypesWrapper}>
          <Animated.View
            style={{
              transform: [{ translateX: landingPageTranslateX }]
            }}
          >
            <TouchableOpacity 
              style={[styles.pageTypeButton, styles.pageTypeButtonSelected]} 
            >
              <Text style={styles.pageTypeText}>Landing Page</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View
            style={{
              opacity: page1ButtonOpacity,
              transform: [{ translateX: page1ButtonTranslateX }]
            }}
          >
            <TouchableOpacity 
              style={[styles.pageTypeButton]}
            >
              <Text style={styles.pageTypeText}>Page 1</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <InteractiveCircularChart />
        
        {/* Cartes swipables */}
        <View style={styles.cardsContainer}>
          <FlatList
            data={cards}
            renderItem={renderCard}
            keyExtractor={(item, index) => `card-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={styles.cardsList}
            removeClippedSubviews={false}
          />
          {/* Carte détaillée rendue en dehors de la FlatList pour éviter les problèmes de swipe */}
          {showDetailCard && 
            <View style={styles.detailCardWrapper}>
              {renderDetailCard()}
            </View>
          }
        </View>
      </View>

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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'NewEdge',
    fontSize: 18,
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'NewEdge',
    fontSize: 13,
    color: '#666',
  },
  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    position: 'relative',
    width: '100%',
  },
  pageTypesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -65 }],
  },
  pageTypeButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  pageTypeButtonSelected: {
    backgroundColor: '#FFF',
    borderColor: '#E8E8E8',
  },
  pageTypeText: {
    fontFamily: 'NewEdge',
    fontSize: 13,
    color: '#000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 100,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  chartsContainer: {
    width: CHARTS_CONTAINER_SIZE,
    height: CHARTS_CONTAINER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  mostOuterChartContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerChartContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerChartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  interactiveArea: {
    position: 'absolute',
    width: INTERACTIVE_AREA_SIZE,
    height: INTERACTIVE_AREA_SIZE,
    top: (INNER_CHART_SIZE - INTERACTIVE_AREA_SIZE) / 2,
    left: (INNER_CHART_SIZE - INTERACTIVE_AREA_SIZE) / 2,
  },
  touchArea: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchTarget: {
    position: 'absolute',
    width: TOUCH_TARGET_SIZE,
    height: TOUCH_TARGET_SIZE,
  },
  cardsContainer: {
    width: '100%',
    marginTop: 32,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  cardsList: {
    paddingHorizontal: 20,
  },

  card: {
    width: CARD_WIDTH,
    height: 95,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: CARD_MARGIN,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1
  },
  detailCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    backgroundColor: '#fff',
  },
  detailCardBackground: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 9, // Légèrement inférieur au borderRadius de la carte
  },
  cardContent: {
    padding: 15,
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'NewEdge',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    flex: 1,
    width: '100%',
  },
  cardPercentage: {
    fontFamily: 'Inter',
    fontSize: 14,
    marginRight: 3,
  },
  cardDescription: {
    fontFamily: 'Inter',
    fontSize: 14
  },
  detailCardWrapper: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    pointerEvents: 'box-none', // Permet aux interactions de passer à travers quand il n'y a pas d'éléments
  },
}); 