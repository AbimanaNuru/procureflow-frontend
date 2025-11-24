import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/Header";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, FileText, Calendar, User, DollarSign, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { approveRejectSchema, receiptSchema, type ApproveRejectInput, type ReceiptInput } from "@/lib/validations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const RequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [receiptFileName, setReceiptFileName] = useState<string>("");

  const approveForm = useForm<ApproveRejectInput>({
    resolver: zodResolver(approveRejectSchema),
    defaultValues: { comment: "" },
  });

  const rejectForm = useForm<ApproveRejectInput>({
    resolver: zodResolver(approveRejectSchema),
    defaultValues: { comment: "" },
  });

  const receiptForm = useForm<ReceiptInput>({
    resolver: zodResolver(receiptSchema),
  });

  // Mock data
  const request = {
    id: id || "PR-001",
    title: "Office Supplies - Q1",
    description: "Stationery, paper, and general office supplies for Q1 2024. This includes pens, notebooks, printer paper, folders, and other essential office materials needed for the upcoming quarter.",
    amount: "$2,500",
    status: "pending" as "pending" | "approved" | "rejected",
    createdBy: "John Doe",
    createdAt: "2024-01-15",
    proforma: "proforma_invoice_001.pdf",
  };

  const approvalHistory = [
    {
      level: "Level 1",
      approver: "Manager - Sarah Johnson",
      status: "approved",
      date: "2024-01-16",
      comment: "Approved. Budget allocation confirmed.",
    },
    {
      level: "Level 2",
      approver: "Senior Manager - Michael Chen",
      status: "pending",
      date: "-",
      comment: "-",
    },
  ];

  const onApprove = (data: ApproveRejectInput) => {
    // Simulate API call
    setTimeout(() => {
      setShowApproveDialog(false);
      approveForm.reset();
      toast({
        title: "Request Approved",
        description: "The purchase request has been approved",
      });
      navigate("/requests");
    }, 1000);
  };

  const onReject = (data: ApproveRejectInput) => {
    // Simulate API call
    setTimeout(() => {
      setShowRejectDialog(false);
      rejectForm.reset();
      toast({
        title: "Request Rejected",
        description: "The purchase request has been rejected",
        variant: "destructive",
      });
      navigate("/requests");
    }, 1000);
  };

  const onReceiptSubmit = (data: ReceiptInput) => {
    // Simulate API call
    toast({
      title: "Receipt Uploaded",
      description: "Receipt has been submitted for validation",
    });
    receiptForm.reset();
    setReceiptFileName("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userName="John Doe" role="Staff" onLogout={() => navigate("/login")} />

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/requests")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Requests
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-muted-foreground">{request.id}</span>
                      <StatusBadge status={request.status} />
                    </div>
                    <CardTitle className="text-2xl">{request.title}</CardTitle>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Amount</p>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-primary">{request.amount.replace('$', '')}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{request.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Created By</p>
                      <p className="font-medium">{request.createdBy}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Created On</p>
                      <p className="font-medium">{request.createdAt}</p>
                    </div>
                  </div>
                </div>

                {request.proforma && (
                  <div className="border border-border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">Proforma Invoice</p>
                        <p className="text-sm text-muted-foreground">{request.proforma}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {request.status === "approved" && (
              <Card>
                <CardHeader>
                  <CardTitle>Submit Receipt</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...receiptForm}>
                    <form onSubmit={receiptForm.handleSubmit(onReceiptSubmit)} className="space-y-4">
                      <FormField
                        control={receiptForm.control}
                        name="receipt"
                        render={({ field: { onChange, value, ...field } }) => (
                          <FormItem>
                            <FormLabel>Upload Receipt</FormLabel>
                            <FormControl>
                              <label
                                htmlFor="receipt"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 border-border transition-colors"
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground">
                                    {receiptFileName || "Click to upload receipt"}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    PDF, JPG, or PNG (max 5MB)
                                  </p>
                                </div>
                                <Input
                                  id="receipt"
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      onChange(file);
                                      setReceiptFileName(file.name);
                                    }
                                  }}
                                  {...field}
                                />
                              </label>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={receiptForm.formState.isSubmitting} className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        {receiptForm.formState.isSubmitting ? "Submitting..." : "Submit Receipt"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Approval Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvalHistory.map((approval, index) => (
                    <div key={index} className="relative pl-6 pb-4 last:pb-0">
                      <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-border bg-background">
                        <div
                          className={`absolute inset-0.5 rounded-full ${
                            approval.status === "approved"
                              ? "bg-success"
                              : approval.status === "rejected"
                              ? "bg-destructive"
                              : "bg-warning"
                          }`}
                        />
                      </div>
                      {index < approvalHistory.length - 1 && (
                        <div className="absolute left-1.5 top-5 bottom-0 w-0.5 bg-border" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{approval.level}</p>
                        <p className="text-sm text-muted-foreground">{approval.approver}</p>
                        <p className="text-xs text-muted-foreground mt-1">{approval.date}</p>
                        {approval.comment !== "-" && (
                          <p className="text-xs mt-2 p-2 bg-muted rounded">{approval.comment}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {request.status === "pending" && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        Approve Request
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Approve Request</DialogTitle>
                        <DialogDescription>
                          Add your approval comment
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...approveForm}>
                        <form onSubmit={approveForm.handleSubmit(onApprove)} className="space-y-4">
                          <FormField
                            control={approveForm.control}
                            name="comment"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Add your approval comment..."
                                    rows={3}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex gap-3 justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowApproveDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" disabled={approveForm.formState.isSubmitting}>
                              {approveForm.formState.isSubmitting ? "Processing..." : "Approve"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Reject Request
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Request</DialogTitle>
                        <DialogDescription>
                          Please provide a reason for rejection
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...rejectForm}>
                        <form onSubmit={rejectForm.handleSubmit(onReject)} className="space-y-4">
                          <FormField
                            control={rejectForm.control}
                            name="comment"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Reason</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Explain why this request is being rejected..."
                                    rows={3}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex gap-3 justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowRejectDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              variant="destructive"
                              disabled={rejectForm.formState.isSubmitting}
                            >
                              {rejectForm.formState.isSubmitting ? "Processing..." : "Reject"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequestDetail;
