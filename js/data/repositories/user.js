import axios from 'axios';
import {CONSTANTS} from '../../../constants';
import {extractError} from '../../utils/extractError';
class UserRepository {
  /**
   *
   * @param {object} param0
   * @param {String} param0.token
   */
  constructor({token}) {
    this.token = token;
  }

  getDBUser = ({newToken}) => {
    try {
      const url = `${CONSTANTS.API_SERVER}${CONSTANTS.APIS.USER.getSelf()}`;
      const response = axios.get(url);
    } catch (error) {
      return {data: null, error: extractError(error)};
    }
  };
}
