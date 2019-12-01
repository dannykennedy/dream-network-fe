import { useState, useEffect } from "react";

// https://developer.okta.com/blog/2019/03/06/simple-user-authentication-in-react
export const useAuth = auth => {
    const [authenticated, setAuthenticated] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.isAuthenticated().then(isAuthenticated => {
            if (isAuthenticated !== authenticated) {
                setAuthenticated(isAuthenticated);
            }
        });
    });

    useEffect(() => {
        if (authenticated) {
            auth.getUser().then(setUser);
        } else {
            setUser(null);
        }
    }, [authenticated, auth]);

    return [authenticated, user];
};
