const {defaults} = require("jest-config");

module.exports = {
    verbose: true,
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    moduleDirectories: ["node_modules", "bower_components", "shared"],
    globals: {
        window: {}
    },
    testMatch: [
        "**/__tests__/**/*.+(ts|tsx|jsx)",
        "**/?(*.)+(spec|test).+(ts|tsx|js|jsx)"
    ],
    transformIgnorePatterns: ["/node_modules/"],
    transform: {
        "^.+\\.(ts|tsx|jsx|css)$": "ts-jest"
    },
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
        "\\.(css|less)$": "identity-obj-proxy",
    }
};