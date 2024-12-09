import useCurrentUser from "../../hooks/useCurrentUser";
// import Header from "../../views/components/header/Header"
// import Sidebar from "../../views/components/sidebar/Sidebar"



function UserProfile() {
    const { userData, loading } = useCurrentUser();

    if (loading) return <div>Loading...</div>;

    return (
        // <div className="home">
        //     <Header isActive={userData === null ? false : true} />
        //     <div className="main-content">
                <div>
                    {userData ? (
                        <div>
                            {/* <Sidebar userData={userData} /> */}
                            <h1>Welcome, {userData.fullName}!</h1>
                            <p>Email: {userData.email}</p>
                        </div>
                    ) :  <div>No user data available.</div>
                    }
                 </div>
            // </div>
        // </div>
    );
}

export default UserProfile;