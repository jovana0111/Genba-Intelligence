import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Pressable, TextInput } from "react-native";
import { useApp } from "../context/AppContext";
import { useColors } from "../hooks/useColors";
import { ArrowLeft, ShieldCheck, CheckSquare, Square, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EPP_ITEMS = [
  "Casco de Seguridad (Aluminio/Impacto)",
  "Calzado Punta de Acero",
  "Guantes de Kevlar (Protección Corte)",
  "Lentes de Seguridad",
  "Tapones Auditivos (Zona Estampado)",
  "Protector Lumbar"
];

export default function Requirements() {
  const colors = useColors();
  const navigate = useNavigate();
  const { empleados } = useApp();
  const [search, setSearch] = useState("");
  const [checks, setChecks] = useState<Record<string, string[]>>({});
  const [validacion, setValidacion] = useState<Record<string, 'cumple' | 'no_cumple'>>({});
  const { addEPPCheck, addAnomalia } = useApp();
  const [isFinishing, setIsFinishing] = useState(false);

  const filtered = empleados.filter(e => 
    e.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCheck = (empId: string, item: string) => {
    setChecks(prev => {
      const current = prev[empId] || [];
      if (current.includes(item)) {
        return { ...prev, [empId]: current.filter(i => i !== item) };
      }
      return { ...prev, [empId]: [...current, item] };
    });
  };

  const setValidar = (empId: string, val: 'cumple' | 'no_cumple') => {
    setValidacion(prev => {
      if (prev[empId] === val) {
        const next = { ...prev };
        delete next[empId];
        return next;
      }
      return { ...prev, [empId]: val };
    });
  };

  const finalizeInspection = () => {
    const inspectedIds = Object.keys(validacion);
    if (inspectedIds.length === 0) return;

    inspectedIds.forEach(id => {
        const emp = empleados.find(e => e.id === id);
        if (!emp) return;

        const status = validacion[id];
        const missingItems = EPP_ITEMS.filter(item => !(checks[id] || []).includes(item));

        addEPPCheck({
            empleadoId: id,
            nombre: emp.nombre,
            status,
            items: checks[id] || []
        });

        if (status === 'no_cumple') {
            addAnomalia({
                empleadoNombre: emp.nombre,
                tipo: "FALLA EPP",
                detalle: `Faltante de: ${missingItems.join(", ")}`
            });
        }
    });

    setIsFinishing(true);
    setTimeout(() => {
        navigate('/kiosk');
    }, 1500);
  };

  const cumplen = filtered.filter(e => validacion[e.id] === 'cumple').length;
  const noCumplen = filtered.filter(e => validacion[e.id] === 'no_cumple').length;

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
    headerBadges: { flexDirection: 'row', gap: 6, marginTop: 4 },
    badgeOk: { backgroundColor: '#10B981', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
    badgeFail: { backgroundColor: '#EF4444', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    scroll: { flex: 1, padding: 16 },
    searchBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
        fontSize: 14,
    },
    empCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        elevation: 2,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    empCardCumple: { borderColor: '#10B981' },
    empCardNoCumple: { borderColor: '#EF4444' },
    empHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    empName: { fontSize: 15, fontWeight: '800', color: colors.foreground, flex: 1 },
    validBtns: { flexDirection: 'row', gap: 6 },
    validBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    validBtnOk: {
        borderColor: '#10B981',
        backgroundColor: '#fff',
    },
    validBtnOkActive: {
        borderColor: '#10B981',
        backgroundColor: '#10B981',
    },
    validBtnFail: {
        borderColor: '#EF4444',
        backgroundColor: '#fff',
    },
    validBtnFailActive: {
        borderColor: '#EF4444',
        backgroundColor: '#EF4444',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    statusBadgeCumple: { backgroundColor: '#D1FAE5' },
    statusBadgeNoCumple: { backgroundColor: '#FEE2E2' },
    statusBadgeText: { fontSize: 12, fontWeight: '700' },
    statusBadgeTextCumple: { color: '#065F46' },
    statusBadgeTextNoCumple: { color: '#991B1B' },
    eppGrid: { gap: 8 },
    eppRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
    eppText: { fontSize: 12, color: colors.secondary, fontWeight: '500' },
    checkedText: { color: '#10B981', fontWeight: '700' },
    footerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.accent,
        padding: 12,
        borderRadius: 12,
        marginTop: 10,
    },
    footerInfoText: { fontSize: 11, color: colors.primary, flex: 1, fontWeight: '600' },
    finalizeBtn: {
        backgroundColor: colors.primary,
        margin: 20,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        elevation: 6,
    },
    finalizeText: { color: '#fff', fontSize: 16, fontWeight: '800' },
    successOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    }
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => navigate(-1)}>
          <ArrowLeft size={22} color={colors.headerFg} />
        </Pressable>
        <View style={s.headerTitleWrap}>
          <Text style={s.headerTitle}>Check-in EPP / Seguridad</Text>
          {(cumplen > 0 || noCumplen > 0) && (
            <View style={s.headerBadges}>
              {cumplen > 0 && (
                <View style={s.badgeOk}>
                  <Text style={s.badgeText}>✓ {cumplen} cumplen</Text>
                </View>
              )}
              {noCumplen > 0 && (
                <View style={s.badgeFail}>
                  <Text style={s.badgeText}>✗ {noCumplen} no cumplen</Text>
                </View>
              )}
            </View>
          )}
        </View>
        <ShieldCheck size={24} color={colors.primary} />
      </View>

      <ScrollView style={s.scroll}>
        <TextInput 
            placeholder="Buscar operador para inspección..."
            value={search}
            onChangeText={setSearch}
            style={s.searchBox}
        />

        <View style={s.footerInfo}>
             <Info size={16} color={colors.primary} />
             <Text style={s.footerInfoText}>
                 UACJ Standard: El uso de EPP es obligatorio para áreas de Estampado de Aluminio y Soldadura.
             </Text>
        </View>

        <View style={{ height: 20 }} />

        {filtered.map(emp => {
          const status = validacion[emp.id];
          return (
            <View
              key={emp.id}
              style={[
                s.empCard,
                status === 'cumple' && s.empCardCumple,
                status === 'no_cumple' && s.empCardNoCumple,
              ]}
            >
              <View style={s.empHeader}>
                <Text style={s.empName}>{emp.nombre}</Text>
                <View style={s.validBtns}>
                  <Pressable
                    style={[
                      s.validBtn,
                      status === 'cumple' ? s.validBtnOkActive : s.validBtnOk,
                    ]}
                    onPress={() => setValidar(emp.id, 'cumple')}
                  >
                    <Text style={{ color: status === 'cumple' ? '#fff' : '#10B981', fontSize: 18, fontWeight: '900', lineHeight: 22 }}>✓</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      s.validBtn,
                      status === 'no_cumple' ? s.validBtnFailActive : s.validBtnFail,
                    ]}
                    onPress={() => setValidar(emp.id, 'no_cumple')}
                  >
                    <Text style={{ color: status === 'no_cumple' ? '#fff' : '#EF4444', fontSize: 18, fontWeight: '900', lineHeight: 22 }}>✗</Text>
                  </Pressable>
                </View>
              </View>

              {status && (
                <View style={[s.statusBadge, status === 'cumple' ? s.statusBadgeCumple : s.statusBadgeNoCumple]}>
                  <Text style={[s.statusBadgeText, status === 'cumple' ? s.statusBadgeTextCumple : s.statusBadgeTextNoCumple]}>
                    {status === 'cumple' ? '✓ Cumple con EPP' : '✗ No cumple con EPP'}
                  </Text>
                </View>
              )}

              <View style={s.eppGrid}>
                  {EPP_ITEMS.map(item => {
                      const isChecked = (checks[emp.id] || []).includes(item);
                      return (
                          <Pressable 
                              key={item} 
                              style={s.eppRow} 
                              onPress={() => toggleCheck(emp.id, item)}
                          >
                              {isChecked ? <CheckSquare size={18} color="#10B981" /> : <Square size={18} color={colors.border} />}
                              <Text style={[s.eppText, isChecked && s.checkedText]}>{item}</Text>
                          </Pressable>
                      );
                  })}
              </View>
            </View>
          );
        })}

        {filtered.length > 0 && Object.keys(validacion).length > 0 && (
            <Pressable style={s.finalizeBtn} onPress={finalizeInspection}>
                <Text style={s.finalizeText}>Finalizar y Guardar Reporte</Text>
            </Pressable>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>

      {isFinishing && (
          <View style={s.successOverlay}>
              <ShieldCheck size={80} color="#10B981" />
              <Text style={{ fontSize: 22, fontWeight: '900', color: colors.foreground, marginTop: 20 }}>Reporte Guardado</Text>
              <Text style={{ color: colors.secondary, marginTop: 8 }}>Sincronizando con Anomalías...</Text>
          </View>
      )}
    </View>
  );
}
