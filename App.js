import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { CartProvider } from './src/context/CartContext';
import { MenuProvider } from './src/context/MenuContext';
import { HomeScreen, CartScreen } from './src/screens';
import ProductDetailScreen from './src/screens/ProductDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{ title: 'Detalhes do Produto' }}
      />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <MenuProvider>
      <CartProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Cardápio') {
                  iconName = focused ? 'restaurant' : 'restaurant-outline';
                } else if (route.name === 'Carrinho') {
                  iconName = focused ? 'cart' : 'cart-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#FF6B35',
              tabBarInactiveTintColor: 'gray',
            })}
          >
            <Tab.Screen 
              name="Cardápio" 
              component={HomeStack}
              options={{ headerShown: false }}
            />
            <Tab.Screen 
              name="Carrinho" 
              component={CartScreen}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </CartProvider>
    </MenuProvider>
  );
}

export default App;
