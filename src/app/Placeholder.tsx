import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import { useColors } from "../hooks/useColors";
import { ArrowLeft, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Placeholder({ title }: { title: string }) {
  const colors = useColors();
  const navigate = useNavigate();

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.headerBg,
      paddingTop: 16,
      paddingBottom: 20,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    backBtn: {
      padding: 8,
      marginLeft: -8,
      borderRadius: 20,
    },
    headerTitleWrap: { flex: 1 },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.headerFg,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    iconWrap: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 100,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 4,
    },
    textTitle: {
      fontSize: 22,
      fontWeight: "800",
      color: colors.foreground,
      marginBottom: 8,
      textAlign: "center",
    },
    textDesc: {
      fontSize: 14,
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 20,
    },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => navigate(-1)}>
          <ArrowLeft size={22} color={colors.headerFg} />
        </Pressable>
        <View style={s.headerTitleWrap}>
          <Text style={s.headerTitle}>{title}</Text>
        </View>
      </View>

      <View style={s.content}>
        <View style={s.iconWrap}>
          <Clock size={48} color={colors.primary} />
        </View>
        <Text style={s.textTitle}>Módulo en Desarrollo</Text>
        <Text style={s.textDesc}>
          El módulo de {title} estará disponible próximamente en futuras actualizaciones.
        </Text>
      </View>
    </View>
  );
}
