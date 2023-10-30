import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import {openSettings} from 'react-native-permissions';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  usePermissionsActions,
  usePermissionsState,
} from '../../logic/contexts/permissionsContext';
import {AppBar} from '../components/appbar';
import {Button} from 'react-native-paper';
import {CONSTANTS} from '../../../constants';
import {GLOBAL_STYLES} from '../../../globalStyles';

const styles = StyleSheet.create({
  permission_main: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  permission_item_main: {
    width: '100%',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  note: {
    fontSize: 14,
    fontWeight: '400',
    color: '#777777',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
});

const PermissionsScreen = () => {
  const {permissionsState} = usePermissionsState();
  const {checkAndRequestRequiredPermissions} = usePermissionsActions();
  const _handleOnRefresh = () => {
    checkAndRequestRequiredPermissions();
  };

  return (
    <SafeAreaView style={styles.permission_main}>
      <StatusBar hidden />
      <AppBar title={'Permissions'} />
      <ScrollView
        contentContainerStyle={{paddingHorizontal: 20, paddingTop: 20}}
        refreshControl={
          <RefreshControl
            refreshing={permissionsState.isLoading}
            onRefresh={_handleOnRefresh}
          />
        }>
        {permissionsState?.denied && permissionsState?.unavailable
          ? [...permissionsState.denied, ...permissionsState.unavailable].map(
              permission => {
                return (
                  <View style={styles.permission_item_main} key={permission}>
                    <MaterialCommunityIcons
                      name={'label'}
                      size={24}
                      style={{marginRight: 12}}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                      }}>
                      {`${permission}`}
                    </Text>
                  </View>
                );
              },
            )
          : null}
      </ScrollView>
      <Text style={styles.note}>Pull down to see refresh</Text>

      <Button
        onPress={() => {
          openSettings();
        }}
        mode="contained"
        style={[
          GLOBAL_STYLES.primary_contained_button,
          {marginHorizontal: 10, marginBottom: 10},
        ]}>
        Open settings
      </Button>
    </SafeAreaView>
  );
};

export default PermissionsScreen;
