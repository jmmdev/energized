import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Pagination from "./pagination";
import Button from "./button";
import { FaEdit, FaSpinner, FaTrash } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function AdminUsers({contentScrollerRef, content, entityToDelete, setShowConfirmDelete, entityToRename, setShowRename, filters}) {
    const {data: session, status} = useSession();
    const [pageNumber, setPageNumber] = useState(0);

    const PER_PAGE = 10;

    const [users, setUsers] = useState(content);

    useEffect(() => {
        contentScrollerRef.current.scrollTo({top: 0});
    }, [pageNumber])

    const UserElement = ({user, index}) => {
        const [waitingStatus, setWaitingStatus] = useState(false);
        const [waitingRole, setWaitingRole] = useState(false);

        const targetRoleRef = useRef();

        useEffect(() => {
            if (waitingStatus)
                setWaitingStatus(false);
            if (waitingRole)
                setWaitingRole(false);
        }, [users])

        useEffect(() => {
            if (waitingStatus)
                switchUserStatus();
            if (waitingRole)
                changeUserRole();
        }, [waitingStatus, waitingRole])

        const getUserDate = () => {
            const joined = new Date(user.createdAt);
            const active = new Date(user.lastActiveAt);

            return {
                joined: joined.toLocaleDateString("en-GB").replace(/\//g, "/"), 
                active: active.toLocaleString("en-GB").replace(/\//g, "/"), 
            }
        }

        const switchUserStatus = async () => {
            const response = await axios.post(`/api/xapi/admin/users/${user._id}`, {
                status: user.status === "active" ? "suspended" : "active"
            }, 
            {
                withCredentials: true,
            });
        
            const updatedUser = response.data;
            const newUsers = [...users];

            if (filters.status && updatedUser.status !== filters.status) {
                newUsers.splice(index, 1);
            }
            else {
                newUsers[index] = updatedUser;
            }
            
            setUsers(newUsers);
        }

        const changeUserRole = async () => {
            const response = await axios.post(`/api/xapi/admin/users/${user._id}`, {
                role: targetRoleRef.current,
            }, 
            {
                withCredentials: true,
            });
        
            const updatedUser = response.data;
            const newUsers = [...users];

            if (filters.role && updatedUser.role !== filters.role) {
                newUsers.splice(index, 1);
            }
            else {
                newUsers[index] = updatedUser;
            }
            
            setUsers(newUsers);
        }

        const disableRename = 
            session.user?.role === "user" ||
            (session.user?.role === "admin" && (user.role === "owner" || (user.role === "admin" && session.user?.id !== user._id))) ||
            (session.user?.role === "owner" && user.role === "owner" && session.user?.id !== user._id);

        const disableElement = 
            session.user?.role === "user" ||
            (session.user?.role === "admin" && (user.role === "owner" || user.role === "admin")) ||
            (session.user?.role === "owner" && user.role === "owner");

        const RoleButtonElement = ({role}) => {
            return (
                <Button color="blue" className="rounded px-2" onClick={() => {
                    targetRoleRef.current = role;
                    setWaitingRole(true);
                }} disabled={disableElement}>
                    {role}
                </Button>
            )
        }
        
        const dates = getUserDate();

        return (
            <div className="relative flex flex-col border-b border-foreground/30 gap-4 p-2">
                <div className="flex-1 flex flex-col 2xl:flex-row 2xl:items-center 2xl:gap-4">
                    <div className="flex-1 flex gap-1 min-w-0">
                        <span className="2xl:hidden opacity-60 font-medium">USERNAME: </span>
                        <span className="2xl:flex-1 px-1 bg-background-1 overflow-hidden text-ellipsis whitespace-nowrap">{user.name}</span>
                        <Button color="blue" className="rounded-xs px-1 gap-0.5" 
                        disabled={disableRename} 
                        onClick={() => {
                            entityToRename.current = user;
                            setShowRename(true);
                        }}>
                            <FaEdit />
                        </Button>
                    </div>
                    <div className="group relative w-fit 2xl:flex-1 2xl:min-w-0 my-2 2xl:m-0">
                        <p className="2xl:flex-1 truncate border-b border-dotted cursor-pointer"
                            onClick={() => {
                                navigator.clipboard.writeText(user.email);
                                alert("Copied email: " + user.email);
                            }}>
                            <span className="2xl:hidden opacity-60 font-medium">EMAIL: </span>{user.email}
                        </p>
                        <p className="absolute left-4/5 top-1/2 invisible group-hover:visible bg-background-2 rounded px-2">{user.email}</p>
                    </div>
                    <p className="flex-1"><span className="2xl:hidden opacity-60 font-medium">JOINED: </span>{dates.joined}</p>
                    <p className="flex-1"><span className="2xl:hidden opacity-60 font-medium">LAST ACTIVITY: </span>{dates.active}</p>
                    <div className="flex-1 flex mt-4 2xl:m-0 uppercase gap-2">
                        <div className="flex gap-1">
                            <span className="2xl:hidden opacity-60 font-medium">ROLE: </span>{user.role}
                        </div>
                        {session.user?.role === "owner" &&
                        <div className="flex items-center gap-1 font-medium">
                            <RoleButtonElement role="user" />
                            <RoleButtonElement role="admin" />
                        </div>
                        }
                    </div>
                    <div className="flex-1 flex 2xl:items-center uppercase font-medium mt-4 2xl:m-0 gap-2">
                        <div className="flex gap-1">
                            <span className="2xl:hidden opacity-60 font-medium">STATUS: </span>
                            <span className={`${user.status === "active" ? "text-emerald-400" : "text-red-400"}`}>{user.status}</span>
                        </div>
                        <Button color={`${user.status === "active" ? "orange" : "lime"}`} className="2xl:flex-1 self-start 2xl:self-center font-medium rounded px-2 2xl:p-0" 
                        onClick={() => setWaitingStatus(true)} disabled={disableElement}>
                            {user.status === "active" ? "suspend" : "unsuspend"}
                        </Button>
                    </div>
                    {(waitingStatus || waitingRole) && 
                        <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center bg-[#000c]">
                            <FaSpinner className="animate-spin" />
                        </div>
                    }
                </div>
                {!disableElement &&
                    <button className="flex items-center gap-1 px-4 font-medium py-1 rounded border-red-400 text-red-400
                    hover:text-red-300 hover:border-red-300 active:text-red-500 active:border-red-500 cursor-pointer text-sm w-fit border-2"
                    disabled={disableElement} onClick={() => {
                        entityToDelete.current = user;
                        setShowConfirmDelete(true)
                    }}>
                        <FaTrash /> DELETE
                    </button>
                }
            </div>
        )
    }

    if (users.length <= 0)
        return (
            <p className="opacity-60 italic font-light uppercase">No users found</p>
        )

    let subList = [];

    const startIndex = pageNumber * PER_PAGE;
    const endIndex = startIndex + PER_PAGE;

    subList = users.slice(startIndex, endIndex);

    return (
        <div className="w-full flex flex-1 flex-col text-lg">
            <div className="flex-1 flex flex-col">
                <div className="hidden 2xl:flex font-semibold gap-4 mb-1 uppercase opacity-70 px-2">
                    <p className="flex-1">userName</p>
                    <p className="flex-1">email</p>
                    <p className="flex-1">joined</p>
                    <p className="flex-1">last activity</p>
                    <p className="flex-1">role</p>
                    <p className="flex-1">status</p>
                </div>
                <div className="border border-b-0 border-foreground/30 font-light">
                    {
                        subList.map((user, index) =>{
                            return (
                                <UserElement key={user._id} user={user} index={index} />
                            )
                        })
                    }
                </div>
            </div>
            <Pagination quantity={content.length} pageNumber={pageNumber} perPage={PER_PAGE} setPageNumber={setPageNumber} />
        </div>
    )
}