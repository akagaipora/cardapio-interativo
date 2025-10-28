import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const ProductCard = ({ product, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image
        source={{ uri: product.linkfoto }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{product.nomeproduto}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.descricao}
        </Text>
        <Text style={styles.price}>
          A partir de R$ {Math.min(...product.availableSizes.map(s => s.price))}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  }
};

export default ProductCard;
