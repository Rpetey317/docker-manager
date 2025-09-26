import { useState } from "react";
import { api } from "~/utils/api";

export default function FolderManager() {
  const [newFolder, setNewFolder] = useState({ name: "", path: "" });
  const [selectedFolder, setSelectedFolder] = useState<string>("");

  const { data: folders, refetch: refetchFolders } = api.folders.getAll.useQuery();
  const { data: dockerFiles } = api.folders.scanDockerFiles.useQuery(
    { folderId: selectedFolder },
    { enabled: !!selectedFolder }
  );

  const addFolder = api.folders.add.useMutation({
    onSuccess: () => {
      refetchFolders();
      setNewFolder({ name: "", path: "" });
    },
  });

  const removeFolder = api.folders.remove.useMutation({
    onSuccess: () => refetchFolders(),
  });

  const buildDockerfile = api.folders.buildDockerfile.useMutation();
  const runCompose = api.folders.runCompose.useMutation();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Add Scan Folder</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Folder name"
            value={newFolder.name}
            onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Folder path"
            value={newFolder.path}
            onChange={(e) => setNewFolder({ ...newFolder, path: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <button
            onClick={() => addFolder.mutate(newFolder)}
            disabled={!newFolder.name || !newFolder.path}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Add Folder
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Scan Folders</h3>
        </div>
        <div className="p-6">
          {folders?.map((folder) => (
            <div key={folder.id} className="flex items-center justify-between p-3 border rounded mb-2">
              <div>
                <h4 className="font-medium">{folder.name}</h4>
                <p className="text-sm text-gray-600">{folder.path}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setSelectedFolder(folder.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Scan
                </button>
                <button
                  onClick={() => removeFolder.mutate({ id: folder.id })}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {dockerFiles && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Docker Files Found</h3>
          </div>
          <div className="p-6">
            {dockerFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded mb-2">
                <div>
                  <h4 className="font-medium">{file.name}</h4>
                  <p className="text-sm text-gray-600">{file.path}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    file.type === "dockerfile" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                  }`}>
                    {file.type}
                  </span>
                </div>
                <div className="space-x-2">
                  {file.type === "dockerfile" && (
                    <button
                      onClick={() => buildDockerfile.mutate({ 
                        dockerfilePath: file.path, 
                        tag: file.name.toLowerCase() 
                      })}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Build
                    </button>
                  )}
                  {file.type === "compose" && (
                    <>
                      <button
                        onClick={() => runCompose.mutate({ composePath: file.path, action: "up" })}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Up
                      </button>
                      <button
                        onClick={() => runCompose.mutate({ composePath: file.path, action: "down" })}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Down
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}