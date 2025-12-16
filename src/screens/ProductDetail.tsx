import { View, Text, Button, FlatList } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function ProductDetail(props: any) {
  // Access data directly from the store!
  // No need to fetch again if Dashboard already fetched it.
  const { data } = useSelector((state: RootState) => state.product);

  console.log('ProductDetail Redux Data:', data);

  // Use Redux data if available, otherwise fallback to empty array
  // Adjust 'data.data' based on your actual API response structure
  const displayData = data && data.data ? data.data : [];

  return (
    <View>
      <Text>ProductDetail</Text>
      <Text>Data from Redux Store:</Text>

      <FlatList
        data={displayData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>ID: {item.id}</Text>
            <Text>Name: {item.name}</Text>
            <Text>Price: {item.price}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text>No data in Redux yet. Go to Dashboard to fetch.</Text>
        }
      />

      <Button
        title="Go to Dashboard"
        onPress={() => props.navigation.navigate('Dashboard')}
      />
    </View>
  );
}
