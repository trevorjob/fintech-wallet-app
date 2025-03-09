import rateLimit from "express-rate-limit";

// Rate limiter for wallet funding endpoints
export const fundingRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: "Too many funding attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
