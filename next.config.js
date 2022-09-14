const {withSentryConfig} = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ["images.clerk.dev"],
    },
    sentry: {
        hideSourceMaps: true,
    },
}

const sentryWebpackPluginOptions = {
    silent: true, // Suppresses all logs
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)
