import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import React from 'react';
import {GLOBAL_STYLES} from '../../../globalStyles';

const styles = StyleSheet.create({});
export const AppBar = ({
  navigation,
  title,
  backgroundColor,
  actionText,
  actionHandler,
}) => {
  const _navigateBack = navigation
    ? () => {
        navigation.goBack();
      }
    : null;
  return (
    <Appbar.Header style={[GLOBAL_STYLES.appbar_main]}>
      {_navigateBack && <Appbar.BackAction onPress={_navigateBack} />}
      <Appbar.Content title={title} titleStyle={[GLOBAL_STYLES.appbar_title]} />
    </Appbar.Header>
  );
};
