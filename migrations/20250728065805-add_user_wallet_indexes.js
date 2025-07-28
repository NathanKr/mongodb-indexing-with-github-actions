const TRANSACTIONS_COLLECTION = "transactions";
const USER_PAYMENT_PROFILES_COLLECTION = "user_payment_profiles";

module.exports = {
  async up(db, client) {
    console.log(
      `Applying migration: Creating indexes on ${TRANSACTIONS_COLLECTION}...`
    );

    // Scenario 1: Compound Index for efficient user history lookup
    await db
      .collection(TRANSACTIONS_COLLECTION)
      .createIndex(
        { clerkUserId: 1, timestampUTC: -1 },
        { name: "idx_transactions_clerkUserId_timestampUTC" } 
      );
    console.log("Created compound index: idx_transactions_clerkUserId_timestampUTC"); 

    // Scenario 2: Unique Index for Braintree Transaction ID lookup and data integrity
    await db
      .collection(TRANSACTIONS_COLLECTION)
      .createIndex(
        { braintreeTransactionId: 1 },
        { unique: true, name: "idx_transactions_braintreeTransactionId_unique" } 
      );
    console.log("Created unique index: idx_transactions_braintreeTransactionId_unique");

    console.log(
      `Applying migration: Creating indexes on ${USER_PAYMENT_PROFILES_COLLECTION}...`
    );

    // Index for user_payment_profiles collection using clerkUserId
    await db
      .collection(USER_PAYMENT_PROFILES_COLLECTION)
      .createIndex(
        { clerkUserId: 1 },
        { unique: true, name: "idx_userPaymentProfiles_clerkUserId_unique" }
      );
    console.log(
      `Created unique index: idx_userPaymentProfiles_clerkUserId_unique`
    );
  },

  async down(db, client) {
    console.log(
      `Reverting migration: Dropping indexes from ${TRANSACTIONS_COLLECTION}...`
    );
    await db
      .collection(TRANSACTIONS_COLLECTION)
      .dropIndex("idx_transactions_clerkUserId_timestampUTC"); 
    console.log(
      `Dropped compound index: idx_transactions_clerkUserId_timestampUTC`
    );
    await db
      .collection(TRANSACTIONS_COLLECTION)
      .dropIndex("idx_transactions_braintreeTransactionId_unique"); 
    console.log(
      `Dropped unique index: idx_transactions_braintreeTransactionId_unique`
    );

    console.log(
      `Reverting migration: Dropping indexes from ${USER_PAYMENT_PROFILES_COLLECTION}...`
    );
    await db
      .collection(USER_PAYMENT_PROFILES_COLLECTION)
      .dropIndex("idx_userPaymentProfiles_clerkUserId_unique");
    console.log(
      `Dropped unique index: idx_userPaymentProfiles_clerkUserId_unique`
    );
  },
};
