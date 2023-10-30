export const CONSTANTS = {
  API_SERVER: 'http://localhost:8090',
  SOCKET_SERVER: 'http://localhost:8090',

  APIS: {
    USER: {
      getSelf: () => '/api/users/me',
    },
    FCM: {
      registerDeviceToken: () => '/api/users/register_device',
    },
    VEHICLES: {
      getNearby: () => `/api/vehicles/`,
      getById: vehicleId => `/api/vehicles/${vehicleId}`,
      ringVehicle: vehicleId => `/api/vehicles/ring/${vehicleId}`,
    },
    STATIONS: {
      getNearby: () => `/api/stations/`,
      getById: stationId => `/api/stations/${stationId}`,
    },
    BOOKING: {
      ongoing: () => `/api/bookings/ongoing`,
      reserve: () => `/api/bookings/reserve_ride`,
      cancelReservation: () => `/api/bookings/cancel_reservation`,
      bookRide: () => `/api/bookings/book_ride`,
      pauseRide: () => `/api/bookings/pause_ride`,
      resumeRide: () => `/api/bookings/resume_ride`,
      endRide: force =>
        force ? `/api/bookings/end_ride?force=true` : `/api/bookings/end_ride`,
      retryEndRidePayment: () => `/api/bookings/retry_end_ride_payment`,
    },
    PAYMENT: {
      addCard: () => `/api/payments/add_card`,
      getSetupIntent: () => `/api/payments/setup_intent`,
      getPaymentMethodById: paymentMethodID =>
        `/api/payments/payment_method/${paymentMethodID}`,
    },
    COUPONS: {
      getAllCoupons: () => `/api/coupons/`,
      getCouponById: (couponId, couponTypeId) =>
        `/api/coupons/${couponId}/${couponTypeId}`,
    },
    SUBSCRIPTIONS: {
      getRidePassHistory: () => `/api/subscriptions/`,
      getAllSubscriptionTypes: () => `/api/subscription_types/`,
      getSubscriptionTypeById: subscriptionTypeId =>
        `/api/subscription_types/${subscriptionTypeId}`,
      buySubscription: () => `/api/subscriptions/`,
      retryNewSubscriptionPayment: () =>
        `/api/subscriptions/retry_new_subscription_payment`,
      getSubscriptionById: subscriptionId =>
        `/api/subscriptions/${subscriptionId}`,
    },
  },

  SOCKET_EVENTS: {
    ON_VEHICLES_UPDATE: 'ON_VEHICLES_UPDATE',
    ON_STATION_UPDATE: 'ON_STATION_UPDATE',
    ON_CURRENT_VEHICLE_UPDATE: 'ON_CURRENT_VEHICLE_UPDATE',
    ON_USER_UPDATE: 'ON_USER_UPDATE',
    ON_WALLET_UPDATE: 'ON_WALLET_UPDATE',
    ON_CURRENT_BOOKING_UPDATE: 'ON_CURRENT_BOOKING_UPDATE',
    ON_CURRENT_PAYMENT_ORDER_UPDATE: 'ON_CURRENT_PAYMENT_ORDER_UPDATE',
    ON_PAYMENT_TRANSACTION_UPDATE: 'ON_PAYMENT_TRANSACTION_UPDATE',
    ON_SERVER_SIDE_ERROR: 'ON_SERVER_SIDE_ERROR',
  },

  SOCKET_EMIT_EVENTS: {
    USER_LOCATION_DATA: 'USER_LOCATION_DATA',
  },

  ERROR_CODES: {
    APPLICATION_ERROR: {
      code: 'APPLICATION_ERROR',
      message: 'Internal Application error occured!',
    },
    NO_RESPONSE_FROM_SERVER: {
      code: 'NO_RESPONSE_FROM_SERVER',
      message: 'No response from server',
    },
    SERVER_ERROR: {
      code: 'SERVER_ERROR',
      message: 'Server error',
    },
  },

  BLE_STATE: {
    ON: 'PoweredOn',
    OFF: 'PoweredOff',
  },
};
