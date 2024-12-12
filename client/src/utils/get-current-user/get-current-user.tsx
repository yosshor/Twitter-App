

export default async function getCurrentUser(url: string) {
    try {
        const fullUrl = `${url}/api/users/get-current-user`
        const tokenUser = document.cookie.split("userTwitter=")[1].split(";")[0];
        // const tokenAuth = document.cookie.split("auth=")[1].split(";")[0];
        // console.log("token:", tokenUser, tokenAuth);
        const response = await fetch(fullUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenUser}`,
                // "Auth": tokenAuth,
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
