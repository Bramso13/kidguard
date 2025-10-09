import { Tabs } from 'expo-router';
import { Icon } from 'react-native-paper';

export default function ParentLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tableau de bord',
          tabBarIcon: ({ color }) => <Icon source="home" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="analytics/index"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => <Icon source="chart-bar" color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
