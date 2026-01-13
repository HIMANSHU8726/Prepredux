import { View, Text, Button, FlatList } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';

export default function ProductDetail(props: any) {

  return (
    <View>
      <Text>ProductDetail</Text>
      <Text>Data from Redux Store:</Text>
      <Button
        title="Go to Dashboard"
        onPress={() => props.navigation.navigate('Dashboard')}
      />
    </View>
  );
}
