import Image from "next/image";

export default function UserInfo({user}) {

    const getUserDate = () => {
        const date = new Date(user.createdAt);

        return date.toLocaleDateString("en-GB").replace(/\//g, "-");
    }

    return (
        <div className="flex items-center gap-4 bg-background-1 rounded-lg p-4 md:p-8">
            <div className="relative w-12 xl:w-16 aspect-square">
                <Image className="w-full h-auto rounded-full" width={2000} height={2000} src={user.image} alt="User's avatar"  />
            </div>
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl xl:text-5xl">{user.name}</h1>
                <p className="opacity-70 font-light">Member since {getUserDate()}</p>
            </div>
        </div>
    )
}