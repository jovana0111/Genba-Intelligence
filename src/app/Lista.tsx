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
      paddingTop: 16,
      paddingBottom: 22,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    logo: { width: 44, height: 44, borderRadius: 12 },
    headerInfo: { flex: 1 },
    headerTitle: { fontSize: 22, fontWeight: "900", color: colors.headerFg, letterSpacing: -0.5 },
    headerCount: { fontSize: 13, color: "rgba(241,230,210,0.5)", fontWeight: '500' },
    scroll: { flex: 1 },
    turnSection: {
      backgroundColor: '#fff',
      marginHorizontal: 16,
      marginTop: 20,
      borderRadius: 28,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.05)',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.05,
      shadowRadius: 20,
    },
    turnHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 18,
      backgroundColor: colors.accent,
    },
    turnTitle: { fontSize: 17, fontWeight: '900', color: colors.foreground, flex: 1 },
    empRow: {
        padding: 18,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    empTop: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 10,
        gap: 8 
    },
    empName: { 
        fontSize: 15, 
        fontWeight: '800', 
        color: colors.foreground, 
        flex: 1,
        flexWrap: 'wrap' // Ensure long names wrap
    },
    areaTag: { 
        backgroundColor: colors.primary, 
        paddingHorizontal: 10, 
        paddingVertical: 4, 
        borderRadius: 8,
    },
    areaText: { fontSize: 10, color: '#fff', fontWeight: '900', textTransform: 'uppercase' },
    timeRow: { 
        flexDirection: 'row', 
        gap: 16,
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 16,
    },
    timeBox: { flex: 1 },
    timeLabel: { fontSize: 9, color: colors.mutedForeground, fontWeight: '800', textTransform: 'uppercase', marginBottom: 2, letterSpacing: 0.5 },
    timeVal: { fontSize: 13, color: colors.foreground, fontWeight: '700' },
    actions: { flexDirection: 'row', gap: 12 },
    iconBtn: { 
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center'
    },
    exportShiftBtn: {
        padding: 16,
        backgroundColor: colors.secondary,
        margin: 18,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    exportText: { color: '#fff', fontSize: 14, fontWeight: '800' },
    modalOverlay: { 
        flex: 1, 
        backgroundColor: 'rgba(22, 5, 4, 0.4)', 
        justifyContent: 'center', 
        padding: 24,
        backdropFilter: 'blur(4px)' as any 
    },
    modalContent: { 
        backgroundColor: '#fff', 
        borderRadius: 32, 
        padding: 28,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
    },
    modalTitle: { fontSize: 22, fontWeight: '900', color: colors.foreground, marginBottom: 24, letterSpacing: -0.5 },
    inputLabel: { fontSize: 12, fontWeight: '800', color: colors.mutedForeground, marginBottom: 6, textTransform: 'uppercase' },
    input: { 
        backgroundColor: '#F8FAFC', 
        borderWidth: 1.5, 
        borderColor: '#E2E8F0', 
        borderRadius: 16, 
        padding: 14, 
        marginBottom: 20,
        fontSize: 15,
        color: colors.foreground,
        fontWeight: '600'
    },
    modalBtns: { flexDirection: 'row', gap: 12, marginTop: 10 },
    modalBtn: { 
        flex: 1, 
        padding: 18, 
        borderRadius: 20, 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'row', 
        gap: 8 
    },
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
