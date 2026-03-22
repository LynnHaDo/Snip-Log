"use client";

import { Edit2 } from "lucide-react";
import { useState } from "react";
import EditUsernameDialog from "./EditUsernameDialog";

interface EditUsernameButtonProps {
    currentUsername: string
}

const EditUsernameButton = ({ currentUsername }: EditUsernameButtonProps) => {
    const [ isDialogOpen, setIsDialogOpen ] = useState(false);
    
    return <>
    <button
      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
    transition-all duration-200 bg-gray-500/10 text-gray-400 hover:bg-gray-500/20`}
      onClick={() => setIsDialogOpen(true)}
    >
      <Edit2
        className={`w-4 h-4 text-gray-400`}
      />
    </button>

    {isDialogOpen && <EditUsernameDialog setIsDialogOpen={setIsDialogOpen} currentUsername={currentUsername} />}
    </>
}

export default EditUsernameButton;