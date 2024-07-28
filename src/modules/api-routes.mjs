const routes = Object.freeze({
    sanctumCsrfCookie: '/sanctum/csrf-cookie',
    user: '/api/user',
    auth: {
        login: '/login',
        logout: '/logout',
        register: '/register',
        forgotPassword: '/forgot-password',
        resetPassword: '/reset-password',
        sendVerificationEmail: '/email/verification-notification',
    },
});

export default routes;
