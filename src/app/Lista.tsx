import { Trash2, Clipboard, Download, Clock, ChevronDown, ChevronUp, Edit2, X, Check } from "lucide-react";
import { useState, useMemo } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TextInput,
} from "react-native";
import logo from "../../assets/images/logo.png";

import { RegistroAsistencia, useApp } from "../context/AppContext";
import { useColors } from "../hooks/useColors";

function toOdooDatetime(dt: string): string {
  const match = dt.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})$/);
  if (match) return `${match[1]} ${match[2]}:00`;
  return dt;
}

function registrosToCSV(registros: RegistroAsistencia[]): string {
  const header = "sep=;\nArea;Empleado;Turno;Entrada;Salida\n";
  const rows = registros
    .map(
      (r) =>
        `"${r.areaNombre}";"${r.empleadoNombre}";"${r.turno}";"${toOdooDatetime(r.entrada)}";"${toOdooDatetime(r.salida)}"`
    )
    .join("\n");
  return header + rows;
}

export default function ListaScreen() {
  const colors = useColors();
  const { registros, deleteRegistro, clearRegistros, updateRegistro } = useApp();
  const [expandedTurns, setExpandedTurns] = useState<string[]>([]);
  const [editItem, setEditItem] = useState<RegistroAsistencia | null>(null);

  // Agrupamiento por Turno
  const groupedByTurn = useMemo(() => {
    const groups: Record<string, RegistroAsistencia[]> = {};
    registros.forEach((r) => {
      if (!groups[r.turno]) groups[r.turno] = [];
      groups[r.turno].push(r);
    });
    return groups;
  }, [registros]);

  const toggleTurn = (turn: string) => {
    setExpandedTurns(prev => 
      prev.includes(turn) ? prev.filter(t => t !== turn) : [...prev, turn]
    );
  };

  const handleExportarShift = (turn: string, data: RegistroAsistencia[]) => {
    const csv = registrosToCSV(data);
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `asistencia_${dateStr}_${turn.replace(/\s+/g, '_')}.csv`;

    try {
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      Alert.alert("Error", "No se pudo exportar el archivo");
    }
  };

  const handleUpdate = () => {
    if (editItem) {
      updateRegistro(editItem);
      setEditItem(null);
    }
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.headerBg,
      paddingTop: 14,
      paddingBottom: 18,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    logo: { width: 38, height: 38, borderRadius: 8 },
    headerInfo: { flex: 1 },
    headerTitle: { fontSize: 18, fontWeight: "700", color: colors.headerFg },
    headerCount: { fontSize: 11, color: "rgba(241,230,210,0.65)" },
    scroll: { flex: 1 },
    turnSection: {
      backgroundColor: '#fff',
      marginHorizontal: 16,
      marginTop: 12,
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      elevation: 2,
    },
    turnHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.accent,
    },
    turnTitle: { fontSize: 15, fontWeight: '800', color: colors.foreground, flex: 1 },
    empRow: {
        padding: 14,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    empTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    empName: { fontSize: 14, fontWeight: '700', color: colors.foreground, flex: 1 },
    areaTag: { backgroundColor: colors.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8 },
    areaText: { fontSize: 9, color: '#fff', fontWeight: '800' },
    timeRow: { flexDirection: 'row', gap: 12 },
    timeBox: { flex: 1 },
    timeLabel: { fontSize: 8, color: colors.secondary, fontWeight: '700', textTransform: 'uppercase' },
    timeVal: { fontSize: 11, color: colors.foreground, fontWeight: '600' },
    actions: { flexDirection: 'row', gap: 10 },
    iconBtn: { padding: 4 },
    exportShiftBtn: {
        padding: 10,
        backgroundColor: colors.secondary,
        margin: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6
    },
    exportText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 24 },
    modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 20 },
    inputLabel: { fontSize: 11, fontWeight: '700', color: colors.secondary, marginBottom: 4 },
    input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, marginBottom: 16 },
    modalBtns: { flexDirection: 'row', gap: 12 },
    modalBtn: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Image source={logo as any} style={s.logo} resizeMode="contain" />
        <View style={s.headerInfo}>
            <Text style={s.headerTitle}>Gestión de Turnos</Text>
            <Text style={s.headerCount}>{registros.length} registros totales</Text>
        </View>
        <Pressable onPress={() => clearRegistros()} style={{ padding: 8 }}>
            <Trash2 size={20} color={colors.headerFg} />
        </Pressable>
      </View>

      <ScrollView style={s.scroll}>
        {Object.keys(groupedByTurn).length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 100 }}>
                <Clipboard size={48} color={colors.border} />
                <Text style={{ marginTop: 12, color: colors.secondary }}>No hay registros por turno</Text>
            </View>
        ) : (
            Object.entries(groupedByTurn).map(([turn, emps]) => (
                <View key={turn} style={s.turnSection}>
                    <Pressable style={s.turnHeader} onPress={() => toggleTurn(turn)}>
                        <Clock size={18} color={colors.primary} style={{ marginRight: 10 }} />
                        <Text style={s.turnTitle}>{turn}</Text>
                        <Text style={{ fontSize: 12, color: colors.secondary, marginRight: 10 }}>{emps.length} pers.</Text>
                        {expandedTurns.includes(turn) ? <ChevronUp size={20} color={colors.secondary} /> : <ChevronDown size={20} color={colors.secondary} />}
                    </Pressable>

                    {expandedTurns.includes(turn) && (
                        <View>
                            {emps.map(emp => (
                                <View key={emp.id} style={s.empRow}>
                                    <View style={s.empTop}>
                                        <View style={s.areaTag}><Text style={s.areaText}>{emp.areaNombre}</Text></View>
                                        <Text style={s.empName}>{emp.empleadoNombre}</Text>
                                        <View style={s.actions}>
                                            <Pressable style={s.iconBtn} onPress={() => setEditItem(emp)}>
                                                <Edit2 size={14} color={colors.primary} />
                                            </Pressable>
                                            <Pressable style={s.iconBtn} onPress={() => deleteRegistro(emp.id)}>
                                                <Trash2 size={14} color={colors.destructive} />
                                            </Pressable>
                                        </View>
                                    </View>
                                    <View style={s.timeRow}>
                                        <View style={s.timeBox}>
                                            <Text style={s.timeLabel}>Entrada</Text>
                                            <Text style={s.timeVal}>{emp.entrada}</Text>
                                        </View>
                                        <View style={s.timeBox}>
                                            <Text style={s.timeLabel}>Salida</Text>
                                            <Text style={s.timeVal}>{emp.salida}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                            <Pressable style={s.exportShiftBtn} onPress={() => handleExportarShift(turn, emps)}>
                                <Download size={16} color="#fff" />
                                <Text style={s.exportText}>Exportar {turn}</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal para Editar Registro */}
      <Modal visible={!!editItem} transparent animationType="fade">
          <View style={s.modalOverlay}>
              <View style={s.modalContent}>
                  <Text style={s.modalTitle}>Editar Registro</Text>
                  
                  <Text style={s.inputLabel}>Nombre del Empleado</Text>
                  <TextInput 
                    style={s.input} 
                    value={editItem?.empleadoNombre} 
                    onChangeText={txt => setEditItem(prev => prev ? {...prev, empleadoNombre: txt} : null)}
                  />

                  <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.inputLabel}>Hora Entrada</Text>
                        <TextInput 
                            style={s.input} 
                            value={editItem?.entrada} 
                            onChangeText={txt => setEditItem(prev => prev ? {...prev, entrada: txt} : null)}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.inputLabel}>Hora Salida</Text>
                        <TextInput 
                            style={s.input} 
                            value={editItem?.salida} 
                            onChangeText={txt => setEditItem(prev => prev ? {...prev, salida: txt} : null)}
                        />
                      </View>
                  </View>

                  <View style={s.modalBtns}>
                      <Pressable style={[s.modalBtn, { backgroundColor: '#f1f5f9' }]} onPress={() => setEditItem(null)}>
                          <X size={18} color={colors.secondary} />
                          <Text style={{ color: colors.secondary, fontWeight: '700' }}>Cancelar</Text>
                      </Pressable>
                      <Pressable style={[s.modalBtn, { backgroundColor: colors.primary }]} onPress={handleUpdate}>
                          <Check size={18} color="#fff" />
                          <Text style={{ color: '#fff', fontWeight: '700' }}>Guardar</Text>
                      </Pressable>
                  </View>
              </View>
          </View>
      </Modal>
    </View>
  );
}
