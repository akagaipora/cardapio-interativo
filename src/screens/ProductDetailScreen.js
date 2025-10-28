import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';
import { useCart } from '../context/CartContext';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.availableSizes[0]?.key || '');
  const [quantity, setQuantity] = useState(1);

  const selectedSizeData = product.availableSizes.find(size => size.key === selectedSize);

  const handleAddToCart = () => {
    if (!selectedSize) {
      Alert.alert('Selecione um tamanho');
      return;
    }

    addToCart(product, selectedSize, quantity);
    Alert.alert(
      'Sucesso!',
      'Produto adicionado ao carrinho',
      [
        {
          text: 'Continuar Comprando',
          style: 'cancel'
        },
        {
          text: 'Ver Carrinho',
          onPress: () => navigation.navigate('Carrinho')
        }
      ]
    );
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: product.linkfoto }}
          style={styles.productImage}
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          <Text style={styles.productName}>{product.nomeproduto}</Text>
          <Text style={styles.productDescription}>{product.descricao}</Text>

          {/* Tamanhos Disponíveis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tamanhos Disponíveis</Text>
            <View style={styles.sizesContainer}>
              {product.availableSizes.map(size => (
                <TouchableOpacity
                  key={size.key}
                  style={[
                    styles.sizeButton,
                    selectedSize === size.key && styles.sizeButtonSelected
                  ]}
                  onPress={() => setSelectedSize(size.key)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === size.key && styles.sizeTextSelected
                    ]}
                  >
                    {size.name}
                  </Text>
                  <Text
                    style={[
                      styles.sizePrice,
                      selectedSize === size.key && styles.sizePriceSelected
                    ]}
                  >
                    R$ {size.price.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quantidade */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantidade</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={increaseQuantity}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Preço Total */}
          {selectedSizeData && (
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalPrice}>
                R$ {(selectedSizeData.price * quantity).toFixed(2)}
              </Text>
            </View>
          )}

          {/* Botão Adicionar ao Carrinho */}
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              !selectedSize && styles.addToCartButtonDisabled
            ]}
            onPress={handleAddToCart}
            disabled={!selectedSize}
          >
            <Text style={styles.addToCartButtonText}>
              Adicionar ao Carrinho
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  productImage: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    color: '#6c757d',
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeButton: {
    flex: 1,
    minWidth: 100,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  sizeButtonSelected: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6c757d',
    marginBottom: 4,
  },
  sizeTextSelected: {
    color: 'white',
  },
  sizePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  sizePriceSelected: {
    color: 'white',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 40,
    textAlign: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
  },
  addToCartButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;
