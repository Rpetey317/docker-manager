import { useState } from "react";
import DockerStats from "~/components/DockerStats";
import FolderManager from "~/components/FolderManager";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"stats" | "folders">("stats");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Docker Admin Panel</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("stats")}
                className={`px-4 py-2 rounded-md ${
                  activeTab === "stats"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Docker Stats
              </button>
              <button
                onClick={() => setActiveTab("folders")}
                className={`px-4 py-2 rounded-md ${
                  activeTab === "folders"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Folder Manager
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "stats" && <DockerStats />}
        {activeTab === "folders" && <FolderManager />}
      </div>
    </div>
  );
}