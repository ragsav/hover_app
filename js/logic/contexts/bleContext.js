import {useState, createContext, useContext, useEffect} from 'react';
import {Platform} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';
import {encode} from 'base-64';
import {PermissionsState} from '../states/permissionsState';
import {BleError, BleManager, Device} from 'react-native-ble-plx';
import {CONSTANTS} from '../../../constants';
const BLEStateContext = createContext(undefined);
const BLEActionsContext = createContext(undefined);
const BLEContextProvider = ({children}) => {
  const [bleManager, setBLEManager] = useState();
  const [bleState, setBLEState] = useState(CONSTANTS.BLE_STATE.OFF);
  const [connectedDevice, setConnectedDevice] = useState();
  useEffect(() => {
    const manager = new BleManager();
    setBLEManager(manager);

    return () => {
      bleManager?.destroy();
    };
  }, []);

  useEffect(() => {
    if (bleManager) {
      const subscription = bleManager.onStateChange(state => {
        setBLEState(state);
      }, true);
      return () => subscription.remove();
    }
  }, [bleManager]);

  const scanAndConnect = ({
    iotID = 'HOVER_MX0001',
    serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
    characteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8',
  }) => {
    if (bleManager && bleState === CONSTANTS.BLE_STATE.ON) {
      console.log('scanning starting...');
      bleManager.startDeviceScan(
        null,
        null,
        async (error, device) =>
          await _onScanningStart(
            error,
            device,
            iotID,
            serviceUUID,
            characteristicUUID,
          ),
      );
    }
  };

  /**
   *
   * @param {BleError} error
   * @param {Device} device
   * @param {String} iotID
   * @param {String} serviceUUID
   * @param {String} characteristicUUID
   * @returns
   */
  const _onScanningStart = async (
    error,
    device,
    iotID,
    serviceUUID,
    characteristicUUID,
  ) => {
    if (error) {
      console.log(error);
      bleManager.stopDeviceScan();
      return;
    }
    if (device.name === iotID) {
      try {
        // const bleManager = new BleManager();
        console.log('device found...');
        bleManager.stopDeviceScan();
        console.log('scanning stopped...');
        console.log('disconnecting old device...');
        const disconnectedDevice = await disconnectExistingConnection({
          deviceID: device.id,
        });
        console.log('disconnected old device...');
        console.log('connecting new device...');
        const connectedDevice = await device.connect({
          autoConnect: false,
          timeout: 20000,
        });
        setConnectedDevice(connectedDevice);
        await device.discoverAllServicesAndCharacteristics();
        console.log('device connected...');
        console.log({connectedDevice});
        const tempData = '{"cmd": "lock","code": "mx00011234567890"}';
        const b = encode(tempData);
        console.log({b});
        // const characteristic =
        //   await device.writeCharacteristicWithResponseForService(
        //     serviceUUID,
        //     characteristicUUID,
        //     encode(tempData),
        //   );
        // console.log(characteristic);
        const characteristics =
          await bleManager.writeCharacteristicWithResponseForDevice(
            device.id,
            serviceUUID,
            characteristicUUID,
            b,
          );

        // const serviceUUIDs = device.serviceUUIDs;

        // console.log(serviceUUIDs);
        // const characteristics = await device.characteristicsForService(
        //   '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
        // );

        console.log(await characteristics.read());
      } catch (error) {
        console.log(error);
      }
    }
  };

  const disconnectExistingConnection = async ({
    deviceID = '24:DC:C3:A7:25:52',
  }) => {
    try {
      const disconnectedDevice = await bleManager?.cancelDeviceConnection(
        deviceID,
      );
      if (disconnectedDevice) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  };

  const startConnectedDevice = () => {
    const bleManager = new BleManager();
    if (bleManager && connectedDevice) {
      bleManager.writeCharacteristicWithoutResponseForDevice(
        connectedDevice.id,
      );
    }
  };
  return (
    <BLEStateContext.Provider value={{bleState, connectedDevice}}>
      <BLEActionsContext.Provider value={{scanAndConnect}}>
        {children}
      </BLEActionsContext.Provider>
    </BLEStateContext.Provider>
  );
};

const useBLEState = () => {
  const context = useContext(BLEStateContext);
  if (context === undefined) {
    throw new Error('useBLEState error');
  }

  return context;
};

const useBLEActions = () => {
  const context = useContext(BLEActionsContext);
  if (context === undefined) {
    throw new Error('useBLEActions error');
  }

  return context;
};

export {
  useBLEState,
  useBLEActions,
  BLEContextProvider,
  BLEStateContext,
  BLEActionsContext,
};
