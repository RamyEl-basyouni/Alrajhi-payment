const ServerConfiguration = {
  isApprovalProcessEnabled: false,
  database: {
    collection: {
      LISTINGS: "universal_listings",
      SAVED_LISTINGS: "universal_saved_listings",
      CATEGORIES: "universal_categories",
      FILTERS: "universal_filters",
      REVIEWS: "universal_reviews",
      USERS: "users",
      CHANNELS: "channels",
      CHANNEL_PARTICIPATION: "channel_participation",
    },
  },
};

export default ServerConfiguration;
