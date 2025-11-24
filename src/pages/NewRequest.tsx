import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { ArrowLeft, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { newRequestSchema, type NewRequestInput } from "@/lib/validations";

const NewRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fileName, setFileName] = useState<string>("");

  const form = useForm<NewRequestInput>({
    resolver: zodResolver(newRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: "",
    },
  });

  const onSubmit = async (data: NewRequestInput) => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Request Submitted",
        description: "Your purchase request has been submitted for approval",
      });
      navigate("/requests");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userName="John Doe" role="Staff" onLogout={() => navigate("/login")} />

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

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Amount ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" step="0.01" className="h-11 text-base" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="proforma"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Proforma Invoice / Quotation</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <label
                            htmlFor="proforma"
                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 border-border transition-all hover:border-primary/50"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                <Upload className="w-7 h-7 text-primary" />
                              </div>
                              <p className="text-base font-medium text-foreground mb-1">
                                {fileName || "Click to upload or drag and drop"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                PDF, JPG, or PNG (max 5MB)
                              </p>
                            </div>
                            <Input
                              id="proforma"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  onChange(file);
                                  setFileName(file.name);
                                }
                              }}
                              {...field}
                            />
                          </label>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload proforma or quotation document
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-6 flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/requests")}
                    className="flex-1 h-11 text-base"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting} className="flex-1 h-11 text-base font-medium">
                    {form.formState.isSubmitting ? "Submitting..." : "Submit Request"}
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
