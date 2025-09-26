import { api } from "~/utils/api";

export default function DockerStats() {
  const { data: stats, refetch } = api.docker.getStats.useQuery();
  const startContainer = api.docker.startContainer.useMutation({
    onSuccess: () => refetch(),
  });
  const stopContainer = api.docker.stopContainer.useMutation({
    onSuccess: () => refetch(),
  });
  const removeContainer = api.docker.removeContainer.useMutation({
    onSuccess: () => refetch(),
  });

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Containers</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.containers.running}</p>
          <p className="text-sm text-gray-600">Running / {stats.containers.total} Total</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Images</h3>
          <p className="text-3xl font-bold text-green-600">{stats.images.count}</p>
          <p className="text-sm text-gray-600">{(stats.images.totalSize / 1024 / 1024 / 1024).toFixed(2)} GB</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">System</h3>
          <p className="text-3xl font-bold text-purple-600">Docker</p>
          <p className="text-sm text-gray-600">Active</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Containers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.containers.list.map((container) => (
                <tr key={container.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {container.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {container.image}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      container.state === "running" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {container.state}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {container.state === "running" ? (
                      <button
                        onClick={() => stopContainer.mutate({ id: container.id })}
                        className="text-red-600 hover:text-red-900"
                      >
                        Stop
                      </button>
                    ) : (
                      <button
                        onClick={() => startContainer.mutate({ id: container.id })}
                        className="text-green-600 hover:text-green-900"
                      >
                        Start
                      </button>
                    )}
                    <button
                      onClick={() => removeContainer.mutate({ id: container.id })}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}