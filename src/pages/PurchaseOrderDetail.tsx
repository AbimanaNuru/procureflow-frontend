import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PERMISSIONS } from "@/config/permission-config";
import { usePermission } from "@/hooks/use-permission";
import { usePurchaseOrder, useUpdatePurchaseOrder } from "@/hooks/use-purchase-order";
import { PurchaseOrderInput, purchaseOrderSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Calendar, DollarSign, Edit, FileCheck, Loader2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const PurchaseOrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: po, isLoading, isError, error } = usePurchaseOrder(id || "");
  const updatePurchaseOrderMutation = useUpdatePurchaseOrder();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const canEditPO = usePermission(PERMISSIONS.CHANGE_PURCHASE_ORDER);

  const editForm = useForm<PurchaseOrderInput>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      vendor: "",
      vendor_name: "",
      vendor_address: "",
      payment_terms: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (po) {
      editForm.reset({
        vendor: po.vendor,
        vendor_name: po.vendor_name,
        vendor_address: po.vendor_address,
        payment_terms: po.payment_terms,
        notes: po.notes || "",
      });
    }
  }, [po, editForm]);

  const onEditSubmit = async (data: PurchaseOrderInput) => {
    if (!po) return;
    
    await updatePurchaseOrderMutation.mutateAsync({
      id: po.id,
      data: data,
    });
    setShowEditDialog(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-lg">Loading purchase order...</p>
        </div>
      </div>
    );
  }

  if (isError || !po) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg mb-4">
            Error loading purchase order: {error?.message || "Purchase Order not found"}
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
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-muted-foreground">PO #{po.id?.slice(0, 8)}</span>
                        <StatusBadge status="approved" />
                      </div>
                      <CardTitle className="text-2xl">{po.request_title || 'Untitled Request'}</CardTitle>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-primary">
                        {parseFloat(po.total_amount || "0").toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Vendor</p>
                      <p className="font-medium">{po.vendor_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Generated On</p>
                      <p className="font-medium">{po.generated_at ? new Date(po.generated_at).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Vendor Details</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><span className="font-medium text-foreground">ID:</span> {po.vendor}</p>
                      <p><span className="font-medium text-foreground">Address:</span> {po.vendor_address}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Payment Terms</h3>
                    <p className="text-sm text-muted-foreground">{po.payment_terms}</p>
                  </div>
                </div>

                {po.notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <p className="text-sm text-muted-foreground">{po.notes}</p>
                  </div>
                )}

                <Separator />

                {/* Items List */}
                <div>
                  <h3 className="font-semibold mb-3">Items</h3>
                  {po.items && po.items.length > 0 ? (
                    <div className="space-y-2">
                      {po.items.map((item, index) => (
                        <div key={index} className="border border-border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="font-bold text-primary">${(item.total || 0).toFixed(2)}</p>
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Qty: {item.quantity}</span>
                            <span>Unit Price: ${(item.unit_price || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No items found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {canEditPO && (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setShowEditDialog(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Purchase Order
                  </Button>
                )}
                <Button className="w-full" variant="outline">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Purchase Order</DialogTitle>
              <DialogDescription>
                Update the vendor details and other information for this purchase order.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="vendor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor ID</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., V-12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="vendor_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Acme Corp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={editForm.control}
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
                  control={editForm.control}
                  name="payment_terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Net 30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
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

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updatePurchaseOrderMutation.isPending}>
                    {updatePurchaseOrderMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default PurchaseOrderDetail;
