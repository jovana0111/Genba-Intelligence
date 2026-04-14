import React, { useMemo } from "react";
import { View, StyleSheet, Text, ScrollView, Pressable } from "react-native";
import { useApp } from "../context/AppContext";
import { useColors } from "../hooks/useColors";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Users, Target, Shield, HeartPulse, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ASIReport() {
  const colors = useColors();
  const navigate = useNavigate();
  const { registros, anomalias, eppChecks, empleados, healthLogs } = useApp();

  // Calculamos métricas
  const stats = useMemo(() => {
    const totalChecks = eppChecks.length;
    const cumpleEPP = eppChecks.filter(c => c.status === 'cumple').length;
    const eppScore = totalChecks > 0 ? (cumpleEPP / totalChecks) * 100 : 100;

    const totalHealth = healthLogs.length;
    const healthOk = healthLogs.filter(h => h.status === 'ok').length;
    const healthScore = totalHealth > 0 ? (healthOk / totalHealth) * 100 : 100;

    const totalAsistencia = registros.length;

    const totalAnomalias = anomalias.length;
    const safetyScore = Math.max(0, 100 - (totalAnomalias * 2)); // Ejemplo: cada anomalía baja 2 puntos

    return {
        eppCompliance: eppScore.toFixed(0),
        healthStability: healthScore.toFixed(0),
        safetyIndex: ((eppScore * 0.4) + (healthScore * 0.4) + (safetyScore * 0.2)).toFixed(0),
        anomaliasCount: totalAnomalias,
        totalChecks
    };
  }, [eppChecks, anomalias, healthLogs]);

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
    sectionTitle: { fontSize: 16, fontWeight: "800", color: colors.foreground, marginBottom: 12, marginTop: 10 },
    mainCard: {
        backgroundColor: colors.primary,
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        elevation: 10,
    },
    mainVal: { fontSize: 36, fontWeight: '900', color: '#fff' },
    mainLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '700', textTransform: 'uppercase' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
    card: {
        width: '47%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border
    },
    cardIcon: { marginBottom: 10 },
    cardVal: { fontSize: 20, fontWeight: '900', color: colors.foreground },
    cardLabel: { fontSize: 10, color: colors.secondary, fontWeight: '700' },
    listCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: colors.border
    },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => navigate(-1)}>
          <ArrowLeft size={22} color={colors.headerFg} />
        </Pressable>
        <View style={s.headerTitleWrap}>
          <Text style={s.headerTitle}>ASI - Industrial Report</Text>
        </View>
        <FileText size={22} color={colors.primary} />
      </View>

      <ScrollView style={s.scroll}>
        <View style={s.mainCard}>
            <Text style={s.mainVal}>{stats.safetyIndex}%</Text>
            <Text style={s.mainLabel}>Safety & Compliance Score (Global)</Text>
            <View style={{ height: 1.5, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 15 }} />
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '500' }}>
               Análisis basado en {stats.totalChecks} inspecciones y {stats.anomaliasCount} reportes activos.
            </Text>
        </View>

        <Text style={s.sectionTitle}>Key Performance Indicators</Text>
        <View style={s.grid}>
            <View style={s.card}>
                <Shield size={20} color="#10B981" style={s.cardIcon} />
                <Text style={s.cardVal}>{stats.eppCompliance}%</Text>
                <Text style={s.cardLabel}>EPP CUMPLIDO</Text>
            </View>
            <View style={s.card}>
                <HeartPulse size={20} color="#EF4444" style={s.cardIcon} />
                <Text style={s.cardVal}>{stats.healthStability}%</Text>
                <Text style={s.cardLabel}>ESTABILIDAD SALUD</Text>
            </View>
            <View style={s.card}>
                <AlertTriangle size={20} color="#F59E0B" style={s.cardIcon} />
                <Text style={s.cardVal}>{stats.anomaliasCount}</Text>
                <Text style={s.cardLabel}>INCIDENCIAS</Text>
            </View>
            <View style={s.card}>
                <Users size={20} color="#3B82F6" style={s.cardIcon} />
                <Text style={s.cardVal}>{empleados.length}</Text>
                <Text style={s.cardLabel}>STAFF TOTAL</Text>
            </View>
        </View>

        <Text style={s.sectionTitle}>Últimos Registros Biométricos</Text>
        {healthLogs.slice(0, 3).map(log => (
            <View key={log.id} style={s.listCard}>
                <Activity size={18} color={log.status === 'ok' ? '#10B981' : '#EF4444'} />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: colors.foreground }}>{log.nombre}</Text>
                    <Text style={{ fontSize: 10, color: colors.secondary }}>{log.temp}°C | {log.bpm} BPM | {log.oxygen}% SpO2</Text>
                </View>
                <Text style={{ fontSize: 10, fontWeight: '700', color: colors.secondary }}>{log.hora}</Text>
            </View>
        ))}

        <Text style={s.sectionTitle}>Recientes Inspecciones EPP</Text>
        {eppChecks.slice(0, 5).map(check => (
            <View key={check.id} style={s.listCard}>
                <View style={[s.statusDot, { backgroundColor: check.status === 'cumple' ? '#10B981' : '#EF4444' }]} />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: colors.foreground }}>{check.nombre}</Text>
                    <Text style={{ fontSize: 10, color: colors.secondary }}>{check.fecha} - {check.hora}</Text>
                </View>
                <Text style={{ fontSize: 11, fontWeight: '800', color: check.status === 'cumple' ? '#10B981' : '#EF4444' }}>
                    {check.status.toUpperCase()}
                </Text>
            </View>
        ))}

        {eppChecks.length === 0 && (
            <Text style={{ textAlign: 'center', color: colors.secondary, fontSize: 12, marginTop: 20 }}>No hay inspecciones registradas todavía.</Text>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
