export default {
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiry: process.env.JWT_EXPIRY || '1h',
  },
};
