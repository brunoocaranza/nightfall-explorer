const appConfiguration = () => {
  return {
    app: {
      host: process.env.HOST,
      port: process.env.PORT,
      env: process.env.NODE_ENV,
      serviceName: process.env.SERVICE_NAME,
      originName: process.env.ORIGIN_NAME,
      throttleTtl: +process.env.THROTTLE_TTL,
      throttleLimit: +process.env.THROTTLE_LIMIT,
    },
    database: {
      host: process.env.MONGODB_HOST || 'localhost',
      port: process.env.MONGODB_PORT || 27017,
      name: process.env.MONGODB_DATABASE_NAME || 'nightfall',
      username: process.env.MONGODB_USER || '',
      password: process.env.MONGODB_PASSWORD || '',
    },
    contract: {
      blockchainUrl: process.env.BLOCKCHAIN_URL,
      optimistApiUrl: process.env.NIGHTFALL_OPTIMIST_URL,
      stateContract: 'State',
      shieldContract: 'Shield',
    },
    dashboardApiUrl: process.env.NIGHTFALL_DASHBOARD_URL,
    explorerSyncUrl: process.env.EXPLORER_SYNC_URL,
    web3ProviderOptions: {
      clientConfig: {
        // Useful to keep a connection alive
        keepalive: true,
        // Keep keepalive interval small so that socket doesn't die
        keepaliveInterval: 1500,
      },
      timeout: 0,
      reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 120,
        onTimeout: false,
      },
    },
    cloudWatch: {
      groupName: process.env.CLOUDWATCH_GROUP_NAME,
    },
  };
};

export default appConfiguration;
