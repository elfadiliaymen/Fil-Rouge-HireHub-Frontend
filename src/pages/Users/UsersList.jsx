import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    api.get("/users")
      .then((res) => setUsers(res.data.content))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleDelete(userId) {
    const confirmed = window.confirm("Voulez-vous supprimer cet utilisateur ?");

    if (!confirmed) {
      return;
    }

    api.delete(`/users/${userId}`)
      .then(() => {
        setUsers((currentUsers) =>
          currentUsers.filter((user) => user.id !== userId)
        );
      })
      .catch((error) => {
        console.log(error);
        alert("La suppression a échoué.");
      });
  }

  function handleToggleActive(user) {
    const action = user.active ? "desactiver" : "activer";
    const confirmed = window.confirm(
      `Voulez-vous ${action} cet utilisateur ?`
    );

    if (!confirmed) {
      return;
    }

    api.patch(`/users/${user.id}/${action}`)
      .then((res) => {
        setUsers((currentUsers) =>
          currentUsers.map((currentUser) =>
            currentUser.id === user.id ? res.data : currentUser
          )
        );
      })
      .catch((error) => {
        console.log(error);
        alert("L'opération a échoué.");
      });
  }

  const allRoles = users.map((user) => {
    return user.role;
  });

  const uniqueRoles = allRoles.filter((role, index) => {
    return allRoles.indexOf(role) === index;
  });

  let displayedUsers = users;

  if (selectedRole !== "") {
    displayedUsers = users.filter((user) => {
      return user.role === selectedRole;
    });
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Liste des Utilisateurs</h1>

        <Link className="btn-primary" to="/add-user">
          + Ajouter
        </Link>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">Tous les rôles</option>

          {uniqueRoles.map((role, index) => {
            return <option key={index} value={role}>{role}</option>;
          })}
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actif</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              displayedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nom}</td>
                  <td>{user.prenom}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.active ? "Oui" : "Non"}</td>

                  <td className="table-actions">
                    <Link
                      className="btn-view"
                      to={`/consulter-user/${user.id}`}
                    >
                      Consulter
                    </Link>

                    <Link
                      className="btn-edit"
                      to={`/update-user/${user.id}`}
                    >
                      Modifier
                    </Link>

                    <button
                      className="btn-toggle"
                      onClick={() => handleToggleActive(user)}
                    >
                      {user.active ? "Désactiver" : "Activer"}
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(user.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersList;