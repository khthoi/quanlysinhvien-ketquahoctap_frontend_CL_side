import UserProfileInfo from "@/components/pages/UserProfileInfo";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "User Profile - Dashboard",
    description: "User profile page within the dashboard layout.",
};


export default function UserProfilePage() {
    return (
        <>
            <UserProfileInfo />
        </>
    );
}