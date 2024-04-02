resolve: {
    fallback: {
        "child_process": false,
        "inspector": false,
        "crypto": require.resolve("crypto-browserify"),
        "http": require.resolve("stream-http"),
        "url": require.resolve("url/"),
        "domain": require.resolve("domain-browser"),
        "os": require.resolve("os-browserify/browser"),
        "util": require.resolve("util/"),
        "stream": require.resolve("stream-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "assert": require.resolve("assert/")
    }
}
