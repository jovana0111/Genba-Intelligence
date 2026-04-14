import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Pressable, TextInput, Modal } from "react-native";
import { useApp } from "../context/AppContext";
import { useColors } from "../hooks/useColors";
import { ArrowLeft, AlertTriangle, Trash2, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Anomalias() {
  const colors = useColors();
  const navigate = useNavigate();
  const { anomalias, clearAnomalias, addAnomalia, empleados } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [newNombre, setNewNombre] = useState("");
  const [newDetalle, setNewDetalle] = useState("");

  const handleReport = () => {
    if (!newNombre || !newDetalle) return;
    addAnomalia({
      empleadoNombre: newNombre,
      tipo: "REPORTE MANUAL",
      detalle: newDetalle,
    });
    setNewNombre("");
    setNewDetalle("");
    setModalVisible(false);
  };

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
    card: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderLeftWidth: 4,
      borderLeftColor: '#EF4444',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      elevation: 2,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    tipo: { fontSize: 10, fontWeight: '800', color: '#EF4444', textTransform: 'uppercase' },
    time: { fontSize: 10, color: colors.secondary },
    nombre: { fontSize: 15, fontWeight: '700', color: colors.foreground, marginBottom: 4 },
    detalle: { fontSize: 13, color: colors.secondary, lineHeight: 18 },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
    emptyText: { fontSize: 16, color: colors.secondary, marginTop: 12 },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: colors.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        elevation: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        elevation: 5,
    },
    modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 20, color: colors.foreground },
    input: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        fontSize: 14,
    },
    submitBtn: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitText: { color: '#fff', fontWeight: '700', fontSize: 15 }
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => navigate(-1)}>
          <ArrowLeft size={22} color={colors.headerFg} />
        </Pressable>
        <View style={s.headerTitleWrap}>
          <Text style={s.headerTitle}>Anomalías Industrial</Text>
        </View>
        <Pressable onPress={clearAnomalias}>
            <Trash2 size={20} color={colors.headerFg} />
        </Pressable>
      </View>

      <ScrollView style={s.scroll}>
        {anomalias.length === 0 ? (
          <View style={s.empty}>
            <AlertTriangle size={48} color={colors.border} />
            <Text style={s.emptyText}>No hay reportes de UACJ</Text>
          </View>
        ) : (
          anomalias.map((anom) => (
            <View key={anom.id} style={s.card}>
              <View style={s.cardHeader}>
                <Text style={s.tipo}>{anom.tipo}</Text>
                <Text style={s.time}>{anom.fecha} - {anom.hora}</Text>
              </View>
              <Text style={s.nombre}>{anom.empleadoNombre}</Text>
              <Text style={s.detalle}>{anom.detalle}</Text>
            </View>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <Pressable style={s.fab} onPress={() => setModalVisible(true)}>
          <Plus size={24} color="#fff" />
      </Pressable>

      <Modal transparent visible={modalVisible} animationType="slide">
          <View style={s.modalOverlay}>
              <View style={s.modalContent}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <Text style={s.modalTitle}>Reportar Anomalía</Text>
                      <Pressable onPress={() => setModalVisible(false)}><X size={24} color={colors.secondary} /></Pressable>
                  </View>
                  
                  <TextInput 
                    placeholder="Nombre del operario / Área"
                    value={newNombre}
                    onChangeText={setNewNombre}
                    style={s.input}
                  />

                  <TextInput 
                    placeholder="Descripción del incidente (EPP, Calidad, Maquinaria...)"
                    value={newDetalle}
                    onChangeText={setNewDetalle}
                    multiline
                    numberOfLines={4}
                    style={[s.input, { height: 100, textAlignVertical: 'top' }]}
                  />

                  <Pressable style={s.submitBtn} onPress={handleReport}>
                      <Text style={s.submitText}>Enviar Reporte Planta</Text>
                  </Pressable>
              </View>
          </View>
      </Modal>
    </View>
  );
}
