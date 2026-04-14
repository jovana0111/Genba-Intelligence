import { View, StyleSheet, Text, Pressable, ScrollView, Image } from "react-native";
import { useNavigate } from "react-router-dom";
import { useColors } from "../hooks/useColors";
import { 
  LayoutDashboard, 
  MapPin, 
  ClipboardList, 
  HeartPulse, 
  AlertTriangle, 
  MonitorSmartphone, 
  FileText 
} from "lucide-react";
import logo from "../../assets/images/logo.png";

export default function Kiosk() {
  const colors = useColors();
  const navigate = useNavigate();

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
      paddingTop: 20,
      paddingBottom: 24,
      paddingHorizontal: 20,
      alignItems: "center",
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    logo: { width: 56, height: 56, borderRadius: 12, marginBottom: 12 },
    title: {
      fontSize: 22,
      fontWeight: "800",
      color: colors.headerFg,
      letterSpacing: -0.5,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 13,
      color: "rgba(241,230,210,0.7)",
      marginTop: 4,
      textAlign: "center",
    },
    scroll: { flex: 1, padding: 16 },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingBottom: 40,
    },
    card: {
      width: "48%",
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    iconWrap: {
      width: 54,
      height: 54,
      borderRadius: 27,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.cardForeground,
      textAlign: "center",
      lineHeight: 18,
    },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Image source={logo as any} style={s.logo} resizeMode="contain" />
        <Text style={s.title}>Genba Intelligence</Text>
        <Text style={s.subtitle}>Kiosco de Aplicaciones</Text>
      </View>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
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
      </ScrollView>
    </View>
  );
}
