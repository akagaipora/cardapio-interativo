import AsyncStorage from '@react-native-async-storage/async-storage';

export class CacheService {
  static async saveMenuData(data) {
    try {
      await AsyncStorage.setItem('menu_data', JSON.stringify(data));
      await AsyncStorage.setItem('menu_data_timestamp', Date.now().toString());
      console.log('Dados salvos no cache');
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
    }
  }

  static async getMenuData() {
    try {
      const cachedData = await AsyncStorage.getItem('menu_data');
      const cachedTime = await AsyncStorage.getItem('menu_data_timestamp');
      
      if (cachedData && cachedTime) {
        const now = Date.now();
        const cacheAge = now - parseInt(cachedTime);
        const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos
        
        if (cacheAge < CACHE_DURATION) {
          console.log('Dados carregados do cache');
          return JSON.parse(cachedData);
        }
      }
      return null;
    } catch (error) {
      console.error('Erro ao ler cache:', error);
      return null;
    }
  }

  static async clearCache() {
    try {
      await AsyncStorage.removeItem('menu_data');
      await AsyncStorage.removeItem('menu_data_timestamp');
      console.log('Cache limpo');
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }
}
