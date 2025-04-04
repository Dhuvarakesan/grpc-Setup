import { useState } from "react";
import { createUser, deleteUser, getUser } from "./api";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Handle user creation
  const handleCreateUser = async () => {
    setLoading(true);
    try {
      const res = await createUser(name, email);
      alert(`User Created: ${res.id}`);
      setUserId(res.id);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle fetching user details
  const handleGetUser = async () => {
    setLoading(true);
    try {
      const res = await getUser(userId);
      setUser(res);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting user
  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      const res = await deleteUser(userId);
      alert(res.message);
      setUser(null);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>gRPC User Management</h1>

      {/* Create User */}
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleCreateUser} disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </button>

      {/* Get User */}
      <input placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
      <button onClick={handleGetUser} disabled={loading}>
        {loading ? "Fetching..." : "Fetch User"}
      </button>

      {user && (
        <div>
          <h3>User Details</h3>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}

      {/* Delete User */}
      <button onClick={handleDeleteUser} disabled={loading}>
        {loading ? "Deleting..." : "Delete User"}
      </button>
    </div>
  );
}

export default App;
