import React from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {
  BLEContextProvider,
  useBLEActions,
  useBLEState,
} from '../../logic/contexts/bleContext';
import {AppBar} from '../components/appbar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GLOBAL_STYLES} from '../../../globalStyles';
import {Button} from 'react-native-paper';
const styles = StyleSheet.create({
  home_main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  home_content: {
    flex: 1,
    justifyContent: 'center',
  },
});

const Home = () => {
  const {scanAndConnect} = useBLEActions();
  const {bleState, connectedDevice} = useBLEState();
  const vehicleInfo = {
    serviceUUID: '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
    characteristicUUID: 'beb5483e-36e1-4688-b7f5-ea07361b26a8',
  };
  return (
    <SafeAreaView style={styles.home_main}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#2e2e2e'} />
      <AppBar title={'Home'} />
      <View style={styles.home_content}>
        <Text style={{color: 'black', margin: 10}}>
          {JSON.stringify({bleState, connectedDevice: connectedDevice?.id})}
        </Text>
        <Button
          onPress={scanAndConnect}
          mode="contained"
          style={[
            GLOBAL_STYLES.primary_contained_button,
            {marginHorizontal: 10, marginBottom: 10},
          ]}>
          Connect to device
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default () => (
  <BLEContextProvider>
    <Home />
  </BLEContextProvider>
);
