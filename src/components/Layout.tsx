import { View, StyleSheet, Pressable, Text } from "react-native";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Clock, Users, List as ListIcon, LayoutDashboard } from "lucide-react";
import { useColors } from "../hooks/useColors";

export default function Layout() {
  const colors = useColors();
  const navigate = useNavigate();
  const location = useLocation();
  const s = styles(colors);

  const tabs = [
    { name: "Kiosco", path: "/kiosk", icon: LayoutDashboard },
    { name: "Registro", path: "/registro", icon: Clock },
    { name: "Empleados", path: "/empleados", icon: Users },
    { name: "Lista", path: "/lista", icon: ListIcon },
  ];

  return (
    <View style={s.container}>
      <View style={s.mainWrapper}>
        <View style={s.content}>
          <Outlet />
        </View>
        <View style={s.tabBar}>
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Pressable
                key={tab.path}
                style={s.tabItem}
                onPress={() => navigate(tab.path)}
              >
              <tab.icon
                  size={20}
                  color={isActive ? colors.primary : colors.mutedForeground}
                />
                <Text
                  style={[
                    s.tabText,
                    { color: isActive ? colors.primary : colors.mutedForeground },
                  ]}
                >
                  {tab.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#160504", // Deeper dark for outer container
  },
  mainWrapper: {
    flex: 1,
    width: "100%",
    maxWidth: 480, // Slightly narrower for better focus on content
    alignSelf: "center",
    backgroundColor: colors.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    height: 72,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingBottom: 12,
    backdropFilter: 'blur(10px)' as any, // Web only
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
  },
  tabText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});


