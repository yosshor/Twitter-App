

export default async function getCurrentUser(url: string) {
    try {
        const fullUrl = `${url}/api/users/get-current-user`
        const token = document.cookie.split("userTwitter=")[1].split(";")[0];
        const response = await fetch(fullUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
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
