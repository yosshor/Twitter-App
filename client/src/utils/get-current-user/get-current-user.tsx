export default async function getCurrentUser() {
    try {
        const response = await fetch("/api/users/get-current-user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
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