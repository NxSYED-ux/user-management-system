"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import {
    Users,
    UserPlus,
    Eye,
    Edit2,
    Trash2,
    Mail,
    Crown,
    User, Edit3,
} from 'lucide-react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { user, paginationDef, roles } from "@/types/user";
import { Pagination } from "./Pagination";

interface Stats {
    ADMIN: number;
    EDITOR: number;
    VIEWER: number;
}

interface ApiResponse {
    pagination: paginationDef;
    data: user[];
    stats: Stats;
}

export function UserManagement() {
    const router = useRouter();
    const [users, setUsers] = useState<user[]>([]);
    const [roleStats, setRoleStats] = useState<Stats>({ ADMIN: 0, EDITOR: 0, VIEWER: 0 });
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Pagination
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);

    // Search States
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Delete confirmation modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<user | null>(null);

    // Debounce searchTerm
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get<ApiResponse>("/api/users", {
                params: {
                    page,
                    limit,
                    search: debouncedSearch,
                },
            });
            const data = res.data;
            setUsers(data.data || []);
            setTotalPages(data.pagination?.totalPages || 1);
            setTotalUsers(data.pagination?.total || 0);
            setRoleStats(data.stats || { ADMIN: 0, EDITOR: 0, VIEWER: 0 });
        } catch {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, debouncedSearch]);

    const RoleBadge = ({ role }: { role: roles }) => {
        const roleConfig = {
            ADMIN: {
                icon: Crown,
                color: 'badge-primary',
                bgColor: 'bg-primary/10',
                textColor: 'text-primary'
            },
            EDITOR: {
                icon: Edit2,
                color: 'badge-warning',
                bgColor: 'bg-warning/10',
                textColor: 'text-warning'
            },
            VIEWER: {
                icon: Eye,
                color: 'badge-info',
                bgColor: 'bg-info/10',
                textColor: 'text-info'
            }
        };

        const config = roleConfig[role];
        const IconComponent = config.icon;

        return (
            <div className={`badge ${config.color} gap-1 ${config.bgColor} ${config.textColor} border-none`}>
                <IconComponent className="w-3 h-3" />
                {role}
            </div>
        );
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        setPage(1);
    };

    const handleAddUser = () => {
        router.push("/users/new");
    };

    const handleEditUser = (userId: string) => {
        router.push(`/users/${userId}/edit`);
    };

    const handleDeleteClick = (user: user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;

        try {
            setDeletingId(userToDelete.id);
            await axios.delete(`/api/users/${userToDelete.id}`);

            toast.success(`User ${userToDelete.name} deleted successfully`);
            fetchUsers();
        } catch (error) {
            toast.error("Failed to delete user");
            console.error("Delete error:", error);
        } finally {
            setDeletingId(null);
            setShowDeleteModal(false);
            setUserToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    return (
        <div className="min-h-screen bg-base-200 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-base-content mb-2">
                        Users Management
                    </h1>
                    <p className="text-base-content/60">
                        Manage users — view, add, edit, or delete accounts and assign roles easily.
                    </p>

                    {/* Role Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="stat bg-base-100 rounded-lg shadow">
                            <div className="stat-figure text-primary">
                                <Crown className="w-8 h-8" />
                            </div>
                            <div className="stat-title">Admins</div>
                            <div className="stat-value text-primary">{roleStats.ADMIN}</div>
                            <div className="stat-desc">Full system access</div>
                        </div>

                        <div className="stat bg-base-100 rounded-lg shadow">
                            <div className="stat-figure text-warning">
                                <Edit2 className="w-8 h-8" />
                            </div>
                            <div className="stat-title">Editors</div>
                            <div className="stat-value text-warning">{roleStats.EDITOR}</div>
                            <div className="stat-desc">Can create & edit content</div>
                        </div>

                        <div className="stat bg-base-100 rounded-lg shadow">
                            <div className="stat-figure text-info">
                                <Eye className="w-8 h-8" />
                            </div>
                            <div className="stat-title">Viewers</div>
                            <div className="stat-value text-info">{roleStats.VIEWER}</div>
                            <div className="stat-desc">Read-only access</div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h2 className="card-title text-2xl">Users List</h2>
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full sm:w-auto">
                                {/* Search Input */}
                                <div className="join w-full sm:w-64">
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        className="input input-bordered join-item w-full"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <button
                                    className="btn btn-primary gap-2 w-full sm:w-auto"
                                    onClick={handleAddUser}
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Add New User
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <span className="loading loading-spinner loading-lg"></span>
                                <p className="mt-4 text-base-content/60">Loading users...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-base-content/40 mb-4">
                                    <Users className="w-16 h-16 mx-auto" />
                                </div>
                                <h3 className="text-lg font-semibold text-base-content mb-2">
                                    {debouncedSearch ? 'No Users Found' : 'No Users Found'}
                                </h3>
                                <p className="text-base-content/60 mb-4">
                                    {debouncedSearch ? 'Try adjusting your search terms' : 'Get started by adding your first user.'}
                                </p>
                                <div className="flex justify-center gap-2">
                                    {debouncedSearch && (
                                        <button
                                            className="btn btn-ghost gap-2"
                                            onClick={handleClearSearch}
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-primary gap-2"
                                        onClick={handleAddUser}
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Add User
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                        <tr>
                                            <th className="bg-base-200">ID</th>
                                            <th className="bg-base-200">Name</th>
                                            <th className="bg-base-200">Email</th>
                                            <th className="bg-base-200">Role</th>
                                            <th className="bg-base-200 text-right">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover">
                                                <td className="font-mono text-sm">{user.id}</td>
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="bg-primary/10 p-2 rounded-full">
                                                                <User className="h-4 w-4 text-primary" />
                                                            </div>
                                                            <div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {user.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4 text-base-content/60" />
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td>
                                                    <RoleBadge role={user.role} />
                                                </td>
                                                <td>
                                                    <div className="flex gap-2 justify-end">
                                                        {/* Edit Button */}
                                                        <button
                                                            className="btn btn-outline btn-sm"
                                                            title="Edit User"
                                                            onClick={() => handleEditUser(user.id)}
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                            Edit
                                                        </button>

                                                        {/* Delete Button */}
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            title="Delete User"
                                                            onClick={() => handleDeleteClick(user)}
                                                            disabled={deletingId === user.id}
                                                        >
                                                            {deletingId === user.id ? (
                                                                <span className="loading loading-spinner loading-sm"></span>
                                                            ) : (
                                                                <Trash2 className="w-4 h-4" />
                                                            )}
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <Pagination
                                    page={page}
                                    setPage={setPage}
                                    totalPages={totalPages}
                                    total={totalUsers}
                                    limit={limit}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && userToDelete && (
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Confirm Delete</h3>
                            <p className="py-4">
                                Are you sure you want to delete user <strong>{userToDelete.name}</strong> ({userToDelete.email})?
                                This action cannot be undone.
                            </p>
                            <div className="modal-action">
                                <button
                                    className="btn btn-outline"
                                    onClick={handleDeleteCancel}
                                    disabled={deletingId === userToDelete.id}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary gap-2"
                                    onClick={handleDeleteConfirm}
                                    disabled={deletingId === userToDelete.id}
                                >
                                    {deletingId === userToDelete.id ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}