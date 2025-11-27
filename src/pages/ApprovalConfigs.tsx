import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useApprovalConfigs, useCreateApprovalConfig } from "@/hooks/use-approval";
import { CreateApprovalConfigRequest } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const createConfigSchema = z.object({
    min_amount: z.string().min(1, "Minimum amount is required"),
    max_amount: z.string().min(1, "Maximum amount is required"),
    levels: z.array(z.object({
        level: z.coerce.number().min(1, "Level must be at least 1"),
        group: z.coerce.number().min(0, "Group ID is required"),
    })).min(1, "At least one approval level is required"),
});

const ApprovalConfigs = () => {
    const [page, setPage] = useState(1);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { data, isLoading } = useApprovalConfigs(page);
    const createMutation = useCreateApprovalConfig();

    const form = useForm<CreateApprovalConfigRequest>({
        resolver: zodResolver(createConfigSchema),
        defaultValues: {
            min_amount: "",
            max_amount: "",
            levels: [{ level: 1, group: 0 }],
        },
    });

    const onSubmit = (data: CreateApprovalConfigRequest) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                setIsCreateOpen(false);
                form.reset();
            },
        });
    };

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Approval Configurations</h2>
                    <p className="text-muted-foreground">
                        Manage approval rules and thresholds
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Configuration
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create Approval Configuration</DialogTitle>
                            <DialogDescription>
                                Set up new approval rules based on amount ranges.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="min_amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Min Amount</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="0.00" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="max_amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Max Amount</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="0.00" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium">Approval Levels</h4>
                                    {form.watch("levels").map((_, index) => (
                                        <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                                            <FormField
                                                control={form.control}
                                                name={`levels.${index}.level`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Level</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`levels.${index}.group`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Group ID</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full"
                                    disabled={createMutation.isPending}
                                >
                                    {createMutation.isPending ? "Creating..." : "Create Configuration"}
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Configurations List</CardTitle>
                    <CardDescription>
                        View and manage existing approval configurations
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Min Amount</TableHead>
                                <TableHead>Max Amount</TableHead>
                                <TableHead>Levels</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : data?.results.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10">
                                        No configurations found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.results.map((config) => (
                                    <TableRow key={config.id}>
                                        <TableCell>{Number(config.min_amount).toLocaleString()}</TableCell>
                                        <TableCell>{Number(config.max_amount).toLocaleString()}</TableCell>
                                        <TableCell>{config.levels.length} Levels</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                config.is_active 
                                                    ? "bg-green-100 text-green-800" 
                                                    : "bg-gray-100 text-gray-800"
                                            }`}>
                                                {config.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(config.created_at).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ApprovalConfigs;
