export default {
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: [
    "json-summary",
    "text",
    "lcov"
  ],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  "transform": {
    "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest",
    "^.+\\.svg$": "@superevilmegaco/jest-evil-svg-transformer"
  },
  "transformIgnorePatterns": [
    "node_modules/(?!variables/.*)"
   ],
};
