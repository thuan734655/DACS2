const checkAuth = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.idUser) {
            window.location.href = '/login';
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error checking authentication:", error);
        window.location.href = '/login';
        return false;
    }
};

export const withAuth = (WrappedComponent) => {
    return (props) => {
        const isAuthenticated = checkAuth();
        
        if (!isAuthenticated) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
