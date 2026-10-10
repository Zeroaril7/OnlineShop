import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2>Profil Pengguna</h2>
        </div>
      </div>

      <table className="profile-table">
        <tbody>
          <tr>
            <td>Nama Lengkap</td>
            <td><strong>{user.name}</strong></td>
          </tr>
          <tr>
            <td>Email Akun</td>
            <td>{user.email}</td>
          </tr>
          <tr>
            <td>User ID</td>
            <td><code>{user.id}</code></td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem' }}>
        <button
          onClick={logout}
          className="btn-delete"
          style={{ padding: '0.6rem 1.2rem', cursor: 'pointer' }}
        >
          Keluar (Logout)
        </button>
      </div>
    </div>
  );
};
