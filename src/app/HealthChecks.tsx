import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Pressable, TextInput, Modal } from "react-native";
import { useApp } from "../context/AppContext";
import { useColors } from "../hooks/useColors";
import { ArrowLeft, CheckCircle2, HeartPulse, XCircle, Thermometer, Activity, Droplets, ShieldAlert, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HealthChecks() {
  const colors = useColors();
  const navigate = useNavigate();
  const { empleados, areas, addHealthLog, addAnomalia } = useApp();
  const [busqueda, setBusqueda] = useState("");
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  
  // States for biometric data
  const [temp, setTemp] = useState("36.5");
  const [bpm, setBpm] = useState("75");
  const [oxygen, setOxygen] = useState("98");

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
    search: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.foreground,
      marginBottom: 16,
    },
    empCard: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 16,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border
    },
    empInitial: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    },
    empInitialText: { color: colors.primary, fontWeight: '800', fontSize: 16 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 20
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        marginBottom: 20
    },
    modalTitle: { fontSize: 20, fontWeight: '900', color: colors.foreground },
    biometricGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 24
    },
    bioInputBox: {
        flex: 1,
        backgroundColor: '#f8fafc',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border
    },
    bioLabel: { fontSize: 10, fontWeight: '700', color: colors.secondary, marginTop: 8, textTransform: 'uppercase' },
    bioValue: { fontSize: 18, fontWeight: '900', color: colors.foreground, marginTop: 4 },
    submitBtn: {
        backgroundColor: colors.primary,
        padding: 18,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    submitText: { color: '#fff', fontSize: 16, fontWeight: '800' }
  });

  const filtrados = empleados.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleSaveHealth = () => {
    if (!selectedEmp) return;

    const t = parseFloat(temp);
    const b = parseInt(bpm);
    const o = parseInt(oxygen);

    const isIssue = t > 37.5 || b > 110 || o < 94;

    addHealthLog({
        empleadoId: selectedEmp.id,
        nombre: selectedEmp.nombre,
        temp: t,
        bpm: b,
        oxygen: o,
        status: isIssue ? 'issue' : 'ok'
    });

    if (isIssue) {
        addAnomalia({
            empleadoNombre: selectedEmp.nombre,
            tipo: "ALERTA BIOMÉTRICA",
            detalle: `Valores fuera de rango: ${t}°C, ${b} BPM, ${o}% SpO2.`
        });
    }

    setSelectedEmp(null);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => navigate(-1)}>
          <ArrowLeft size={22} color={colors.headerFg} />
        </Pressable>
        <View style={s.headerTitleWrap}>
          <Text style={s.headerTitle}>Biometric Checkpoint</Text>
        </View>
        <HeartPulse size={24} color="#EF4444" />
      </View>

      <ScrollView style={s.scroll}>
        <TextInput
          style={s.search}
          placeholder="Escanear o buscar empleado..."
          value={busqueda}
          onChangeText={setBusqueda}
        />

        {filtrados.map((emp) => (
            <Pressable key={emp.id} style={s.empCard} onPress={() => setSelectedEmp(emp)}>
                <View style={s.empInitial}>
                    <Text style={s.empInitialText}>{emp.nombre[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '700', color: colors.foreground }}>{emp.nombre}</Text>
                    <Text style={{ fontSize: 11, color: colors.secondary }}>{areas.find(a => a.id === emp.areaId)?.nombre}</Text>
                </View>
                <CheckCircle2 size={20} color={colors.border} />
            </Pressable>
        ))}
      </ScrollView>

      <Modal visible={!!selectedEmp} transparent animationType="slide">
          <View style={s.modalOverlay}>
              <View style={s.modalContent}>
                  <View style={s.modalHandle} />
                  <View style={s.modalHeader}>
                      <Text style={s.modalTitle}>{selectedEmp?.nombre}</Text>
                      <Text style={{ fontSize: 12, color: colors.secondary }}>Ingreso Biométrico Manual</Text>
                  </View>

                  <View style={s.biometricGrid}>
                      <View style={s.bioInputBox}>
                          <Thermometer size={24} color="#F59E0B" />
                          <Text style={s.bioLabel}>Temp °C</Text>
                          <TextInput 
                            style={s.bioValue} 
                            value={temp} 
                            onChangeText={setTemp} 
                            keyboardType="numeric" 
                           />
                      </View>
                      <View style={s.bioInputBox}>
                          <Activity size={24} color="#EF4444" />
                          <Text style={s.bioLabel}>BPM</Text>
                          <TextInput 
                            style={s.bioValue} 
                            value={bpm} 
                            onChangeText={setBpm} 
                            keyboardType="numeric" 
                          />
                      </View>
                      <View style={s.bioInputBox}>
                          <Droplets size={24} color="#3B82F6" />
                          <Text style={s.bioLabel}>Oxygen %</Text>
                          <TextInput 
                            style={s.bioValue} 
                            value={oxygen} 
                            onChangeText={setOxygen} 
                            keyboardType="numeric" 
                          />
                      </View>
                  </View>

                  <View style={{ backgroundColor: '#fef2f2', padding: 12, borderRadius: 12, marginBottom: 24, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                      <ShieldAlert size={18} color="#EF4444" />
                      <Text style={{ fontSize: 11, color: '#991B1B', fontWeight: '500' }}>
                          Si los valores superan el límite estándar (37.5°C), se enviará una notificación a Seguridad Planta.
                      </Text>
                  </View>

                  <Pressable style={s.submitBtn} onPress={handleSaveHealth}>
                      <Text style={s.submitText}>Registrar Vitals</Text>
                      <Send size={20} color="#fff" />
                  </Pressable>

                  <Pressable style={{ marginTop: 16, alignItems: 'center' }} onPress={() => setSelectedEmp(null)}>
                      <Text style={{ color: colors.secondary, fontWeight: '700' }}>Cancelar</Text>
                  </Pressable>
              </View>
          </View>
      </Modal>
    </View>
  );
}
