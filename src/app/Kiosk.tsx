import { View, StyleSheet, Text, Pressable, ScrollView, Image, Animated } from "react-native";
import { useNavigate } from "react-router-dom";
import { useColors } from "../hooks/useColors";
import { 
  LayoutDashboard, 
  MapPin, 
  ClipboardList, 
  HeartPulse, 
  AlertTriangle, 
  MonitorSmartphone, 
  FileText,
  HelpCircle,
  X 
} from "lucide-react";
import logo from "../../assets/images/logo.png";
import { useState, useRef } from "react";

export default function Kiosk() {
  const colors = useColors();
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;

  // Header Animation values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [220, 100],
    extrapolate: 'clamp'
  });

  const logoSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [64, 40],
    extrapolate: 'clamp'
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const menuItems = [
    { title: "Dashboard Mieruka", icon: LayoutDashboard, route: "/mieruka", color: "#3B82F6" }, // Blue
    { title: "Stations", icon: MapPin, route: "/stations", color: "#10B981" }, // Green
    { title: "Requirements", icon: ClipboardList, route: "/requirements", color: "#F59E0B" }, // Amber
    { title: "Health Checks", icon: HeartPulse, route: "/health-checks", color: "#EF4444" }, // Red
    { title: "Anomalies", icon: AlertTriangle, route: "/anomalies", color: "#F97316" }, // Orange
    { title: "Kiosk Sessions", icon: MonitorSmartphone, route: "/registro", color: "#6366F1" }, // Indigo
    { title: "ASI Report", icon: FileText, route: "/asi-report", color: "#8B5CF6" }, // Violet
  ];

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.headerBg,
      paddingHorizontal: 24,
      alignItems: "center",
      justifyContent: 'center',
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      zIndex: 100,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    helpKioskBtn: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 200, // Above animated header
    },
    logo: { borderRadius: 12 },
    title: {
      fontSize: 22,
      fontWeight: "900",
      color: colors.headerFg,
      letterSpacing: -1,
      textAlign: "center",
      marginTop: 8
    },
    subtitle: {
      fontSize: 12,
      color: "rgba(241,230,210,0.5)",
      marginTop: 2,
      textAlign: "center",
      fontWeight: "600"
    },
    tooltipOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        zIndex: 5000,
    },
    tooltipCard: {
        padding: 24,
        borderRadius: 30,
        width: '100%',
        maxWidth: 500,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.3,
        shadowRadius: 30,
    },
    tooltipText: { color: '#2D1D1D', fontSize: 13, lineHeight: 18, marginBottom: 12, fontWeight: '500' },
    scroll: { flex: 1 },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      padding: 16,
      paddingTop: 240, // Space for the absolute header
      paddingBottom: 60,
      gap: 12,
    },
    card: {
      width: "48%",
      minWidth: 140,
      backgroundColor: '#fff',
      borderRadius: 24,
      padding: 20,
      alignItems: "center",
      justifyContent: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.02)',
    },
    iconWrap: {
      width: 60,
      height: 60,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 14,
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: colors.foreground,
      textAlign: "center",
      lineHeight: 18,
    },
  });

  return (
    <View style={s.container}>
      <Pressable style={s.helpKioskBtn} onPress={() => setShowHelp(true)}>
          <HelpCircle size={22} color={colors.headerFg} />
      </Pressable>

      <Animated.View style={[s.header, { height: headerHeight }]}>
        <Animated.Image 
            source={logo as any} 
            style={[s.logo, { width: logoSize, height: logoSize }]} 
            resizeMode="contain" 
        />
        <Animated.View style={{ opacity: titleOpacity, alignItems: 'center' }}>
            <Text style={s.title}>Genba Intelligence</Text>
            <Text style={s.subtitle}>Kiosco de Aplicaciones</Text>
        </Animated.View>
      </Animated.View>

      {showHelp && (
          <View style={s.tooltipOverlay}>
              <View style={[s.tooltipCard, { backgroundColor: '#FDFBF7', borderColor: '#8B2F2F', borderWidth: 1.5 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                      <HelpCircle size={28} color="#8B2F2F" />
                      <Text style={{ fontSize: 18, fontWeight: '900', color: '#8B2F2F', marginLeft: 10 }}>Guía Genba</Text>
                  </View>
                  <Text style={s.tooltipText}><Text style={{ fontWeight: '900', color: '#8B2F2F' }}>• STATIONS:</Text> Ubicación en tiempo real del personal.</Text>
                  <Text style={s.tooltipText}><Text style={{ fontWeight: '900', color: '#8B2F2F' }}>• REQUIREMENTS:</Text> Inspección de equipo de seguridad (EPP).</Text>
                  <Text style={s.tooltipText}><Text style={{ fontWeight: '900', color: '#8B2F2F' }}>• HEALTH:</Text> Monitoreo de signos vitales.</Text>
                  <Text style={s.tooltipText}><Text style={{ fontWeight: '900', color: '#8B2F2F' }}>• ANOMALIES:</Text> Registro de abandonos o fallas.</Text>
                  
                  <Pressable style={{ alignSelf: 'center', marginTop: 20, padding: 12, backgroundColor: '#8B2F2F', borderRadius: 16, width: '100%', alignItems: 'center' }} onPress={() => setShowHelp(false)}>
                      <Text style={{ color: '#fff', fontWeight: '900', fontSize: 13 }}>Continuar</Text>
                  </Pressable>
              </View>
          </View>
      )}

      <Animated.ScrollView 
        style={s.scroll} 
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
        )}
      >
        <View style={s.grid}>
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Pressable
                key={idx}
                style={({ pressed }) => [
                  s.card,
                  pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                ]}
                onPress={() => navigate(item.route)}
              >
                <View style={[s.iconWrap, { backgroundColor: item.color + "20" }]}>
                  <Icon size={26} color={item.color} />
                </View>
                <Text style={s.cardTitle}>{item.title}</Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

