import { User, PlusCircle, HelpCircle } from "lucide-react";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";

import { DateTimeInput } from "../components/DateTimeInput";
import { Empleado, RegistroAsistencia, useApp } from "../context/AppContext";
import { useColors } from "../hooks/useColors";
import { TURNOS, getTurnoDatetimes, todayDate } from "../utils/dateFormat";
import logo from "../../assets/images/logo.png";

export default function RegistroScreen() {
  const colors = useColors();
  const { areas, empleados, addRegistro, updateEmpleado, addArea } = useApp();

  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState<Empleado[]>([]);
  const [empleadoSel, setEmpleadoSel] = useState<Empleado | null>(null);
  const [localArea, setLocalArea] = useState("");
  const [turnoIdx, setTurnoIdx] = useState(0);

  const getInitialTimes = () => getTurnoDatetimes(0, new Date());
  const initial = getInitialTimes();
  const [entrada, setEntrada] = useState(initial.entrada);
  const [salida, setSalida] = useState(initial.salida);

  const actualizarHorasTurno = (idx: number) => {
    const base = new Date();
    const { entrada: e, salida: s } = getTurnoDatetimes(idx, base);
    setEntrada(e);
    setSalida(s);
  };

  const handleTurnoChange = (idx: number) => {
    setTurnoIdx(idx);
    actualizarHorasTurno(idx);
  };

  const onBusquedaChange = (text: string) => {
    setBusqueda(text);
    setEmpleadoSel(null);
    if (text.length > 0) {
      const filtered = empleados.filter((e) =>
        e.nombre.toLowerCase().includes(text.toLowerCase())
      );
      setSugerencias(filtered.slice(0, 6));
    } else {
      setSugerencias([]);
    }
  };

  const seleccionarEmpleado = (emp: Empleado) => {
    setEmpleadoSel(emp);
    setBusqueda(emp.nombre);
    setSugerencias([]);
    const area = areas.find(a => a.id === emp.areaId);
    setLocalArea(area?.nombre || "");
  };

  const handleAreaChange = (newName: string) => {
    setLocalArea(newName);
    if (!empleadoSel) return;
    
    // Buscar si ya existe
    let area = areas.find(a => a.nombre.trim().toUpperCase() === newName.trim().toUpperCase());
    
    if (area) {
        updateEmpleado(empleadoSel.id, empleadoSel.nombre, area.id);
        // No necesitamos setEmpleadoSel aquí porque localArea ya tiene el texto
    } else if (newName.trim().length > 2) {
        addArea(newName);
    }
  };

  const getAreaNombre = () => {
    if (!empleadoSel) return "";
    const area = areas.find((a) => a.id === empleadoSel.areaId);
    return area?.nombre ?? "";
  };

  const handleAgregarLista = useCallback(() => {
    if (!empleadoSel) {
      Alert.alert("Error", "Selecciona un empleado");
      return;
    }
    if (!entrada || !salida) {
      Alert.alert("Error", "Completa las horas de entrada y salida");
      return;
    }
    const registro: RegistroAsistencia = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      empleadoId: empleadoSel.id,
      empleadoNombre: empleadoSel.nombre,
      areaNombre: localArea,
      turno: TURNOS[turnoIdx].nombre,
      fecha: todayDate(),
      entrada,
      salida,
    };
    addRegistro(registro);
    Alert.alert("Agregado", `${empleadoSel.nombre} en lista`);
    setBusqueda("");
    setEmpleadoSel(null);
    actualizarHorasTurno(turnoIdx);
  }, [empleadoSel, entrada, salida, turnoIdx, areas, addRegistro]);

  const [showHelp, setShowHelp] = useState(false);

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
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      position: 'sticky' as any,
      top: 0,
      zIndex: 100,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },

    logo: { width: 44, height: 44, borderRadius: 12 },
    headerTextWrap: { flex: 1 },
    headerTitle: { fontSize: 20, fontWeight: "900", color: colors.headerFg, letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 11, color: "rgba(241,230,210,0.6)", fontWeight: "600" },
    helpBtn: { 
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tooltipOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
        zIndex: 2000,
    },
    tooltipCard: {
        padding: 24,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.3,
        shadowRadius: 30,
    },
    tooltipText: { color: '#2D1D1D', fontSize: 13, lineHeight: 18, marginBottom: 12, fontWeight: '500' },

    scroll: { flex: 1 },
    sectionLabel: {
      fontSize: 11,
      fontWeight: "800",
      color: colors.mutedForeground,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      marginHorizontal: 24,
      marginTop: 24,
      marginBottom: 10,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 24,
      padding: 20,
      marginHorizontal: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.04,
      shadowRadius: 15,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.03)',
    },
    fieldLabel: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.secondary,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      marginBottom: 6,
    },
    input: {
      backgroundColor: '#F8FAFC',
      borderWidth: 1.5,
      borderColor: '#E2E8F0',
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.foreground,
      marginBottom: 14,
      fontWeight: '600'
    },
    areaDisplay: {
      backgroundColor: colors.accent,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    areaText: {
      fontSize: 15,
      color: colors.primary,
      fontWeight: '800',
    },
    areaInput: {
        backgroundColor: colors.accent,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1.5,
        borderColor: colors.border,
        fontSize: 15,
        color: colors.primary,
        fontWeight: '800',
    },
    sugerencias: {
      backgroundColor: '#fff',
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.border,
      marginBottom: 14,
      marginTop: -10,
      overflow: "hidden",
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      zIndex: 100,
    },
    sugerencia: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F1F5F9',
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    sugerenciaText: { fontSize: 14, color: colors.foreground, flex: 1, fontWeight: '700' },
    sugerenciaArea: { fontSize: 12, color: colors.secondary, fontWeight: '500' },
    turnoRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
    turnoBtn: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: '#E2E8F0',
      alignItems: "center",
      backgroundColor: '#F8FAFC',
    },
    turnoBtnActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    turnoBtnLabel: { fontSize: 13, fontWeight: "800", color: colors.mutedForeground },
    turnoBtnLabelActive: { color: "#fff" },
    turnoBtnHour: { fontSize: 10, color: colors.mutedForeground, marginTop: 2, fontWeight: '600' },
    turnoBtnHourActive: { color: "rgba(255,255,255,0.8)" },
    timeRow: { flexDirection: "row", gap: 10 },
    timeHalf: { flex: 1 },
    addBtn: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      paddingVertical: 18,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      marginHorizontal: 16,
      marginBottom: 24,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 15,
    },
    addBtnText: {
      fontSize: 16,
      fontWeight: "900",
      color: "#fff",
      letterSpacing: 0.5,
    },
    emptyBanner: {
      backgroundColor: "#FFF1F2",
      borderLeftWidth: 4,
      borderLeftColor: colors.destructive,
      borderRadius: 12,
      padding: 14,
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 4,
    },
    emptyBannerText: { fontSize: 13, color: colors.destructive, fontWeight: '700' },
    bottomPad: { height: 60 },
  });


  return (
    <View style={s.container}>
      <View style={s.header}>
        <Image source={logo as any} style={s.logo} resizeMode="contain" />
        <View style={s.headerTextWrap}>
          <Text style={s.headerTitle}>Registro</Text>
          <Text style={s.headerSubtitle}>Gestión de Personal</Text>
        </View>
        <Pressable style={s.helpBtn} onPress={() => setShowHelp(!showHelp)}>
            <HelpCircle size={22} color={colors.headerFg} />
        </Pressable>
      </View>

      {empleados.length === 0 && (
        <View style={s.emptyBanner}>
          <Text style={s.emptyBannerText}>
            Sin empleados. Ve a "Empleados" para agregar.
          </Text>
        </View>
      )}

      {showHelp && (
          <View style={s.tooltipOverlay}>
              <View style={[s.tooltipCard, { backgroundColor: '#FDFBF7', borderColor: '#8B2F2F', borderWidth: 1.5 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                      <HelpCircle size={28} color="#8B2F2F" />
                      <Text style={{ fontSize: 18, fontWeight: '900', color: '#8B2F2F', marginLeft: 10 }}>Procedimiento</Text>
                  </View>
                  <Text style={s.tooltipText}><Text style={{ fontWeight: '900', color: '#8B2F2F' }}>• IDENTIFICACIÓN:</Text> Busque al empleado por nombre.</Text>
                  <Text style={s.tooltipText}><Text style={{ fontWeight: '900', color: '#8B2F2F' }}>• ASIGNACIÓN:</Text> Seleccione el turno y verifique el área.</Text>
                  <Text style={s.tooltipText}><Text style={{ fontWeight: '900', color: '#8B2F2F' }}>• VALIDACIÓN:</Text> Revise las horas de entrada/salida.</Text>
                  
                  <Pressable style={{ alignSelf: 'center', marginTop: 20, padding: 12, backgroundColor: '#8B2F2F', borderRadius: 16, width: '100%', alignItems: 'center' }} onPress={() => setShowHelp(false)}>
                      <Text style={{ color: '#fff', fontWeight: '900', fontSize: 13 }}>Entendido</Text>
                  </Pressable>
              </View>
          </View>
      )}



      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={s.sectionLabel}>Datos del empleado</Text>
        <View style={s.card}>
          <Text style={s.fieldLabel}>Buscar empleado</Text>
          <TextInput
            style={[s.input, sugerencias.length > 0 && { marginBottom: 4 }]}
            placeholder="Escriba el nombre..."
            placeholderTextColor={colors.mutedForeground}
            value={busqueda}
            onChangeText={onBusquedaChange}
          />
          {sugerencias.length > 0 && (
            <View style={s.sugerencias}>
              {sugerencias.map((emp) => {
                const area = areas.find((a) => a.id === emp.areaId);
                return (
                  <Pressable
                    key={emp.id}
                    style={s.sugerencia}
                    onPress={() => seleccionarEmpleado(emp)}
                  >
                    <User size={13} color={colors.secondary} />
                    <Text style={s.sugerenciaText}>{emp.nombre}</Text>
                    <Text style={s.sugerenciaArea}>{area?.nombre}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
          <Text style={s.fieldLabel}>Area asignada</Text>
          <TextInput
            style={s.areaInput}
            value={localArea}
            onChangeText={handleAreaChange}
            placeholder="Escriba el área..."
            placeholderTextColor={colors.mutedForeground}
            editable={!!empleadoSel}
          />
        </View>

        <Text style={s.sectionLabel}>Turno y horario</Text>
        <View style={s.card}>
          <View style={s.turnoRow}>
            {TURNOS.map((_, idx) => (
              <Pressable
                key={idx}
                style={[s.turnoBtn, turnoIdx === idx && s.turnoBtnActive]}
                onPress={() => handleTurnoChange(idx)}
              >
                <Text style={[s.turnoBtnLabel, turnoIdx === idx && s.turnoBtnLabelActive]}>
                  {idx === 0 ? "1er Turno" : "2do Turno"}
                </Text>
                <Text style={[s.turnoBtnHour, turnoIdx === idx && s.turnoBtnHourActive]}>
                  {idx === 0 ? "08:00 – 20:00" : "20:00 – 08:00"}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={s.timeRow}>
            <View style={s.timeHalf}>
              <DateTimeInput label="Entrada" value={entrada} onChange={setEntrada} />
            </View>
            <View style={s.timeHalf}>
              <DateTimeInput label="Salida" value={salida} onChange={setSalida} />
            </View>
          </View>
        </View>
        <View style={s.bottomPad} />
      </ScrollView>

      <Pressable
        style={({ pressed }: { pressed: boolean }) => [
          s.addBtn,
          pressed && { opacity: 0.88 },
        ]}
        onPress={handleAgregarLista}
      >
        <PlusCircle size={18} color="#fff" />
        <Text style={s.addBtnText}>Agregar a la lista</Text>
      </Pressable>
    </View>
  );
}
