export function AdminUsers() {
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'USER', isActive: true, joined: '2026-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'USER', isActive: true, joined: '2026-02-20' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'ADMIN', isActive: true, joined: '2026-01-10' },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'USER', isActive: false, joined: '2026-03-05' },
  ];

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">User Management</h1>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-semibold">Name</th>
              <th className="text-left p-4 font-semibold">Email</th>
              <th className="text-left p-4 font-semibold">Role</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Joined</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-border">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 text-muted-foreground">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'ADMIN' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.isActive ? 'bg-accent/10 text-accent' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{user.joined}</td>
                <td className="p-4">
                  <button className="text-primary hover:text-primary/80 text-sm font-medium mr-3">
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="text-accent hover:text-accent/80 text-sm font-medium">
                    Change Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
