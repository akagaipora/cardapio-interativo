import React, { createContext, useState, useContext, useEffect } from 'react';
import { GoogleSheetsService } from '../services/GoogleSheetsService';
import { CacheService } from '../services/CacheService';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);

  const loadMenuData = async () => {
    try {
      setLoading(true);
      
      // Primeiro tenta carregar do cache
      const cachedData = await CacheService.getMenuData();
      if (cachedData) {
        setProducts(cachedData.products);
        setCategories(cachedData.categories);
        setWhatsappNumber(cachedData.whatsappNumber);
        setLastUpdate(cachedData.lastUpdate);
      }

      // Sempre tenta buscar dados atualizados
      const freshData = await GoogleSheetsService.fetchMenuData();
      if (freshData && freshData.products) {
        const uniqueCategories = [...new Set(freshData.products.map(product => product.categoria))];
        
        setProducts(freshData.products);
        setCategories(uniqueCategories);
        setWhatsappNumber(freshData.whatsappNumber);
        setLastUpdate(freshData.lastUpdate);
        
        // Salva no cache
        await CacheService.saveMenuData({
          products: freshData.products,
          categories: uniqueCategories,
          whatsappNumber: freshData.whatsappNumber,
          lastUpdate: freshData.lastUpdate
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshMenu = async () => {
    await CacheService.clearCache();
    await loadMenuData();
  };

  const getProductsByCategory = (category) => {
    if (category === 'Todos') return products;
    return products.filter(product => product.categoria === category);
  };

  useEffect(() => {
    loadMenuData();
  }, []);

  return (
    <MenuContext.Provider value={{
      products,
      categories,
      loading,
      whatsappNumber,
      lastUpdate,
      refreshMenu,
      getProductsByCategory
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu deve ser usado dentro de MenuProvider');
  }
  return context;
};
