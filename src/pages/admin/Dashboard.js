import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const API_URL = 'http://localhost:4000/api';

function Dashboard({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, productsRes] = await Promise.all([
        fetch(`${API_URL}/users`),
        fetch(`${API_URL}/products`)
      ]);
      const userData = await usersRes.json();
      const productData = await productsRes.json();
      setUsers(userData.users || []);
      setProducts(productData.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard"><p>Loading...</p></div>;
  if (error) return <div className="dashboard"><p style={{ color: 'red' }}>Error: {error}</p></div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-number">{products.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Stock</h3>
          <p className="stat-number">{products.reduce((sum, p) => sum + (p.stock || 0), 0)}</p>
        </div>
      </div>

      <button className="refresh-btn" onClick={fetchData}>Refresh Data</button>
    </div>
  );
}

export default Dashboard;
