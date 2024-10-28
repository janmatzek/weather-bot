/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest", // Use the ts-jest preset
  testEnvironment: "node", // Set the test environment to Node
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Use ts-jest for .ts/.tsx files
  },
  moduleFileExtensions: ["ts", "js", "json", "node"], // Recognize .ts files
};
