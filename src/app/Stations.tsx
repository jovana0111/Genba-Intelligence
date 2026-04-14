import React, { useEffect, useState, useMemo, useRef } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useApp } from "../context/AppContext";
import { useColors } from "../hooks/useColors";
import { ArrowLeft, AlertCircle, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Circle, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const UACJ_CENTER: [number, number] = [20.785904, -101.338168];

const GEOFENCES = [
  { id: 'top_left', nombre: 'Área Ensamble A', color: '#EF4444', lat: 20.7865, lng: -101.3386, radius: 25 },
  { id: 'top_right', nombre: 'Área Ensamble B', color: '#10B981', lat: 20.7865, lng: -101.3377, radius: 25 },
  { id: 'center', nombre: 'Control Central', color: '#F59E0B', lat: 20.7859, lng: -101.3381, radius: 18 },
  { id: 'mid_left', nombre: 'Troquelado A', color: '#3B82F6', lat: 20.7857, lng: -101.3387, radius: 30 },
  { id: 'mid_right', nombre: 'Troquelado B', color: '#8B5CF6', lat: 20.7857, lng: -101.3375, radius: 30 },
  { id: 'bottom', nombre: 'Almacén General', color: '#EC4899', lat: 20.7850, lng: -101.3381, radius: 45 },
];

export default function Stations() {
  const colors = useColors();
  const navigate = useNavigate();
  const { registros, empleados, areas, addAnomalia } = useApp();
  
  const empleadosActivos = useMemo(() => {
    const activeEmpIds = new Set(registros.map(r => r.empleadoId));
    return empleados.filter(e => activeEmpIds.has(e.id));
  }, [registros, empleados]);


  const [posiciones, setPosiciones] = useState<any[]>([]);
  const lastAlerts = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const inicial = empleadosActivos.map((emp) => {
      const empArea = areas.find(a => a.id === emp.areaId);
      const areaName = empArea?.nombre.toLowerCase() || "";
      
      // Intentar encontrar la geocerca que coincida con el nombre del área
      let fence = GEOFENCES.find(f => areaName.includes(f.nombre.toLowerCase()) || f.nombre.toLowerCase().includes(areaName));
      
      // Si no hay coincidencia exacta, usar una por defecto o aleatoria
      if (!fence) {
          fence = GEOFENCES[Math.floor(Math.random() * GEOFENCES.length)];
      }

      return {
        id: emp.id,
        nombre: emp.nombre,
        color: fence.color,
        fenceId: fence.id,
        lat: fence.lat + (Math.random() - 0.5) * 0.0002,
        lng: fence.lng + (Math.random() - 0.5) * 0.0002,
        alerta: false
      };
    });
    setPosiciones(inicial);

    const interval = setInterval(() => {
      setPosiciones(prev => prev.map(p => {
        const fence = GEOFENCES.find(f => f.id === p.fenceId)!;
        let nLat = p.lat + (Math.random() - 0.5) * 0.00008;
        let nLng = p.lng + (Math.random() - 0.5) * 0.00008;
        const dLat = nLat - fence.lat;
        const dLng = (nLng - fence.lng) * Math.cos(fence.lat * Math.PI / 180);
        const distanciaMeters = Math.sqrt(dLat * dLat + dLng * dLng) * 111320;
        const fuera = distanciaMeters > fence.radius;

        if (fuera && !lastAlerts.current[p.id]) {
          addAnomalia({
            empleadoNombre: p.nombre,
            tipo: "ABANDONO DE ESTACIÓN",
            detalle: `El operario se ha desplazado fuera de su zona asignada (${fence.nombre}).`
          });
        }
        lastAlerts.current[p.id] = fuera;
        return { ...p, lat: nLat, lng: nLng, alerta: fuera };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [empleadosActivos, addAnomalia, areas]);


  const numAlertas = posiciones.filter(p => p.alerta).length;

  const s = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#0f172a",
    },
    header: {
      backgroundColor: "#1e293b",
      paddingTop: 16,
      paddingBottom: 20,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      zIndex: 100,
    },
    backBtn: { padding: 8, marginLeft: -8, borderRadius: 20 },
    headerTitleWrap: { flex: 1 },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#f1f5f9" },
    mapContainer: {
        flex: 1,
        width: '100%',
        position: 'relative',
        zIndex: 1,
    },
    overlayUI: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#1e293b',
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#334155',
        zIndex: 100,
    },
    alertBanner: {
        backgroundColor: '#ef4444',
        paddingVertical: 6,
        paddingHorizontal: 16,
        zIndex: 50,
    },
    alertText: { color: '#fff', fontSize: 10, fontWeight: '800', textAlign: 'center' }
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => navigate(-1)}>
          <ArrowLeft size={22} color="#f1f5f9" />
        </Pressable>
        <View style={s.headerTitleWrap}>
          <Text style={s.headerTitle}>UACJ - Sistema Centinela</Text>
        </View>
        <ShieldAlert size={22} color={numAlertas > 0 ? "#ef4444" : "#10B981"} />
      </View>

      {numAlertas > 0 && (
          <View style={s.alertBanner}>
              <Text style={s.alertText}>ALERTA: PERSONAL FUERA DE SECTOR</Text>
          </View>
      )}

      <View style={s.mapContainer}>
        {/* Usamos un div directo con height 100% que ahora funcionará por el cambio en index.css */}
        <div style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}>
            <MapContainer 
                center={UACJ_CENTER} 
                zoom={19} 
                zoomControl={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                
                {GEOFENCES.map(fence => (
                    <Circle
                        key={fence.id}
                        center={[fence.lat, fence.lng]}
                        radius={fence.radius}
                        pathOptions={{ color: fence.color, fillColor: fence.color, fillOpacity: 0.15, weight: 2 }}
                    />
                ))}

                {posiciones.map((p) => (
                    <CircleMarker 
                        key={p.id}
                        center={[p.lat, p.lng]}
                        radius={7}
                        pathOptions={{ color: p.alerta ? '#ef4444' : '#fff', fillColor: p.alerta ? '#ef4444' : p.color, fillOpacity: 1, weight: 2 }}
                    >
                        <Tooltip direction="top" permanent={p.alerta}>{p.nombre}</Tooltip>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>

        <View style={s.overlayUI} pointerEvents="none">
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text style={{ color: '#f1f5f9', fontSize: 16, fontWeight: '900' }}>
                        {empleadosActivos.length > 0 ? (((empleadosActivos.length - numAlertas) / empleadosActivos.length) * 100).toFixed(0) : 100}%
                    </Text>
                    <Text style={{ color: '#64748b', fontSize: 8 }}>CUMPLIMIENTO</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: '#f1f5f9', fontSize: 16, fontWeight: '900' }}>{empleadosActivos.length}</Text>
                    <Text style={{ color: '#64748b', fontSize: 8 }}>EQUIPO</Text>
                </View>
            </View>
        </View>
      </View>
    </View>
  );
}
