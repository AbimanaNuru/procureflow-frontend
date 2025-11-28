import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/use-user";
import { ArrowLeft, Building, Calendar, IdCard, Loader2, Mail, Phone, Shield } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const UserDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { data: user, isLoading, isError, error } = useUser(id || "");

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground text-lg">Loading user details...</p>
                </div>
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive text-lg mb-4">
                        Error loading user: {error?.message || "User not found"}
                    </p>
                    <Button onClick={() => navigate("/users")}>
                        Back to Users
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-6 py-8 max-w-6xl">
                <Button
                    variant="ghost"
                    className="mb-6"
                    onClick={() => navigate("/users")}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Users
                </Button>

                <div className="space-y-6">
                    {/* User Header */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-3xl">
                                        {user.first_name} {user.last_name}
                                    </CardTitle>
                                    <CardDescription className="text-base mt-1">
                                        @{user.username}
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant={user.is_active ? "default" : "secondary"}>
                                        {user.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                    {user.is_staff && (
                                        <Badge variant="outline">Staff</Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Phone</p>
                                            <p className="font-medium">{user.phone}</p>
                                        </div>
                                    </div>
                                )}
                                {user.department && (
                                    <div className="flex items-center gap-3">
                                        <Building className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Department</p>
                                            <p className="font-medium">{user.department}</p>
                                        </div>
                                    </div>
                                )}
                                {user.employee_id && (
                                    <div className="flex items-center gap-3">
                                        <IdCard className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Employee ID</p>
                                            <p className="font-medium">{user.employee_id}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Joined</p>
                                    <p className="font-medium">
                                        {new Date(user.date_joined).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Groups */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Groups & Roles</CardTitle>
                            <CardDescription>
                                User group memberships
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {user.groups && user.groups.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {user.groups.map((group) => (
                                        <Badge key={group.id} variant="secondary" className="text-sm">
                                            {group.name}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No groups assigned</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => navigate(`/users/${user.id}/permissions`)}
                            >
                                <Shield className="h-4 w-4 mr-2" />
                                View Permissions
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default UserDetail;
