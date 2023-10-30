import {useEffect} from 'react';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
const {StyleSheet, Alert, Text, Button, View} = require('react-native');
const {
  useAuthState,
  useAuthActions,
} = require('../../logic/contexts/authContext');
const {useFormik} = require('formik');
const {TextInput} = require('react-native-paper');

const PhoneNumberInputForm = ({isLoading, handleSendOTP}) => {
  const {authState, signInState} = useAuthState();
  const phoneInputForm = useFormik({
    initialValues: {phoneNumber: ''},
    validate: values => {
      const errors = {};
      if (!values.phoneNumber) {
        errors.phoneNumber = 'Required';
      } else if (values.phoneNumber.length != 10) {
        errors.phoneNumber = 'Invalid phone';
      }
      return errors;
    },
    onSubmit: values => {
      handleSendOTP({phoneNumber: values.phoneNumber});
    },
  });
  return (
    <View style={styles.phone_input_main}>
      <Text
        style={[
          {
            marginTop: 25,
            width: '100%',
          },
        ]}>{`Please enter your phone number to sign in.`}</Text>
      <TextInput
        value={phoneInputForm.values.phoneNumber}
        keyboardType="numeric"
        onBlur={phoneInputForm.handleBlur('phoneNumber')}
        placeholder="Phone number"
        onChangeText={phoneInputForm.handleChange('phoneNumber')}></TextInput>
      {phoneInputForm.errors?.phoneNumber ? (
        // <Alert message={phoneInputForm.errors.phoneNumber} />
        <Text>{phoneInputForm.errors.phoneNumber}</Text>
      ) : null}
      <Text>
        By signing up, you confirm that you agree to our Terms of Use and have
        read and understood out Privacy Policy. You will receive an SMS to
        confirm your phone number, SMS fee may apply
      </Text>

      <Button onPress={phoneInputForm.submitForm} title="Submit" />
    </View>
  );
};

const OTPInputForm = ({
  handleConfirmOTP,
  isLoading,
  handleResendCode,
  handleChangePhoneNumber,
}) => {
  const {auth, resendOTPState, signInState} = useAuthState();
  const {setResendOTPState} = useAuthActions();
  const _handleResendDisablerTrigger = () => {
    setResendOTPState({...resendOTPState, isResendable: false});
  };
  const _handleResendEnableTrigger = () => {
    setResendOTPState({...resendOTPState, isResendable: true});
  };
  const otpInputForm = useFormik({
    initialValues: {otp: ''},
    validate: values => {
      const errors = {};
      if (!values.otp) {
        errors.otp = 'Required';
      } else if (values.otp.length != 6) {
        errors.otp = 'Invalid OTP';
      }
      return errors;
    },
    onSubmit: values => {
      handleConfirmOTP(values.otp);
    },
  });
  return (
    <View style={styles.otp_input_main}>
      {/* <Text
        style={[
          GLOBAL_STYLES.text_16_dark_400,
          {
            marginTop: 5,
            width: '100%',
          },
        ]}>{`+44 ${phone}`}</Text> */}

      <TextInput
        value={otpInputForm.values.otp}
        keyboardType="numeric"
        onBlur={otpInputForm.handleBlur('otp')}
        placeholder="OTP"
        onChangeText={otpInputForm.handleChange('otp')}></TextInput>

      {/* {verifyOtpFailure ? (
        <AlertText message={'Invalid OTP'} iconPosition="start" />
      ) : null}
      {verifyUserFailure ? (
        <AlertText message={'Server not reachable'} iconPosition="start" />
      ) : null}
      {resendOtpFailure ? (
        <AlertText
          message={'OTP not sent. Please try after sometime'}
          iconPosition="start"
        />
      ) : null} */}
      {/* {verifyOtpSuccess &&
      (!resendOtpFailure || !verifyUserFailure || !verifyOtpFailure) ? (
        <SuccessText
          message={'OTP verified'}
          iconPosition="start"
          customStyle={{marginTop: 10}}
          textStyle={{color: CONSTANTS.COLORS.DARK_FONT}}
        />
      ) : null} */}

      {/* {verifyOtpSuccess ? null : (
        <View style={styles.otp_action_button_container}>
          <TextButton
            onPress={handleResendOTP}
            buttonStyle={{paddingHorizontal: 2}}
            buttonText={'Resend OTP'}
            size={16}></TextButton>
          <TextButton
            onPress={handleChangePhoneNumber}
            buttonStyle={{paddingHorizontal: 2}}
            buttonText={'Change number'}
            size={16}></TextButton>
        </View>
      )} */}
      <Button onPress={otpInputForm.handleSubmit} title="Submit" />
    </View>
  );
};

const SignInScreen = ({}) => {
  const {authState, signInState, resendOTPState} = useAuthState();
  const {sendOTP, confirmOTP} = useAuthActions();
  useEffect(() => {
    if (authState && authState.user) {
      console.log({authState});
    }
  }, [authState]);

  const _handleSendOTP = phoneNumber => {
    sendOTP(phoneNumber);
  };

  const _handleConfirmOTP = OTP => {
    confirmOTP(OTP);
  };

  const _handleResendCode = () => {
    if (resendOTPState?.resendPhoneNumber) {
      sendOTP(resendOTPState.resendPhoneNumber, true);
    }
  };

  // const _handleChangePhoneNumber = () => {
  //   window.location.reload();
  // };

  return (
    <SafeAreaView style={styles.login_main}>
      {/* <StatusBarWithHeight /> */}
      {/* <SvgXml xml={grin_logo_icon} /> */}
      {signInState.confirmationResult ? (
        <OTPInputForm
          handleConfirmOTP={_handleConfirmOTP}
          isLoading={signInState?.isLoading}
          handleResendCode={_handleResendCode}
          // handleChangePhoneNumber={_handleChangePhoneNumber}
        />
      ) : (
        <PhoneNumberInputForm
          handleSendOTP={_handleSendOTP}
          isLoading={signInState?.isLoading}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  login_main: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 60,
  },
  phone_input_main: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    width: '100%',
  },
  otp_input_main: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    width: '100%',
  },
  code_input_underline: {
    height: 45,
    borderWidth: 0,
    backgroundColor: '#212121',
    borderRadius: 8,
    color: '#212121',
    fontSize: 20,
    fontWeight: '700',
  },

  code_input_underline_highlighted: {
    borderColor: '#03DAC6',
  },
  otp_action_button_container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
  },
});

export default SignInScreen;
