import { useState } from 'react';

export function AdminComplaints() {
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const complaints = [
    {
      id: '1',
      reporter: 'John Doe',
      reportedEntity: 'User: Jane Smith',
      description: 'Item was not as described in the listing',
      status: 'OPEN',
      date: '2026-04-15',
    },
    {
      id: '2',
      reporter: 'Alice Brown',
      reportedEntity: 'Listing: MacBook Pro 16"',
      description: 'Item was damaged upon delivery',
      status: 'RESOLVED',
      date: '2026-04-10',
    },
    {
      id: '3',
      reporter: 'Bob Johnson',
      reportedEntity: 'User: Mike Wilson',
      description: 'User was unresponsive and did not return item on time',
      status: 'OPEN',
      date: '2026-04-18',
    },
  ];

  const filteredComplaints = complaints.filter((c) => {
    if (filter === 'all') return true;
    return c.status.toLowerCase() === filter;
  });

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Complaint Management</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-card border border-border hover:border-accent'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('open')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'open'
              ? 'bg-primary text-white'
              : 'bg-card border border-border hover:border-accent'
          }`}
        >
          Open
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'resolved'
              ? 'bg-primary text-white'
              : 'bg-card border border-border hover:border-accent'
          }`}
        >
          Resolved
        </button>
      </div>

      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <div key={complaint.id} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{complaint.reportedEntity}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      complaint.status === 'OPEN'
                        ? 'bg-accent/10 text-accent'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {complaint.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Reported by {complaint.reporter} on {complaint.date}
                </p>
              </div>
              {complaint.status === 'OPEN' && (
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm font-medium">
                  Resolve
                </button>
              )}
            </div>
            <p className="text-muted-foreground">{complaint.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
