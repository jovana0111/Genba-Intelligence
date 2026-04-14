import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, Pressable, TextInput } from "react-native";
import { useApp } from "../context/AppContext";
import { useColors } from "../hooks/useColors";
import { ArrowLeft, ShieldCheck, CheckSquare, Square, Info, HelpCircle } from "lucide-react";
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
  const { empleados, addEPPCheck, addAnomalia } = useApp();
  
  const [search, setSearch] = useState("");
  const [checks, setChecks] = useState<Record<string, string[]>>({});
  const [validacion, setValidacion] = useState<Record<string, 'cumple' | 'no_cumple'>>({});
  const [isFinishing, setIsFinishing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const filtered = empleados.filter(e => 
    e.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCheck = (empId: string, item: string) => {
    setChecks(prev => {
      const current = prev[empId] || [];
      const updatedList = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      
      const newChecks = { ...prev, [empId]: updatedList };
      
      // Auto-validation logic: If majority (>=4 of 6) are checked, suggest 'cumple'
      if (updatedList.length >= 4) {
          setValidacion(v => ({ ...v, [empId]: 'cumple' }));
      } else if (updatedList.length > 0) {
          setValidacion(v => ({ ...v, [empId]: 'no_cumple' }));
      } else {
          setValidacion(v => {
              const next = { ...v };
              delete next[empId];
              return next;
          });
      }
      return newChecks;
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
      paddingBottom: 22,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
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
    headerTitle: { fontSize: 20, fontWeight: "900", color: colors.headerFg },
    headerBadges: { flexDirection: 'row', gap: 6, marginTop: 4 },
    badgeOk: { backgroundColor: '#10B981', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
    badgeFail: { backgroundColor: '#EF4444', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    helpBtn: { 
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    scroll: { flex: 1, padding: 16 },
    searchBox: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: colors.border,
        fontSize: 16,
    },
    empCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: 'transparent',
        elevation: 2,
    },
    empCardCumple: { borderColor: '#10B981', backgroundColor: '#F0FDF4' },
    empCardNoCumple: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
    empHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    empName: { fontSize: 16, fontWeight: '800', color: colors.foreground, flex: 1 },
    validBtns: { flexDirection: 'row', gap: 8 },
    validBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    validBtnOk: { borderColor: '#10B981', backgroundColor: '#fff' },
    validBtnOkActive: { borderColor: '#10B981', backgroundColor: '#10B981' },
    validBtnFail: { borderColor: '#EF4444', backgroundColor: '#fff' },
    validBtnFailActive: { borderColor: '#EF4444', backgroundColor: '#EF4444' },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    statusBadgeCumple: { backgroundColor: '#BBF7D0' },
    statusBadgeNoCumple: { backgroundColor: '#FECACA' },
    statusBadgeText: { fontSize: 12, fontWeight: '800' },
    statusBadgeTextCumple: { color: '#065F46' },
    statusBadgeTextNoCumple: { color: '#991B1B' },
    eppGrid: { gap: 10, marginTop: 4 },
    eppRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
    eppText: { fontSize: 13, color: colors.secondary, fontWeight: '600' },
    checkedText: { color: '#059669', fontWeight: '800' },
    footerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: colors.accent,
        padding: 16,
        borderRadius: 18,
        marginTop: 10,
        borderWidth: 1,
        borderColor: colors.border,
    },
    footerInfoText: { fontSize: 12, color: colors.primary, flex: 1, fontWeight: '700' },
    floatingFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 20,
        paddingBottom: 34,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        backdropFilter: 'blur(10px)' as any,
    },
    finalizeBtn: {
        backgroundColor: colors.primary,
        padding: 18,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 12,
    },
    finalizeText: { color: '#fff', fontSize: 17, fontWeight: '900' },
    tooltipOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
        zIndex: 5000,
    },
    tooltipCard: {
        padding: 24,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    successOverlay: {

        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3000
    }
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => navigate(-1)}>
          <ArrowLeft size={22} color={colors.headerFg} />
        </Pressable>
        <View style={s.headerTitleWrap}>
          <Text style={s.headerTitle}>Seguridad EPP</Text>
          {(cumplen > 0 || noCumplen > 0) && (
            <View style={s.headerBadges}>
              {cumplen > 0 && <View style={s.badgeOk}><Text style={s.badgeText}>✓ {cumplen} OK</Text></View>}
              {noCumplen > 0 && <View style={s.badgeFail}><Text style={s.badgeText}>✗ {noCumplen} Fallas</Text></View>}
            </View>
          )}
        </View>
        <Pressable style={s.helpBtn} onPress={() => setShowHelp(!showHelp)}>
            <HelpCircle size={22} color={colors.headerFg} />
        </Pressable>
      </View>

      {showHelp && (
          <View style={s.tooltipOverlay}>
              <View style={[s.tooltipCard, { backgroundColor: '#FDFBF7', borderColor: '#8B2F2F', borderWidth: 1.5 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Info size={22} color="#8B2F2F" />
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#8B2F2F', fontWeight: '900', fontSize: 13, marginBottom: 2 }}>Norma Centinela</Text>
                        <Text style={{ color: '#2D1D1D', fontSize: 12, fontWeight: '600', lineHeight: 16 }}>
                            Se requiere el uso obligatorio de casco, calzado de seguridad y lentes para acceder a la planta.
                        </Text>
                    </View>
                  </View>
                  <Pressable style={{ alignSelf: 'center', marginTop: 15, padding: 8, backgroundColor: '#8B2F2F', borderRadius: 12, width: '100%', alignItems: 'center' }} onPress={() => setShowHelp(false)}>
                      <Text style={{ color: '#fff', fontWeight: '900', fontSize: 12 }}>Entendido</Text>
                  </Pressable>
              </View>
          </View>
      )}



      <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
        <TextInput 
            placeholder="Buscar operador..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={colors.mutedForeground}
            style={s.searchBox}
        />

        <View style={{ height: 20 }} />

        {filtered.map(emp => {

          const status = validacion[emp.id];
          return (
            <View key={emp.id} style={[s.empCard, status === 'cumple' && s.empCardCumple, status === 'no_cumple' && s.empCardNoCumple]}>
              <View style={s.empHeader}>
                <Text style={s.empName}>{emp.nombre}</Text>
                <View style={s.validBtns}>
                  <Pressable style={[s.validBtn, status === 'cumple' ? s.validBtnOkActive : s.validBtnOk]} onPress={() => setValidar(emp.id, 'cumple')}>
                    <Text style={{ color: status === 'cumple' ? '#fff' : '#10B981', fontSize: 18, fontWeight: '900' }}>✓</Text>
                  </Pressable>
                  <Pressable style={[s.validBtn, status === 'no_cumple' ? s.validBtnFailActive : s.validBtnFail]} onPress={() => setValidar(emp.id, 'no_cumple')}>
                    <Text style={{ color: status === 'no_cumple' ? '#fff' : '#EF4444', fontSize: 18, fontWeight: '900' }}>✗</Text>
                  </Pressable>
                </View>
              </View>

              {status && (
                <View style={[s.statusBadge, status === 'cumple' ? s.statusBadgeCumple : s.statusBadgeNoCumple]}>
                  <Text style={[s.statusBadgeText, status === 'cumple' ? s.statusBadgeTextCumple : s.statusBadgeTextNoCumple]}>
                    {status === 'cumple' ? '✓ EQUIPO COMPLETO' : '⚠ EPP INSUFICIENTE'}
                  </Text>
                </View>
              )}

              <View style={s.eppGrid}>
                  {EPP_ITEMS.map(item => {
                      const isChecked = (checks[emp.id] || []).includes(item);
                      return (
                          <Pressable key={item} style={s.eppRow} onPress={() => toggleCheck(emp.id, item)}>
                              {isChecked ? <CheckSquare size={20} color="#10B981" /> : <Square size={20} color={colors.border} />}
                              <Text style={[s.eppText, isChecked && s.checkedText]}>{item}</Text>
                          </Pressable>
                      );
                  })}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {Object.keys(validacion).length > 0 && (
          <View style={s.floatingFooter}>
              <Pressable style={s.finalizeBtn} onPress={finalizeInspection}>
                  <ShieldCheck size={20} color="#fff" />
                  <Text style={s.finalizeText}>Finalizar y Guardar Reporte</Text>
              </Pressable>
          </View>
      )}

      {isFinishing && (
          <View style={s.successOverlay}>
              <ShieldCheck size={80} color="#10B981" />
              <Text style={{ fontSize: 22, fontWeight: '900', color: colors.foreground, marginTop: 20 }}>Reporte Guardado</Text>
          </View>
      )}
    </View>
  );
}
