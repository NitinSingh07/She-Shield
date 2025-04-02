const corsOptions = {
  origin: ["https://she-shield-roan.vercel.app", "http://localhost:51730"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

module.exports = corsOptions;
