

export default async function getCurrentUser(url: string, userId?: string|null) {
    try {
        
        const fullUrl = `${url}/api/users/get-current-user`
        const tokenUser = document.cookie.split("userTwitter=")[1].split(";")[0];
        const response = await fetch(fullUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenUser}`,
                ...(userId && { UserId: `${userId}` }),
            },
            credentials: "include", // Include cookies in the request
        });
        if (response.ok) {
            const user = await response.json();
            console.log("user:", user.user[0]);
            return user.user[0];
        }
        else {
            return null;
        }
    } catch (error) {
        console.error(error);
    }
}

export async function getMinCurrentUserData(url: string) {
    try {
        
        const fullUrl = `${url}/api/users/get-current-user-min-details`
        const tokenUser = document.cookie.split("userTwitter=")[1].split(";")[0];
        const response = await fetch(fullUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenUser}`,
            },
            credentials: "include", // Include cookies in the request

        });
        if (response.ok) {
            const user = await response.json();
            return user;
        }
        else {
            return null;
        }
    } catch (error) {
        console.error(error);
    }
}
