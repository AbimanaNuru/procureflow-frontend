import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useUser, useUserPermissions } from "@/hooks/use-user";
import { ArrowLeft, Loader2, Shield } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserPermissions = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { data: user, isLoading: isLoadingUser } = useUser(id || "");
    const { data: permissionsResponse, isLoading: isLoadingPermissions, isError, error } = useUserPermissions(id || "");

    // Extract permissions array from response
    const permissions = (permissionsResponse as any)?.permissions || [];

    // Group permissions by category (app name)
    const groupedPermissions = useMemo(() => {
        if (!permissions || permissions.length === 0) return {};
        
        const groups: Record<string, string[]> = {};
        permissions.forEach((perm: string) => {
            const [app, ...rest] = perm.split('.');
            const permName = rest.join('.');
            if (!groups[app]) {
                groups[app] = [];
            }
            groups[app].push(permName);
        });
        return groups;
    }, [permissions]);

    const isLoading = isLoadingUser || isLoadingPermissions;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground text-lg">Loading permissions...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive text-lg mb-4">
                        Error loading permissions: {error?.message}
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
                    onClick={() => navigate(`/users/${id}`)}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to User Details
                </Button>

                <div className="space-y-6">
                    {/* Header */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-3xl flex items-center gap-2">
                                        <Shield className="h-8 w-8" />
                                        User Permissions
                                    </CardTitle>
                                    <CardDescription className="text-base mt-2">
                                        {user?.first_name} {user?.last_name} (@{user?.username})
                                    </CardDescription>
                                </div>
                                <Badge variant="outline" className="text-sm">
                                    {permissions.length || 0} Permissions
                                </Badge>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Groups */}
                    {user?.groups && user.groups.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>User Groups</CardTitle>
                                <CardDescription>
                                    Permissions are inherited from these groups
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {user.groups.map((group) => (
                                        <Badge key={group.id} variant="secondary" className="text-sm">
                                            {group.name}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Permissions by Category */}
                    {Object.keys(groupedPermissions).length > 0 ? (
                        Object.entries(groupedPermissions).map(([app, perms]) => (
                            <Card key={app}>
                                <CardHeader>
                                    <CardTitle className="capitalize">{app} Permissions</CardTitle>
                                    <CardDescription>
                                        {perms.length} permission(s)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Permission</TableHead>
                                                <TableHead>Codename</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {perms.map((perm, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell className="font-medium">
                                                        {perm.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm text-muted-foreground">
                                                        {app}.{perm}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">
                                    No permissions assigned to this user
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserPermissions;
