import Cookies from 'js-cookie';

export default function authMiddleware({ next, router }) {
    console.log('Router:', router); // Add this line to check the router object
    const token = Cookies.get('auth_token');

    if (!token) {
        return router.push({ name: 'login' });
    }

    return next();
}
