import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  CheckCircle, 
  Edit2, 
  LayoutGrid, 
  Trash2, 
  User, 
  UserPlus, 
  Users, 
  X, 
  Info, 
  AlertTriangle 
} from "lucide-react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Animated,
  Alert,
} from "react-native";
import logo from "../../assets/images/logo.png";
import { useApp, Empleado, Area } from "../context/AppContext";
import { useColors } from "../hooks/useColors";

function CustomAlert({ visible, message, onHide }: { visible: boolean, message: string, onHide: () => void }) {
    if (!visible) return null;
    return (
        <View style={s.alertContainer}>
          <Info size={18} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>{message}</Text>
        </View>
    );
}

export default function EmpleadosScreen() {
  const colors = useColors();
  const { areas, empleados, addArea, updateArea, deleteArea, addEmpleado, updateEmpleado, deleteEmpleado } = useApp();
  
  const [tab, setTab] = useState<"areas" | "empleados">("areas");
  const [areaModalVisible, setAreaModalVisible] = useState(false);
  const [empModalVisible, setEmpModalVisible] = useState(false);
  
  // Form states
  const [areaName, setAreaName] = useState("");
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  
  const [empName, setEmpName] = useState("");
  const [areaSelId, setAreaSelId] = useState<string>("");
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);

  // Confirmation Modal State
  const [confirm, setConfirm] = useState<{ visible: boolean, title: string, message: string, onConfirm: () => void } | null>(null);

  // Simple Notification State (without complex Animated logic for now)
  const [notif, setNotif] = useState<{ visible: boolean, message: string }>({ visible: false, message: '' });

  const showNotif = (msg: string) => {
      setNotif({ visible: true, message: msg });
      setTimeout(() => setNotif({ visible: false, message: '' }), 3000);
  };

  const handleAreaSubmit = () => {
    if (!areaName.trim()) return;
    
    const action = () => {
        if (editingAreaId) {
            updateArea(editingAreaId, areaName);
            showNotif("Área actualizada");
        } else {
            addArea(areaName);
            showNotif("Área registrada");
        }
        setAreaModalVisible(false);
        setEditingAreaId(null);
        setAreaName("");
        setConfirm(null);
    };

    if (editingAreaId) {
        setConfirm({
            visible: true,
            title: "¿Guardar Cambios?",
            message: `¿Estás seguro de actualizar el nombre a "${areaName}"?`,
            onConfirm: action
        });
    } else {
        action();
    }
  };

  const handleEmpSubmit = () => {
    if (!empName.trim() || !areaSelId) return;

    const action = () => {
        if (editingEmpId) {
            updateEmpleado(editingEmpId, empName, areaSelId);
            showNotif("Datos actualizados");
        } else {
            addEmpleado(empName, areaSelId);
            showNotif("Empleado registrado");
        }
        setEmpModalVisible(false);
        setEditingEmpId(null);
        setEmpName("");
        setAreaSelId("");
        setConfirm(null);
    };

    if (editingEmpId) {
        setConfirm({
            visible: true,
            title: "¿Actualizar Empleado?",
            message: `¿Confirmas los cambios para ${empName}?`,
            onConfirm: action
        });
    } else {
        action();
    }
  };

  const openAreaModal = (area?: Area) => {
      setEditingAreaId(area?.id || null);
      setAreaName(area?.nombre || "");
      setAreaModalVisible(true);
  };

  const openEmpModal = (emp?: Empleado) => {
      setEditingEmpId(emp?.id || null);
      setEmpName(emp?.nombre || "");
      setAreaSelId(emp?.areaId || "");
      setEmpModalVisible(true);
  };

  const areasConConteo = useMemo(() => {
    if (!areas) return [];
    return areas.map((area) => ({
        ...area,
        count: (empleados || []).filter((e) => e.areaId === area.id).length,
    }));
  }, [areas, empleados]);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Image source={logo as any} style={s.logo} resizeMode="contain" />
        <Text style={s.headerTitle}>Gestión de Personal</Text>
      </View>

      <View style={s.tabRow}>
        <Pressable style={[s.tabBtn, tab === "areas" && s.tabBtnActive]} onPress={() => setTab("areas")}>
          <Text style={[s.tabText, tab === "areas" && s.tabTextActive]}>Áreas ({areas?.length || 0})</Text>
        </Pressable>
        <Pressable style={[s.tabBtn, tab === "empleados" && s.tabBtnActive]} onPress={() => setTab("empleados")}>
          <Text style={[s.tabText, tab === "empleados" && s.tabTextActive]}>Empleados ({empleados?.length || 0})</Text>
        </Pressable>
      </View>

      <ScrollView style={s.scroll}>
        <View style={s.listSection}>
          <View style={s.listHeader}>
            <Text style={s.listHeaderText}>{tab === 'areas' ? 'Áreas Registradas' : 'Plantilla General'}</Text>
            <Pressable style={s.addFloatBtn} onPress={() => tab === 'areas' ? openAreaModal() : openEmpModal()}>
                <UserPlus size={16} color="#fff" />
                <Text style={s.addFloatBtnText}>Agregar</Text>
            </Pressable>
          </View>
          
          {tab === "areas" ? (
             areasConConteo.length === 0 ? (
                <View style={s.emptyBox}>
                  <LayoutGrid size={24} color="#CBD5E1" />
                  <Text style={s.emptyText}>No hay áreas registradas</Text>
                </View>
              ) : (
                areasConConteo.map((area) => (
                  <View key={area.id} style={[s.listItem, { flexDirection: 'column', alignItems: 'stretch' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={s.listItemAvatar}><LayoutGrid size={14} color="#8B2F2F" /></View>
                        <View style={{ flex: 1 }}>
                        <Text style={s.listItemName}>{area.nombre}</Text>
                        <Text style={s.listItemSub}>{area.count} empleados asociados</Text>
                        </View>
                        <View style={s.itemActions}>
                            <Pressable onPress={() => openAreaModal(area)}><Edit2 size={16} color="#64748B" /></Pressable>
                            <Pressable onPress={() => setConfirm({
                                visible: true,
                                title: "Eliminar Área",
                                message: `¿Estás seguro de eliminar "${area.nombre}"?`,
                                onConfirm: () => { deleteArea(area.id); showNotif("Área eliminada"); setConfirm(null); }
                            })}><Trash2 size={16} color="#EF4444" /></Pressable>
                        </View>
                    </View>
                    
                    {/* Lista de empleados en esta área */}
                    <View style={{ marginTop: 12, paddingLeft: 48, gap: 8 }}>
                        {empleados.filter(e => e.areaId === area.id).length === 0 ? (
                            <Text style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic' }}>Sin empleados asignados</Text>
                        ) : (
                            empleados.filter(e => e.areaId === area.id).map(emp => (
                                <View key={emp.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1' }} />
                                    <Text style={{ fontSize: 13, color: '#475569', fontWeight: '500' }}>{emp.nombre}</Text>
                                </View>
                            ))
                        )}
                    </View>
                  </View>
                ))
              )
          ) : (

             (empleados || []).length === 0 ? (
                <View style={s.emptyBox}>
                  <Users size={24} color="#CBD5E1" />
                  <Text style={s.emptyText}>No hay empleados</Text>
                </View>
              ) : (
                (empleados || []).map((emp) => {
                  const area = areas.find((a) => a.id === emp.areaId);
                  return (
                    <View key={emp.id} style={s.listItem}>
                      <View style={s.listItemAvatar}><User size={14} color="#8B2F2F" /></View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.listItemName}>{emp.nombre}</Text>
                        <Text style={s.listItemSub}>{area?.nombre ?? "Sin área"}</Text>
                      </View>
                      <View style={s.itemActions}>
                        <Pressable onPress={() => openEmpModal(emp)}><Edit2 size={16} color="#64748B" /></Pressable>
                        <Pressable onPress={() => setConfirm({
                            visible: true,
                            title: "Eliminar Empleado",
                            message: `¿Estás seguro de eliminar a ${emp.nombre}?`,
                            onConfirm: () => { deleteEmpleado(emp.id); showNotif("Empleado eliminado"); setConfirm(null); }
                        })}><Trash2 size={16} color="#EF4444" /></Pressable>
                      </View>
                    </View>
                  );
                })
              )
          )}
        </View>
        <View style={s.bottomPad} />
      </ScrollView>

      {/* Floating Modals */}
      {areaModalVisible && (
          <View style={s.modalOverlay}>
              <View style={s.modalCard}>
                  <Text style={s.modalTitle}>{editingAreaId ? 'Editar Área' : 'Nueva Área'}</Text>
                  <TextInput style={s.modalInput} placeholder="Nombre" value={areaName} onChangeText={setAreaName} />
                  <View style={s.modalFooter}>
                      <Pressable style={s.cancelBtn} onPress={() => setAreaModalVisible(false)}><Text style={s.cancelBtnText}>Cerrar</Text></Pressable>
                      <Pressable style={s.confirmBtn} onPress={handleAreaSubmit}><Text style={s.confirmBtnText}>Guardar</Text></Pressable>
                  </View>
              </View>
          </View>
      )}

      {empModalVisible && (
          <View style={s.modalOverlay}>
              <View style={s.modalCard}>
                  <Text style={s.modalTitle}>{editingEmpId ? 'Editar Empleado' : 'Nuevo Empleado'}</Text>
                  <TextInput style={s.modalInput} placeholder="Nombre" value={empName} onChangeText={setEmpName} />
                  <Text style={s.fieldLabel}>Área</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                          {areas.map(a => (
                              <Pressable key={a.id} onPress={() => setAreaSelId(a.id)} style={[s.chip, areaSelId === a.id && s.chipSel]}>
                                  <Text style={[s.chipText, areaSelId === a.id && s.chipTextSel]}>{a.nombre}</Text>
                              </Pressable>
                          ))}
                      </View>
                  </ScrollView>
                  <View style={s.modalFooter}>
                      <Pressable style={s.cancelBtn} onPress={() => setEmpModalVisible(false)}><Text style={s.cancelBtnText}>Cerrar</Text></Pressable>
                      <Pressable style={s.confirmBtn} onPress={handleEmpSubmit}><Text style={s.confirmBtnText}>Confirmar</Text></Pressable>
                  </View>
              </View>
          </View>
      )}

      {/* Basic Notif Overlay */}
      {notif.visible && (
          <View style={s.alertContainer}>
            <Info size={18} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>{notif.message}</Text>
          </View>
      )}

      {/* Confirmation Modal Overlay */}
      {confirm?.visible && (
          <View style={[s.modalOverlay, { zIndex: 2000 }]}>
              <View style={[s.modalCard, { maxWidth: 320 }]}>
                  <Text style={[s.modalTitle, { fontSize: 18, marginBottom: 10 }]}>{confirm.title}</Text>
                  <Text style={{ fontSize: 14, color: '#64748B', marginBottom: 25 }}>{confirm.message}</Text>
                  <View style={s.modalFooter}>
                      <Pressable style={s.cancelBtn} onPress={() => setConfirm(null)}><Text style={s.cancelBtnText}>No, cancelar</Text></Pressable>
                      <Pressable style={[s.confirmBtn, { backgroundColor: confirm.title.includes('Eliminar') ? '#EF4444' : '#8B2F2F' }]} onPress={confirm.onConfirm}>
                          <Text style={s.confirmBtnText}>Sí, confirmar</Text>
                      </Pressable>
                  </View>
              </View>
          </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FDFBF7" },
    header: { backgroundColor: "#2D1D1D", padding: 20, paddingTop: 14, flexDirection: "row", alignItems: "center", gap: 12 },
    logo: { width: 38, height: 38, borderRadius: 8 },
    headerTitle: { fontSize: 18, fontWeight: "800", color: "#F1E6D2" },
    tabRow: { flexDirection: "row", backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#E2E8F0" },
    tabBtn: { flex: 1, paddingVertical: 14, alignItems: "center", borderBottomWidth: 3, borderBottomColor: "transparent" },
    tabBtnActive: { borderBottomColor: "#8B2F2F" },
    tabText: { fontSize: 13, fontWeight: "700", color: "#64748B" },
    tabTextActive: { color: "#8B2F2F" },
    scroll: { flex: 1 },
    listSection: { backgroundColor: "#fff", marginHorizontal: 16, marginTop: 16, borderRadius: 20, overflow: "hidden", elevation: 3 },
    listHeader: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    listHeaderText: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
    addFloatBtn: { backgroundColor: '#8B2F2F', flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignItems: 'center', gap: 6 },
    addFloatBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    listItem: { flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: "#F1F5F9", gap: 12 },
    listItemAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#FEF2F2", alignItems: "center", justifyContent: "center" },
    listItemName: { fontSize: 14, color: "#1E293B", fontWeight: "700" },
    listItemSub: { fontSize: 11, color: "#64748B", marginTop: 2 },
    itemActions: { flexDirection: 'row', gap: 15 },
    emptyBox: { padding: 40, alignItems: "center", gap: 10 },
    emptyText: { fontSize: 13, color: "#94A3B8" },
    bottomPad: { height: 100 },
    modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20, zIndex: 1000 },
    modalCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24 },
    modalTitle: { fontSize: 20, fontWeight: '900', color: '#1E293B', marginBottom: 20 },
    modalInput: { backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 20 },
    modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    cancelBtn: { padding: 12 },
    cancelBtnText: { color: '#64748B', fontWeight: '700' },
    confirmBtn: { backgroundColor: '#8B2F2F', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
    confirmBtnText: { color: '#fff', fontWeight: '800' },
    fieldLabel: { fontSize: 10, fontWeight: "700", color: "#64748B", textTransform: "uppercase", marginBottom: 8 },
    chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
    chipSel: { backgroundColor: '#8B2F2F', borderColor: '#8B2F2F' },
    chipText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
    chipTextSel: { color: '#fff' },
    alertContainer: { position: 'absolute', bottom: 100, left: 20, right: 20, padding: 16, borderRadius: 16, backgroundColor: '#1E293B', flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 2000 },
});
