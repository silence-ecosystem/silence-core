const config = {
    appId: 'com.patternslab.patternlens',
    appName: 'PatternLens',
    webDir: 'out',
    bundledWebRuntime: false,
    ios: {
        scheme: 'patternlens'
    },
    android: {
        allowMixedContent: false,
        backgroundColor: '#0a0a0f'
    },
    server: {
        url: 'https://patternlens.app',
        cleartext: false
    }
};
export default config;
