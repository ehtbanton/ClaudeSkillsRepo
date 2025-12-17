// Content Security Policy configuration for Express.js

export const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'", // Remove in production if possible
    "https://cdn.jsdelivr.net",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'", // Required for CSS-in-JS
    "https://fonts.googleapis.com",
  ],
  fontSrc: [
    "'self'",
    "https://fonts.gstatic.com",
    "data:",
  ],
  imgSrc: [
    "'self'",
    "data:",
    "blob:",
    "https:",
  ],
  connectSrc: [
    "'self'",
    process.env.API_URL || "https://api.example.com",
    "https://www.google-analytics.com",
  ],
  frameSrc: ["'none'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"],
  upgradeInsecureRequests: [],
};

export const cspHeader = Object.entries(cspDirectives)
  .map(([key, values]) => {
    const directive = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    return `${directive} ${values.join(' ')}`;
  })
  .join('; ');

// Usage with helmet:
// app.use(helmet.contentSecurityPolicy({ directives: cspDirectives }));
