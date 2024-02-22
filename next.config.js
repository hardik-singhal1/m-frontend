const productname = process.env.NEXT_PUBLIC_PRODUCT_NAME;


const hostport = process.env.NEXT_PUBLIC_HOSTPORT;
const hostport1 = process.env.NEXT_PUBLIC_HOSTPORT;

module.exports = {
    hostport,
    hostport1,
    productname,
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
};
