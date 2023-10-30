export class User {
  constructor({
    userID,
    firebaseID,
    phoneNumber,
    razorpayCustomerID,
    walletID,
    isDisabled,
    createdAt,
    updatedAt,
    disabledAt,
    disableReason,
    userTypeID,
  }) {
    this.userID = userID;
    this.firebaseID = firebaseID;
    this.phoneNumber = phoneNumber;
    this.razorpayCustomerID = razorpayCustomerID;
    this.walletID = walletID;
    this.isDisabled = isDisabled;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.disabledAt = disabledAt;
    this.disableReason = disableReason;
    this.userTypeID = userTypeID;
  }
}
