export class PermissionsState {
  /**
   * @param {object} param0
   * @param {Boolean} param0.isLoading
   * @param {Array<String>} param0.granted
   * @param {Array<String>} param0.unavailable
   * @param {Array<String>} param0.denied
   * @param {Error} param0.error
   */
  constructor({unavailable, denied, isLoading, granted, error}) {
    /**
     * @type {Boolean}
     */
    this.isLoading = isLoading;
    /**
     * @type {Array<String>}
     */
    this.granted = granted;
    /**
     * @type {Array<String>}
     */
    this.unavailable = unavailable;
    /**
     * @type {Array<String>}
     */
    this.denied = denied;
    /**
     * @type {Error}
     */
    this.error = error;
  }
}
