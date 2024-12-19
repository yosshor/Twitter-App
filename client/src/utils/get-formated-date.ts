export const formatTimeAgo = (createdAt: string) => {
    if (createdAt && !isNaN(new Date(createdAt).getTime())) {
        const timeDiffInMinutes = Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60));
        if (timeDiffInMinutes < 60) {
            return `${timeDiffInMinutes}m ago`;  // Show minutes if less than 60 minutes
        } else {
            const timeDiffInHours = Math.floor(timeDiffInMinutes / 60);
            if (timeDiffInHours < 24) {
                return `${timeDiffInHours}h ago`;  // Show hours if less than 24 hours
            } else {
                const timeDiffInDays = Math.floor(timeDiffInHours / 24);
                return `${timeDiffInDays}d ago`;  // Show days if more than 24 hours
            }
        }
    }
    return "Invalid date"; // Return if the date is invalid
};