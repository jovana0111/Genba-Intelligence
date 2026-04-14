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
      position: 'sticky' as any,
      top: 0,
      zIndex: 100,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },

    backBtn: { padding: 8, marginLeft: -8, borderRadius: 20 },
    headerTitleWrap: { flex: 1 },
    headerTitle: { fontSize: 20, fontWeight: "900", color: colors.headerFg, letterSpacing: -0.5 },
    scroll: { flex: 1, padding: 16 },
    search: {
      backgroundColor: '#fff',
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.foreground,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
    },
    empCard: {
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
    },
    empInitial: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14
    },
    empInitialText: { color: colors.primary, fontWeight: '900', fontSize: 18 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(33, 7, 6, 0.6)',
        justifyContent: 'center', // Centered for floating effect
        alignItems: 'center',
        padding: 20,
        backdropFilter: 'blur(8px)' as any,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 40, // Uniform radius for floating look
        padding: 32,
        width: '100%',
        maxWidth: 600, // Limit width on PC
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.2,
        shadowRadius: 30,
        elevation: 10,
    },

    modalHeader: {
        alignItems: 'center',
        marginBottom: 28
    },
    modalHandle: {
        width: 44,
        height: 5,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        marginBottom: 24,
        alignSelf: 'center'
    },
    modalTitle: { fontSize: 24, fontWeight: '900', color: colors.foreground, marginBottom: 4 },
    biometricGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 28,
        flexWrap: 'wrap' // Allow wrapping on very small screens
    },
    bioInputBox: {
        flex: 1,
        minWidth: 100, // Ensure they don't get TOO squashed
        backgroundColor: '#F8FAFC',
        borderRadius: 24,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
        justifyContent: 'center'
    },
    bioLabel: { fontSize: 11, fontWeight: '800', color: colors.mutedForeground, marginTop: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
    bioValue: { 
        fontSize: 22, 
        fontWeight: '900', 
        color: colors.foreground, 
        marginTop: 6,
        textAlign: 'center',
        padding: 0,
        width: '100%',
    },
    submitBtn: {
        backgroundColor: colors.primary,
        padding: 20,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
    },
    submitText: { color: '#fff', fontSize: 17, fontWeight: '900' },
    alertBox: { 
        backgroundColor: '#FFF1F2', 
        padding: 16, 
        borderRadius: 20, 
        marginBottom: 28, 
        flexDirection: 'row', 
        gap: 12, 
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#FFE4E6'
    }
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
        <Pressable 
          style={({ pressed }: any) => [s.backBtn, { opacity: pressed ? 0.7 : 1 }]} 
          onPress={() => navigate(-1)}
        >
          <ArrowLeft size={22} color={colors.headerFg} />
        </Pressable>
        <View style={s.headerTitleWrap}>
          <Text style={s.headerTitle}>Biometric Checkpoint</Text>
        </View>
        <HeartPulse size={24} color="#EF4444" />
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <TextInput
          style={s.search}
          placeholder="Escanear o buscar empleado..."
          placeholderTextColor={colors.mutedForeground}
          value={busqueda}
          onChangeText={setBusqueda}
        />

        {filtrados.map((emp) => (
            <Pressable 
                key={emp.id} 
                style={({ pressed }: any) => [s.empCard, { transform: [{ scale: pressed ? 0.98 : 1 }] }]} 
                onPress={() => setSelectedEmp(emp)}
            >
                <View style={s.empInitial}>
                    <Text style={s.empInitialText}>{emp.nombre[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '800', color: colors.foreground, fontSize: 16 }}>{emp.nombre}</Text>
                    <Text style={{ fontSize: 13, color: colors.secondary, marginTop: 2 }}>{areas.find(a => a.id === emp.areaId)?.nombre}</Text>
                </View>
                <CheckCircle2 size={22} color={colors.border} />
            </Pressable>
        ))}
      </ScrollView>

      <Modal visible={!!selectedEmp} transparent animationType="slide">
          <View style={s.modalOverlay}>
              <View style={s.modalContent}>
                  <View style={s.modalHandle} />
                  <View style={s.modalHeader}>
                      <Text style={s.modalTitle}>{selectedEmp?.nombre}</Text>
                      <Text style={{ fontSize: 14, color: colors.secondary, fontWeight: '500' }}>Ingreso Biométrico Manual</Text>
                  </View>

                  <View style={s.biometricGrid}>
                      <View style={[s.bioInputBox, temp && parseFloat(temp) > 37.5 && { borderColor: '#FECACA', backgroundColor: '#FFF5F5' }]}>
                          <Thermometer size={26} color="#F59E0B" />
                          <Text style={s.bioLabel}>Temp °C</Text>
                          <TextInput 
                            style={s.bioValue} 
                            value={temp} 
                            onChangeText={setTemp} 
                            keyboardType="numeric" 
                            placeholder="0.0"
                           />
                      </View>
                      <View style={[s.bioInputBox, bpm && parseInt(bpm) > 110 && { borderColor: '#FECACA', backgroundColor: '#FFF5F5' }]}>
                          <Activity size={26} color="#EF4444" />
                          <Text style={s.bioLabel}>BPM</Text>
                          <TextInput 
                            style={s.bioValue} 
                            value={bpm} 
                            onChangeText={setBpm} 
                            keyboardType="numeric" 
                            placeholder="0"
                          />
                      </View>
                      <View style={[s.bioInputBox, oxygen && parseInt(oxygen) < 94 && { borderColor: '#FECACA', backgroundColor: '#FFF5F5' }]}>
                          <Droplets size={26} color="#3B82F6" />
                          <Text style={s.bioLabel}>Oxygen %</Text>
                          <TextInput 
                            style={s.bioValue} 
                            value={oxygen} 
                            onChangeText={setOxygen} 
                            keyboardType="numeric" 
                            placeholder="0"
                          />
                      </View>
                  </View>

                  <View style={s.alertBox}>
                      <ShieldAlert size={20} color="#EF4444" style={{ marginTop: 2 }} />
                      <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 13, color: '#991B1B', fontWeight: '700', marginBottom: 2 }}>Protocolo de Seguridad</Text>
                          <Text style={{ fontSize: 12, color: '#991B1B', lineHeight: 16 }}>
                              Si los valores superan el límite estándar (37.5°C), se enviará una notificación automática a Seguridad Planta.
                          </Text>
                      </View>
                  </View>

                  <Pressable 
                    style={({ pressed }: any) => [s.submitBtn, { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] }]} 
                    onPress={handleSaveHealth}
                  >
                      <Text style={s.submitText}>Registrar Vitals</Text>
                      <Send size={20} color="#fff" />
                  </Pressable>

                  <Pressable 
                    style={{ marginTop: 20, padding: 12, alignItems: 'center' }} 
                    onPress={() => setSelectedEmp(null)}
                  >
                      <Text style={{ color: colors.secondary, fontWeight: '700', fontSize: 15 }}>Cerrar</Text>
                  </Pressable>
              </View>
          </View>
      </Modal>
    </View>

  );
}
