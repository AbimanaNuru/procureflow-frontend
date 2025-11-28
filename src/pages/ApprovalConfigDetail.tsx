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
import { useApprovalConfig } from "@/hooks/use-approval";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ApprovalConfigDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { data: config, isLoading, isError, error } = useApprovalConfig(id || "");

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground text-lg">Loading configuration...</p>
                </div>
            </div>
        );
    }

    if (isError || !config) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive text-lg mb-4">
                        Error loading configuration: {error?.message || "Configuration not found"}
                    </p>
                    <Button onClick={() => navigate("/approval-configs")}>
                        Back to Configurations
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
                    onClick={() => navigate("/approval-configs")}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Configurations
                </Button>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-2xl">Approval Configuration</CardTitle>
                                    <CardDescription>
                                        Configuration ID: {config.id}
                                    </CardDescription>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    config.is_active 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-gray-100 text-gray-800"
                                }`}>
                                    {config.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                        Minimum Amount
                                    </h3>
                                    <p className="text-2xl font-bold">
                                        ${Number(config.min_amount).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                        Maximum Amount
                                    </h3>
                                    <p className="text-2xl font-bold">
                                        ${Number(config.max_amount).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                        Created At
                                    </h3>
                                    <p className="text-base">
                                        {new Date(config.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                        Updated At
                                    </h3>
                                    <p className="text-base">
                                        {new Date(config.updated_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Approval Levels</CardTitle>
                            <CardDescription>
                                {config.levels.length} approval level(s) configured
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Level</TableHead>
                                        <TableHead>Group ID</TableHead>
                                        <TableHead>Group Name</TableHead>
                                        <TableHead>Created At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {config.levels.map((level) => (
                                        <TableRow key={level.id}>
                                            <TableCell className="font-medium">
                                                Level {level.level}
                                            </TableCell>
                                            <TableCell>{level.group}</TableCell>
                                            <TableCell>
                                                {level.group_name || "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                {level.created_at 
                                                    ? new Date(level.created_at).toLocaleDateString()
                                                    : "N/A"
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default ApprovalConfigDetail;
