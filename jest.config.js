module.exports = {
    // ...
    transform: {
        "^.+\\.(ts|tsx)$": "babel-jest"
    },
    testTimeout: 60000
    // éventuellement:
    // transformIgnorePatterns: ["/node_modules/"]
};