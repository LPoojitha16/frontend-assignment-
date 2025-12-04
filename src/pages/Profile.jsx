import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

function Profile() {
  const [user, setUser] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosClient.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">Profile</h1>

        {user ? (
          <>
            <p className="text-xl"><strong>Name:</strong> {user.name}</p>
            <p className="text-xl mt-2"><strong>Email:</strong> {user.email}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
