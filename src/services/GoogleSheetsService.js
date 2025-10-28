import AsyncStorage from '@react-native-async-storage/async-storage';

export class GoogleSheetsService {
  // ⚠️ CONFIGURAÇÃO: Substitua com seus dados depois!
  static SHEET_ID = 'SUA_PLANILHA_ID_AQUI';
  static API_KEY = 'SUA_API_KEY_AQUI';
  static SHEET_NAME = 'Cardapio';

  static async fetchMenuData() {
    try {
      console.log('Buscando dados do Google Sheets...');
      
      // Para teste - dados mockados enquanto não configura a planilha
      const mockData = this.getMockData();
      return mockData;

      // ⚠️ DESCOMENTE quando configurar a planilha real:
      /*
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${this.SHEET_NAME}?key=${this.API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.values || data.values.length === 0) {
        throw new Error('Nenhum dado encontrado na planilha');
      }

      return this.processSheetData(data.values);
      */
      
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      // Retorna dados mockados em caso de erro
      return this.getMockData();
    }
  }

  static getMockData() {
    // Dados de exemplo para testar o app
    return {
      products: [
        {
          id: '1',
          nomeproduto: 'Pizza Margherita',
          descricao: 'Molho de tomate, mussarela, manjericão fresco',
          categoria: 'Pizzas',
          availableSizes: [
            { key: 'P', name: 'Pequena', price: 35.00 },
            { key: 'M', name: 'Média', price: 45.00 },
            { key: 'G', name: 'Grande', price: 55.00 }
          ],
          linkfoto: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400'
        },
        {
          id: '2',
          nomeproduto: 'Hambúrguer Artesanal',
          descricao: 'Pão brioche, carne 180g, queijo, alface, tomate',
          categoria: 'Lanches',
          availableSizes: [
            { key: 'P', name: 'Simples', price: 18.00 },
            { key: 'G', name: 'Duplo', price: 25.00 }
          ],
          linkfoto: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
        },
        {
          id: '3', 
          nomeproduto: 'Coca-Cola',
          descricao: 'Lata 350ml gelada',
          categoria: 'Bebidas',
          availableSizes: [
            { key: 'M', name: 'Lata', price: 6.00 }
          ],
          linkfoto: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400'
        }
      ],
      whatsappNumber: '5511999999999', // Número de exemplo
      lastUpdate: new Date().toISOString()
    };
  }

  static processSheetData(values) {
    const headers = values[0].map(header => 
      header.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, '_')
    );

    const rows = values.slice(1);
    const whatsappNumber = rows[0]?.[headers.indexOf('numerowhatsapp')] || '';

    const products = rows.map((row, index) => {
      const product = {};
      headers.forEach((header, colIndex) => {
        product[header] = row[colIndex] || '';
      });

      // Processar tamanhos
      const availableSizes = [];
      const sizeTypes = ['p', 'm', 'g', 'brotinho'];

      sizeTypes.forEach(size => {
        const priceKey = `preco_${size}`;
        const sizeKey = `tamanho_${size}`;
        
        if (product[priceKey] && parseFloat(product[priceKey]) > 0) {
          availableSizes.push({
            key: size.toUpperCase(),
            name: product[sizeKey] || this.formatSizeName(size),
            price: parseFloat(product[priceKey])
          });
        }
      });

      return {
        ...product,
        availableSizes,
        id: product.id || `product-${index}`,
        nomeproduto: product.nomeproduto || 'Produto sem nome',
        categoria: product.categoria || 'Geral',
        descricao: product.descricao || '',
        linkfoto: product.linkfoto || 'https://via.placeholder.com/300x200?text=Sem+Imagem'
      };
    }).filter(product => product.nomeproduto && product.nomeproduto !== 'Produto sem nome');

    return {
      products,
      whatsappNumber: this.cleanWhatsAppNumber(whatsappNumber),
      lastUpdate: new Date().toISOString()
    };
  }

  static formatSizeName(size) {
    const sizeMap = {
      'p': 'Pequeno',
      'm': 'Médio', 
      'g': 'Grande',
      'brotinho': 'Brotinho'
    };
    return sizeMap[size] || size.toUpperCase();
  }

  static cleanWhatsAppNumber(number) {
    return number.replace(/\D/g, '');
  }
}
