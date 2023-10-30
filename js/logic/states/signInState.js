import {FirebaseAuthTypes} from '@react-native-firebase/auth';
export class SignInState {
  /**
   *
   * @param {object} param0
   * @param {Boolean} param0.isLoading
   * @param {Boolean} param0.success
   * @param {Error} param0.error
   */
  constructor({isLoading, success, error, confirmationResult}) {
    /**
     * @type {Boolean}
     */
    this.isLoading = isLoading;
    /**
     * @type {Boolean}
     */
    this.success = success;
    /**
     * @type {Error}
     */
    this.error = error;

    /**
     * @type {FirebaseAuthTypes.ConfirmationResult}
     */
    this.confirmationResult = confirmationResult;
  }
}
