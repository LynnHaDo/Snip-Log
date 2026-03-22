import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

interface EditUsernameDialogProps {
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  currentUsername: string;
}

const EditUsernameDialog = ({
  setIsDialogOpen,
  currentUsername,
}: EditUsernameDialogProps) => {
  const [username, setUsername] = useState(currentUsername);
  const [error, setError] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const updateUsername = useMutation(api.users.updateUserName);

  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChanging(true);

    if (username.trim() === "" || username.trim().length < 5) {
      setError(
        "Username should not be blank or contains less than 5 characters.",
      );
      return;
    }

    try {
      await updateUsername({ username: username.trim() });
      setUsername("");
      setIsChanging(false);
      toast.success("Username updated successfully");
    } catch (error) {
      console.log("Error changing username:", error);
      toast.error("Error changing username");
    } finally {
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`bg-[#012840] rounded-lg p-6 w-full max-w-md`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Edit your user name</h2>
          <button
            onClick={() => setIsDialogOpen(false)}
            className="text-gray-400 hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleChangeUsername}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
                setIsChanging(false);
              }}
              className="w-full px-3 py-2 bg-dark rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-highlight-200"
              placeholder="Enter username"
              required
            />
            <span className="block text-sm text-red-400 mt-2 ml-1">{error}</span>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 text-gray-400 hover:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isChanging}
              className={`px-4 py-2 bg-highlight/90 text-white rounded-lg hover:bg-bg-highlight 
              disabled:opacity-50`}
            >
              {isChanging ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUsernameDialog;
