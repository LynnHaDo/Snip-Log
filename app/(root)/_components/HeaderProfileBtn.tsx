'use client'

import { UserButton, SignedOut, SignInButton } from "@clerk/nextjs";
import { User } from "lucide-react";
import NavItem from "../../../components/NavItem";

export default function HeaderProfileBtn() {
    return <>
    <UserButton>
        <UserButton.MenuItems>
            <UserButton.Link 
                label="Profile"
                labelIcon={<User className="size-4"/>}
                href="/profile"
            />
        </UserButton.MenuItems>
    </UserButton>

    <SignedOut>
        <NavItem element={<SignInButton />} icon={<User className="w-4 h-4 text-white-400 hover:text-white-300" />}/>
    </SignedOut>
    </>
}