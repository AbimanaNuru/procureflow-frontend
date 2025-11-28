import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PERMISSIONS } from "@/config/permission-config";
import { useApproveRequest, useRejectRequest, useValidateReceipt } from "@/hooks/use-ai-request";
import { useCreateItem, useUpdateItem } from "@/hooks/use-item";
import { usePermission } from "@/hooks/use-permission";
import { useCreatePurchaseOrder } from "@/hooks/use-purchase-order";
import { useRequest } from "@/hooks/use-request";
import { useToast } from "@/hooks/use-toast";
import {
  approveRejectSchema,
  purchaseOrderSchema,
  receiptSchema,
  requestItemSchema,
  type ApproveRejectInput,
  type PurchaseOrderInput,
  type ReceiptInput,
  type RequestItemInput
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Calendar, DollarSign, Edit, FileCheck, FileText, Loader2, Plus, Sparkles, Upload, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const RequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [receiptFileName, setReceiptFileName] = useState<string>("");
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [showEditItemDialog, setShowEditItemDialog] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showPurchaseOrderDialog, setShowPurchaseOrderDialog] = useState(false);

  const canApprove = usePermission(PERMISSIONS.APPROVE_PURCHASE_REQUEST);
  const canReject = usePermission(PERMISSIONS.REJECT_PURCHASE_REQUEST);
  const canAddItem = usePermission(PERMISSIONS.ADD_REQUEST_ITEM);
  const canEditItem = usePermission(PERMISSIONS.CHANGE_REQUEST_ITEM);
  const canCreatePO = usePermission(PERMISSIONS.ADD_PURCHASE_ORDER);

  const { data: request, isLoading, isError, error } = useRequest(id || "");
  const createItemMutation = useCreateItem();
  const updateItemMutation = useUpdateItem();
  const createPurchaseOrderMutation = useCreatePurchaseOrder();
  const approveRequestMutation = useApproveRequest();
  const rejectRequestMutation = useRejectRequest();
  const validateReceiptMutation = useValidateReceipt();

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

  const addItemForm = useForm<RequestItemInput>({
    resolver: zodResolver(requestItemSchema),
    defaultValues: {
      name: "",
      description: "",
      quantity: 1,
      unit_price: "",
    },
  });

  const editItemForm = useForm<RequestItemInput>({
    resolver: zodResolver(requestItemSchema),
  });

  const purchaseOrderForm = useForm<PurchaseOrderInput>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      vendor: "",
      vendor_name: "",
      vendor_address: "",
      payment_terms: "",
      notes: "",
    },
  });

  const onApprove = async (data: ApproveRejectInput) => {
    if (!id) return;
    
    try {
      await approveRequestMutation.mutateAsync({
        id,
        data: { title: data.comment }
      });
      setShowApproveDialog(false);
      approveForm.reset();
      navigate("/requests");
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  const onReject = async (data: ApproveRejectInput) => {
    if (!id) return;
    
    try {
      await rejectRequestMutation.mutateAsync({
        id,
        data: { title: data.comment }
      });
      setShowRejectDialog(false);
      rejectForm.reset();
      navigate("/requests");
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  const onReceiptSubmit = async (data: ReceiptInput) => {
    if (!id || !request) return;

    try {
      await validateReceiptMutation.mutateAsync({
        id,
        data: {
          receipt: data.receipt,
          // Optional fields that might be needed for validation context
          title: request.title,
          amount: parseFloat(request.amount),
        }
      });
      receiptForm.reset();
      setReceiptFileName("");
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  const onAddItem = async (data: RequestItemInput) => {
    if (!request) return;
    
    try {
      await createItemMutation.mutateAsync({
        request: request.id,
        name: data.name || "",
        description: data.description || "",
        quantity: data.quantity || 1,
        unit_price: data.unit_price || "0",
      });
      setShowAddItemDialog(false);
      addItemForm.reset();
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  const onEditItem = async (data: RequestItemInput) => {
    if (!editingItemId || !request) return;
    
    try {
      await updateItemMutation.mutateAsync({
        id: editingItemId,
        data: {
          request: request.id,
          ...data,
        },
      });
      setShowEditItemDialog(false);
      setEditingItemId(null);
      editItemForm.reset();
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItemId(item.id);
    editItemForm.reset({
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
    });
    setShowEditItemDialog(true);
  };

  const onCreatePurchaseOrder = async (data: PurchaseOrderInput) => {
    if (!request) return;

    try {
      // Transform Request items to PurchaseOrder items
      const poItems = request.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit_price: parseFloat(item.unit_price),
        total: parseFloat(item.total_price)
      }));

      await createPurchaseOrderMutation.mutateAsync({
        vendor: data.vendor,
        vendor_name: data.vendor_name,
        vendor_address: data.vendor_address,
        payment_terms: data.payment_terms,
        items: poItems,
        extracted_items: [],
        total_amount: request.amount,
        file: "", // This would typically be generated or uploaded
        notes: data.notes || ""
      });
      setShowPurchaseOrderDialog(false);
      purchaseOrderForm.reset();
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-lg">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg mb-4">
            Error loading request: {error?.message || "Request not found"}
          </p>
          <Button onClick={() => navigate("/requests")}>Back to Requests</Button>
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
                      <span className="text-2xl font-bold text-primary">
                        {parseFloat(request.amount).toFixed(2)}
                      </span>
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
                      <p className="font-medium">
                        {request.created_by_detail.first_name} {request.created_by_detail.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Created On</p>
                      <p className="font-medium">{new Date(request.created_at).toLocaleDateString()}</p>
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
                    <Button variant="outline" size="sm" asChild>
                      <a href={request.proforma} target="_blank" rel="noopener noreferrer">
                        Download
                      </a>
                    </Button>
                  </div>
                )}

                {/* Purchase Order Section */}
                {request.purchase_order && (
                  <div className="border border-green-200 bg-green-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileCheck className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Purchase Order Generated</p>
                        <p className="text-sm text-green-700">
                          PO #{request.purchase_order.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
                      onClick={() => navigate(`/purchase-orders/${request.purchase_order?.id}`)}
                    >
                      View Purchase Order
                    </Button>
                  </div>
                )}

                {/* AI Analysis Section */}
                {(request.validation_result || request.proforma_data) && (
                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        AI Analysis Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {request.validation_result && (
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">Receipt Validation</h4>
                          <p className="text-sm text-blue-800 bg-blue-100/50 p-3 rounded-md border border-blue-200">
                            {request.validation_result}
                          </p>
                        </div>
                      )}
                      {request.proforma_data && (
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">Extracted Proforma Data</h4>
                          <pre className="text-xs text-blue-800 bg-blue-100/50 p-3 rounded-md border border-blue-200 overflow-auto max-h-40">
                            {typeof request.proforma_data === 'string' 
                              ? request.proforma_data 
                              : JSON.stringify(request.proforma_data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Items List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Items</h3>
                    {request.status === "pending" && canAddItem && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddItemDialog(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    )}
                  </div>
                  {request.items && request.items.length > 0 ? (
                    <div className="space-y-2">
                      {request.items.map((item) => (
                        <div key={item.id} className="border border-border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-medium">{item.name}</p>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-primary">${parseFloat(item.total_price).toFixed(2)}</p>
                              {request.status === "pending" && canEditItem && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditItem(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Qty: {item.quantity}</span>
                            <span>Unit Price: ${parseFloat(item.unit_price).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No items added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {request.status === "approved" && request.purchase_order && (
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
                      <Button type="submit" disabled={receiptForm.formState.isSubmitting || validateReceiptMutation.isPending} className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        {receiptForm.formState.isSubmitting || validateReceiptMutation.isPending ? "Submitting..." : "Submit Receipt"}
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
                  {request.approval_levels.map((approval, index) => (
                    <div key={approval.id} className="relative pl-6 pb-4 last:pb-0">
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
                      {index < request.approval_levels.length - 1 && (
                        <div className="absolute left-1.5 top-5 bottom-0 w-0.5 bg-border" />
                      )}
                      <div>
                        <p className="font-medium text-sm">Level {approval.level}</p>
                        <p className="text-sm text-muted-foreground">{approval.group_name}</p>
                        {approval.approver_name && (
                          <p className="text-sm text-muted-foreground">{approval.approver_name}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {approval.timestamp ? new Date(approval.timestamp).toLocaleDateString() : "Pending"}
                        </p>
                        {approval.comments && (
                          <p className="text-xs mt-2 p-2 bg-muted rounded">{approval.comments}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {request.status === "pending" && (canApprove || canReject) && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {canApprove && (
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
                              <Button type="submit" disabled={approveForm.formState.isSubmitting || approveRequestMutation.isPending}>
                                {approveForm.formState.isSubmitting || approveRequestMutation.isPending ? "Processing..." : "Approve"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  )}

                  {canReject && (
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
                                disabled={rejectForm.formState.isSubmitting || rejectRequestMutation.isPending}
                              >
                                {rejectForm.formState.isSubmitting || rejectRequestMutation.isPending ? "Processing..." : "Reject"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            )}

            {request.status === "approved" && !request.purchase_order && canCreatePO && (
              <Card>
                <CardHeader>
                  <CardTitle>Purchase Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <Dialog open={showPurchaseOrderDialog} onOpenChange={setShowPurchaseOrderDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Generate Purchase Order
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Generate Purchase Order</DialogTitle>
                        <DialogDescription>
                          Create a purchase order for this approved request
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...purchaseOrderForm}>
                        <form onSubmit={purchaseOrderForm.handleSubmit(onCreatePurchaseOrder)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={purchaseOrderForm.control}
                              name="vendor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Vendor ID</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Vendor ID" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={purchaseOrderForm.control}
                              name="vendor_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Vendor Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Vendor Name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={purchaseOrderForm.control}
                            name="vendor_address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Vendor Address</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Full address..." rows={2} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={purchaseOrderForm.control}
                            name="payment_terms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Payment Terms</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Net 30" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={purchaseOrderForm.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notes (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Additional notes..." rows={3} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex gap-3 justify-end pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowPurchaseOrderDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit" 
                              className="bg-green-600 hover:bg-green-700"
                              disabled={purchaseOrderForm.formState.isSubmitting || createPurchaseOrderMutation.isPending}
                            >
                              {purchaseOrderForm.formState.isSubmitting || createPurchaseOrderMutation.isPending
                                ? "Generating..."
                                : "Generate PO"}
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

        {/* Add Item Dialog */}
        <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>
                Add a new item to this procurement request
              </DialogDescription>
            </DialogHeader>
            <Form {...addItemForm}>
              <form onSubmit={addItemForm.handleSubmit(onAddItem)} className="space-y-4">
                <FormField
                  control={addItemForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Laptop" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addItemForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the item..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addItemForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addItemForm.control}
                    name="unit_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddItemDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={addItemForm.formState.isSubmitting || createItemMutation.isPending}
                  >
                    {addItemForm.formState.isSubmitting || createItemMutation.isPending
                      ? "Adding..."
                      : "Add Item"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Item Dialog */}
        <Dialog open={showEditItemDialog} onOpenChange={setShowEditItemDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>
                Update the item details
              </DialogDescription>
            </DialogHeader>
            <Form {...editItemForm}>
              <form onSubmit={editItemForm.handleSubmit(onEditItem)} className="space-y-4">
                <FormField
                  control={editItemForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Laptop" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editItemForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the item..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editItemForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editItemForm.control}
                    name="unit_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditItemDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={editItemForm.formState.isSubmitting || updateItemMutation.isPending}
                  >
                    {editItemForm.formState.isSubmitting || updateItemMutation.isPending
                      ? "Updating..."
                      : "Update Item"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default RequestDetail;
