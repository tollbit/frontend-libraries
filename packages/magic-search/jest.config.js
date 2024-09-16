/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.ts"],
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
};
