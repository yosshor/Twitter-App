// import { createContext } from 'react';
// import type { userDetails } from '../../../../src/models/User';

export default async function getCurrentUser() {
    try {
        
        const response = await fetch("http://localhost:3000/api/users/get-current-user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            const user = await response.json();
            return user.user;
        }
        else {
            return null;
        }
    } catch (error) {
        console.error(error);
    }
}

// const user:userDetails = await getCurrentUser();
// export const userDataContext = createContext(user);