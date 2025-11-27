import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useExtractProforma } from "@/hooks/use-ai-request";
import { useCreateRequest } from "@/hooks/use-request";
import { useToast } from "@/hooks/use-toast";
import { newRequestSchema, type NewRequestInput } from "@/lib/validations";
import { CreateRequestInput } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, FileText, Plus, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const NewRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createRequestMutation = useCreateRequest();
  const extractProformaMutation = useExtractProforma();
  const [proformaFile, setProformaFile] = useState<File | null>(null);

  const form = useForm<NewRequestInput>({
    resolver: zodResolver(newRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      items: [
        {
          name: "",
          description: "",
          quantity: 1,
          unit_price: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = async (data: NewRequestInput) => {
    try {
      if (proformaFile) {
        // If proforma is uploaded, use the AI extraction endpoint
        extractProformaMutation.mutate({
          title: data.title,
          description: data.description,
          amount: calculateTotal(),
          proforma: proformaFile,
        }, {
          onSuccess: () => {
            navigate("/requests");
          },
        });
      } else {
        // Otherwise use the standard create request endpoint
        createRequestMutation.mutate(data as CreateRequestInput, {
          onSuccess: () => {
            navigate("/requests");
          },
        });
      }
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Failed to create request:", error);
    }
  };

  const addItem = () => {
    append({
      name: "",
      description: "",
      quantity: 1,
      unit_price: "",
    });
  };

  const calculateTotal = () => {
    const items = form.watch("items");
    return items.reduce((total, item) => {
      const quantity = item.quantity || 0;
      const unitPrice = parseFloat(item.unit_price) || 0;
      return total + quantity * unitPrice;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-8 text-base"
          onClick={() => navigate("/requests")}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Requests
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl">New Purchase Request</CardTitle>
            <CardDescription className="text-base mt-2">
              Submit a new procurement request for approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Office Supplies - Q1" className="h-11 text-base" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide detailed information about this purchase request..."
                          rows={5}
                          className="text-base resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Proforma Upload Section */}
                <div className="space-y-2">
                  <FormLabel>Proforma Invoice (Optional)</FormLabel>
                  <Card className="border-dashed border-2 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      {proformaFile ? (
                        <div className="flex items-center gap-4 w-full max-w-md p-3 bg-background border rounded-lg">
                          <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                          <div className="flex-1 text-left overflow-hidden">
                            <p className="font-medium truncate">{proformaFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(proformaFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setProformaFile(null)}
                            className="flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                          <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                          <p className="font-medium">Click to upload proforma invoice</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            AI will extract details from the PDF
                          </p>
                          <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setProformaFile(file);
                            }}
                          />
                        </label>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Items</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Item {index + 1}</h4>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>

                        <FormField
                          control={form.control}
                          name={`items.${index}.name`}
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
                          control={form.control}
                          name={`items.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Item Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe the item..."
                                  rows={2}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
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
                            control={form.control}
                            name={`items.${index}.unit_price`}
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
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Total Amount Display */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/requests")}
                    className="flex-1 h-11 text-base"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting || createRequestMutation.isPending || extractProformaMutation.isPending}
                    className="flex-1 h-11 text-base font-medium"
                  >
                    {form.formState.isSubmitting || createRequestMutation.isPending || extractProformaMutation.isPending
                      ? "Submitting..."
                      : "Submit Request"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NewRequest;
