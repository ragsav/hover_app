export class AuthState {
  /**
   *  @param {object} param0
   * @param {Boolean} param0.isLoading
   * @param {object} param0.user
   * @param {Error} param0.error
   */
  constructor({isLoading, user, error}) {
    /**
     * @type {Boolean}
     */
    this.isLoading = isLoading;
    /**
     * @type {object}
     */
    this.user = user;

    /**
     * @type {Error}
     */
    this.error = error;
  }
}
