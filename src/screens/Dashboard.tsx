import { View, Text, Button } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fetchRecentProducts } from '../redux/slices/productSlice';

export default function Dashboard(props) {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.product,
  );

  useEffect(() => {
    dispatch(fetchRecentProducts());
  }, [dispatch]);

  return (
    <View>
      <Text>Dashboard</Text>
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error}</Text>}
      {data && (
        <View>
          <Text>Data Loaded!</Text>
          {/* Display data here if needed */}
        </View>
      )}
      <Button
        title="Go to Product Detail"
        onPress={() => props.navigation.navigate('ProductDetail')}
      />
    </View>
  );
}
