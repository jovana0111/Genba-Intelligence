import React from "react";
import { View, StyleSheet, Text, ScrollView, Pressable } from "react-native";
import { useColors } from "../hooks/useColors";
import { ArrowLeft, BarChart3, TrendingUp, Leaf, Factory, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { ShieldCheck } from "lucide-react";

export default function Mieruka() {
  const colors = useColors();
  const navigate = useNavigate();
  const { eppChecks } = useApp();

  const safetyCompliance = eppChecks.length > 0 
    ? ((eppChecks.filter(c => c.status === 'cumple').length / eppChecks.length) * 100).toFixed(0)
    : "100";

  const areaMetrics = [
    { label: "Estampado (Prensa)", val: "94%", color: "#3B82F6" },
    { label: "Soldadura (Robótica)", val: "89%", color: "#8B5CF6" },
    { label: "Ensamble Final", val: "91%", color: "#10B981" },
  ];

  const carbonData = [
    { label: "Ahorro CO2 (Reciclaje)", val: "1.2 Tons", icon: Leaf, color: "#10B981" },
    { label: "Eficiencia Energética", val: "85%", icon: Factory, color: "#F59E0B" },
  ];

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
    backBtn: { padding: 8, marginLeft: -8, borderRadius: 20 },
    headerTitleWrap: { flex: 1 },
    headerTitle: { fontSize: 18, fontWeight: "700", color: colors.headerFg },
    scroll: { flex: 1, padding: 16 },
    title: { fontSize: 16, fontWeight: "800", color: colors.foreground, marginBottom: 16 },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
    card: {
      width: "47%",
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardVal: { fontSize: 22, fontWeight: "900", color: colors.foreground },
    cardLabel: { fontSize: 10, color: colors.secondary, fontWeight: "700", marginTop: 4 },
    chartArea: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    barRow: { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 15, justifyContent: 'center' },
    bar: { width: 30, borderRadius: 8, position: 'relative' },
    barLabel: { position: 'absolute', bottom: -20, left: -5, fontSize: 8, fontWeight: '700', color: colors.secondary },
    envCard: {
        backgroundColor: '#f0fdf4',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#bbf7d0',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20
    }
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => navigate(-1)}>
          <ArrowLeft size={22} color={colors.headerFg} />
        </Pressable>
        <View style={s.headerTitleWrap}>
          <Text style={s.headerTitle}>UACJ - Dashboard Mieruka</Text>
        </View>
        <BarChart3 size={24} color={colors.primary} />
      </View>

      <ScrollView style={s.scroll}>
        <Text style={s.title}>Productividad por Área (Stamping & Weld)</Text>
        <View style={s.grid}>
          {areaMetrics.map((m, i) => (
            <View key={i} style={[s.card, { borderLeftWidth: 4, borderLeftColor: m.color }]}>
              <Text style={s.cardVal}>{m.val}</Text>
              <Text style={s.cardLabel}>{m.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ backgroundColor: '#eff6ff', padding: 20, borderRadius: 24, marginBottom: 20, borderWidth: 1, borderColor: '#dbeafe', flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: parseInt(safetyCompliance) > 90 ? '#10B981' : '#F59E0B' }}>
                <Text style={{ fontWeight: '900', color: colors.foreground }}>{safetyCompliance}%</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: colors.foreground }}>Safety Compliance (EPP)</Text>
                <Text style={{ fontSize: 11, color: colors.secondary }}>Basado en {eppChecks.length} inspecciones recientes.</Text>
            </View>
            <ShieldCheck size={24} color={parseInt(safetyCompliance) > 90 ? '#10B981' : '#F59E0B'} />
        </View>

        <Text style={s.title}>Huella de Carbono / Eco-Efficiency</Text>
        {carbonData.map((d, i) => (
            <View key={i} style={s.envCard}>
                <d.icon size={32} color={d.color} />
                <View>
                    <Text style={{ fontSize: 18, fontWeight: '900', color: colors.foreground }}>{d.val}</Text>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: colors.secondary, textTransform: 'uppercase' }}>{d.label}</Text>
                </View>
            </View>
        ))}

        <View style={s.chartArea}>
            <Text style={[s.title, { textAlign: 'center' }]}>Rendimiento por Turno</Text>
            <View style={s.barRow}>
                <View style={[s.bar, { height: '80%', backgroundColor: colors.primary }]}>
                    <Text style={s.barLabel}>T1 (Matutino)</Text>
                </View>
                <View style={[s.bar, { height: '65%', backgroundColor: colors.secondary }]}>
                    <Text style={s.barLabel}>T2 (Nocturno)</Text>
                </View>
                <View style={[s.bar, { height: '90%', backgroundColor: '#10B981' }]}>
                    <Text style={s.barLabel}>Meta KPI</Text>
                </View>
            </View>
        </View>

        <View style={{ backgroundColor: colors.accent, padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TrendingUp size={24} color={colors.primary} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary, flex: 1 }}>
                Producción de Cajas de Batería y Rieles de Asiento incrementó un 5% este turno.
            </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
