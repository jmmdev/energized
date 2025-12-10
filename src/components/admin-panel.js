"use client";

import { useEffect, useRef, useState } from "react";
import AdminPanelTab from "./admin-panel-tab";
import AdminPanelDropdown from "./admin-panel-dropdown";
import ThemeToggleMini from "./theme-toggle-mini";
import Logo from "./logo";
import AdminOverview from "./admin__overview";
import AdminUsers from "./admin__users";
import AdminDecks from "./admin__decks";
import AdminCards from "./admin__cards";
import AdminFilters from "./admin-filters";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import Button from "./button";

export default function AdminPanel({user}) {
    const TABS = ["overview", "users", "decks", "cards"];

    const [tab, setTab] = useState("overview");
    const [content, setContent] = useState(null);
    const [filters, setFilters] = useState({});

    const contentScrollerRef = useRef();

    useEffect(() => {
        const getContent = async () => {
            const response = await axios.get(`/api/xapi/admin/${tab}`);
            setContent(response.data);
        }

        if (content !== null)
            setContent(null);
        
        if (Object.keys(filters).length > 0)
            setFilters({});
        
        getContent();
    }, [tab])

    
    useEffect(() => {
        const filterContent = async () => {
            const response = await axios.get(`/api/xapi/admin/${tab}${Object.keys(filters).length > 0 ? "?" + getFilters() : ""}`);
            setContent(response.data);
        }

        if (filters)
            filterContent();
    }, [filters])

    const getFilters = () => {
        let output = "";

        for (const [key, value] of Object.entries(filters)) {
            output += `${key}=${value}&`
        }

        return output.slice(0, -1);
    }

    const GetTabs = () => {
        return (
            <>
                <nav className="hidden w-full flex-1 lg:max-w-[400px] text-lg lg:flex flex-col gap-[1px] border-r border-background-2 bg-background-2">
                    {
                        TABS.map(t =>
                            <div className="flex flex-col" key={t}>
                                <AdminPanelTab tab={tab} setContent={setContent} setTab={setTab} name={t} />
                            </div>
                        )
                    }
                    <div className="hidden lg:block flex-1 bg-background" />
                </nav>

                <nav className="lg:hidden w-full text-lg">
                    <div className="flex flex-col">
                        <AdminPanelDropdown tabs={TABS} activeTab={tab} setContent={setContent} setActiveTab={setTab} />
                    </div>
                </nav>
            </>
        )
    }

    const AdminCreate = () => {
        const [name, setName] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        
        const createEntity = async () => {
            let body; 
            
            if (tab === "users")
                body = {
                    name, email, password
                }

            if (tab === "decks")
                body = {
                    name
                }

            const response = await axios.post(`/api/xapi/admin/${tab}`, body,
            {
                withCredentials: true,
            });

            const createdEntity = response.data;

            const newContent = [...content];

            newContent.unshift(createdEntity);

            setContent(newContent);
        }

        return (
            <div className="flex flex-col gap-2 mb-8 2xl:gap-4">
                <h2 className="uppercase opacity-60">create a new {tab.slice(0, -1)}</h2>
                <div className="flex flex-col gap-2 2xl:gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1">
                            <span className="opacity-60">{tab === "users" ? "Username" : "Name"}:</span>
                            <input className="bg-background-1" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    {tab === "users" &&
                        <>
                            <div className="flex items-center gap-1">
                                <span className="opacity-60">Email:</span>
                                <input className="bg-background-1" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="opacity-60">Password:</span>
                                <input type="password" className="bg-background-1" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </>
                    }
                    <Button color="blue" className="rounded px-2" onClick={() => createEntity()} disabled={
                        name.trim().length <= 0 || (tab === "users" && (email.trim().length <= 0 || password.trim().length <= 0))
                    }>
                        create
                    </Button>
                    </div>
                </div>
            </div>
        )
    }

    const GetContent = ({entityToDelete, setShowConfirmDelete, entityToRename, setShowRename}) => {
        switch (tab) {
            case "overview":
                return <AdminOverview content={content} />
            case "users":
                return <AdminUsers contentScrollerRef={contentScrollerRef} content={content} 
                entityToDelete={entityToDelete} setShowConfirmDelete= {setShowConfirmDelete}
                entityToRename={entityToRename} setShowRename= {setShowRename} filters={filters} />
            case "decks":
                return <AdminDecks contentScrollerRef={contentScrollerRef} content={content}
                entityToDelete={entityToDelete} setShowConfirmDelete= {setShowConfirmDelete}
                entityToRename={entityToRename} setShowRename= {setShowRename} filters={filters} />
            case "cards":
                return <AdminCards contentScrollerRef={contentScrollerRef} content={content}
                entityToDelete={entityToDelete} setShowConfirmDelete= {setShowConfirmDelete} />
            default:
                return null;
        }
    }

    const AdminContent = () => {
        const [newName, setNewName] = useState("");
        const [showRename, setShowRename] = useState(false);
        const [showConfirmDelete, setShowConfirmDelete] = useState(false);
        const [deleteText, setDeleteText] = useState("");

        const entityToRename = useRef();
        const entityToDelete = useRef();

        useEffect(() => {
            if (showRename)
                setNewName(entityToRename.current.name);
        }, [showRename]) 

        const renameEntity = async () => {
            const response = await axios.post(`/api/xapi/admin/${tab}/${entityToRename.current._id}`, {
                name: newName.trim(),
            }, 
            {
                withCredentials: true,
            });
        
            const updatedEntity = response.data;
            let found = false;

            const newContent = [...content];

            for (let i=0; i<newContent.length && !found; i++) {
                if (newContent[i]._id === updatedEntity._id) {
                    found = true;
                    if (filters.name) 
                        if (updatedEntity.name.toLowerCase().includes(filters.name.toLowerCase()))
                            newContent[i] = updatedEntity;
                        else
                            newContent.splice(i, 1);
                    else
                        newContent[i] = updatedEntity;
                }
            }

            setContent(newContent);
        }

        const deleteEntity = async () => {
            if (entityToDelete.current) {
                const response = await axios.delete(`/api/xapi/admin/${tab}/${entityToDelete.current._id}`,
                {
                    withCredentials: true,
                });

                const removedEntity = response.data;
                let found = false;

                const newContent = [...content];

                for (let i=0; i<newContent.length && !found; i++) {
                    if (newContent[i]._id === removedEntity._id) {
                        found = true;
                        newContent.splice(i, 1);
                    }
                }

                setContent(newContent);
            }
        }

        const loading = content === null;

        return (
            <section className="flex flex-col min-h-full bg-background">
                {loading
                ?
                    <div className="flex-1 flex flex-col gap-2 text-2xl justify-center items-center">
                        <FaSpinner className="animate-spin" />
                        Retrieving {tab} data...
                    </div>
                :
                    <>
                        <div className="flex flex-col flex-1 gap-16 p-4 sm:p-8">
                            <div className="flex flex-col flex-1 gap-4 lg:gap-8 max-w-[1500px]">
                                <h1 className="font-bold text-3xl lg:text-4xl uppercase">{tab}</h1>
                                {(tab === "users" || tab === "decks") && 
                                    <div className="flex flex-col gap-4 ">
                                        <AdminCreate tab={tab} />
                                        <h2 className="font-light italic 2xl:mt-4">{content.length} result{content.length === 1 ? "" : "s"}</h2>
                                        <AdminFilters tab={tab} filters={filters} setFilters={setFilters} />
                                    </div>
                                }
                                <GetContent entityToDelete={entityToDelete} setShowConfirmDelete={setShowConfirmDelete} 
                                entityToRename={entityToRename} setShowRename={setShowRename}/>
                            </div>
                        </div>
                        {
                        showRename &&
                        <div className="absolute top-0 left-0 z-30 w-screen h-screen bg-[#000c] flex justify-center items-center">
                            <div className="w-full max-w-[600px] flex flex-col gap-4 p-8 bg-background-1 rounded-lg">
                                <h2 className="text-lg">Renaming <span className="font-bold capitalize">{tab} → {entityToRename.current.name}</span> to:</h2>
                                <input className="w-full bg-background-2" autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} />
                                <div className="w-full flex justify-center items-center gap-8 font-medium">
                                    <Button color="gray" className="px-4 py-1 rounded" onClick={() => setShowRename(false)}>
                                        Cancel
                                    </Button>
                                    <Button color="blue" className="px-4 py-1 rounded" onClick={renameEntity} 
                                    disabled={newName === entityToRename.current.name}>
                                        Confirm
                                    </Button>
                                </div>
                            </div>
                        </div>
                        }
                        {
                        showConfirmDelete &&
                        <div className="absolute top-0 left-0 z-30 p-8 w-screen h-screen bg-[#000c] flex justify-center items-center">
                            <div className="w-full max-w-[600px] flex flex-col gap-4 p-8 bg-background-1 rounded-lg">
                                <p className="text-lg">Delete <span className="font-bold">{entityToDelete.current.name}</span> from {tab}?
                                Type <span className="font-bold">delete</span> to confirm</p>
                                <input className="w-full bg-background-2" autoFocus value={deleteText} onChange={(e) => setDeleteText(e.target.value.trim())} />
                                <p className="uppercase text-sm font-semibold text-yellow-500">warning: this action cannot be undone</p>
                                <div className="w-full flex justify-center items-center gap-8 font-medium">
                                    <Button color="gray" className="px-4 py-1 rounded" onClick={() => setShowConfirmDelete(false)}>
                                        Cancel
                                    </Button>
                                    <Button color="red" className="px-4 py-1 rounded" onClick={deleteEntity} 
                                    disabled={deleteText.toLowerCase() !== "delete"}>
                                        Confirm
                                    </Button>
                                </div>
                            </div>
                        </div>
                        }
                    </>
                }    
            </section>
        )
    }

    return (
        <>
            <main className="flex-1 w-full flex flex-col overflow-hidden"> 
                <header className=" flex h-12 h-12 justify-between px-4 font-light">
                    <div className="flex h-full items-center gap-4">
                        <Logo isInHeader />
                        <p className="hidden sm:block w-fit opacity-60 uppercase">admin panel</p>
                    </div>
                    <div className="flex-1" />
                    <div className="flex items-center gap-8">
                        <p className="hidden max-w-64 md:block truncate opacity-60">Welcome, <span className="uppercase">{user}</span></p>
                        <ThemeToggleMini />
                    </div>
                </header>
                <section className="w-full self-center flex-1 flex flex-col lg:flex-row border-t border-background-2 overflow-y-hidden">
                    <GetTabs />
                    <div ref={contentScrollerRef} className="flex-1 lg:h-full flex flex-col overflow-y-auto builder-scrollbar">
                        <AdminContent />
                    </div>
                </section>
            </main>
        </>
    )
}