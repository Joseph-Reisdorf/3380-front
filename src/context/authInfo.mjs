import { useAuth } from './authContext.mjs';

/*
// Custom hook to get the user's role
export const useUserRole = () => {
    const { loggedIn } = useAuth();
    
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (!loggedIn) {
            console.log("Not logged in");
            setRole(null);
            return;
        }

        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Decoded token:", decoded);
                setRole(decoded.role);
            } catch (error) {
                console.error("Error decoding token:", error);
                setRole(null);
            }
        }
    }, [loggedIn]); // Dependency array ensures this effect runs when `loggedIn` changes

    return role;
};*/

// Component or custom hook using `useUserRole`
export const useIsArtist = () => {
    const { loggedIn, userRole, listenerId } = useAuth();
    console.log("Role (from authInfo): " + listenerId);
    return userRole === 'a';
};
