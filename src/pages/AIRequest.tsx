import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useExtractProforma } from "@/hooks/use-ai-request";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Bot, FileText, Sparkles, Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const aiRequestSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type AIRequestInput = z.infer<typeof aiRequestSchema>;

const AIRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const extractProformaMutation = useExtractProforma();
  const [proformaFile, setProformaFile] = useState<File | null>(null);

  const form = useForm<AIRequestInput>({
    resolver: zodResolver(aiRequestSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: AIRequestInput) => {
    if (!proformaFile) {
      toast({
        title: "Error",
        description: "Please upload a proforma invoice",
        variant: "destructive",
      });
      return;
    }

    try {
      extractProformaMutation.mutate(
        {
          title: data.title,
          description: data.description,
          amount: 0, // Will be extracted from proforma
          proforma: proformaFile,
        },
        {
          onSuccess: () => {
            navigate("/requests");
          },
        }
      );
    } catch (error) {
      console.error("Failed to process AI request:", error);
    }
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

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AI-Powered Request
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Upload a proforma invoice and let AI extract all the details automatically
          </p>
        </div>

        <Card className="shadow-xl border-primary/20">
          <CardHeader className="pb-6 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-2xl">Proforma Invoice Processing</CardTitle>
            </div>
            <CardDescription className="text-base mt-2">
              Our AI will automatically extract vendor details, items, prices, and payment terms
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Office Equipment Purchase"
                          className="h-11 text-base"
                          {...field}
                        />
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
                          placeholder="Provide context about this purchase..."
                          rows={4}
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
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Proforma Invoice (Required)
                  </FormLabel>
                  <Card className="border-dashed border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
                    <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                      {proformaFile ? (
                        <div className="flex items-center gap-4 w-full max-w-md p-4 bg-background border-2 border-primary/20 rounded-lg">
                          <div className="p-2 bg-primary/10 rounded">
                            <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                          </div>
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
                            className="flex-shrink-0 hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-4">
                          <div className="p-3 bg-primary/10 rounded-full mb-3">
                            <Upload className="h-10 w-10 text-primary" />
                          </div>
                          <p className="font-semibold text-lg mb-1">
                            Click to upload proforma invoice
                          </p>
                          <p className="text-sm text-muted-foreground">
                            PDF format • AI will extract all details automatically
                          </p>
                          <div className="mt-4 flex items-center gap-2 text-xs text-primary">
                            <Sparkles className="h-4 w-4" />
                            <span>Powered by AI</span>
                          </div>
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
                  <p className="text-sm text-muted-foreground">
                    The AI will automatically extract vendor information, line items, quantities, prices, and payment terms
                  </p>
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
                    disabled={!proformaFile || extractProformaMutation.isPending}
                    className="flex-1 h-11 text-base font-medium"
                  >
                    {extractProformaMutation.isPending ? (
                      <>
                        <Bot className="h-4 w-4 mr-2 animate-pulse" />
                        Processing with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Process with AI
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 bg-primary/10 rounded-full mb-3">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">1. Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your proforma invoice PDF
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 bg-primary/10 rounded-full mb-3">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">2. AI Processing</h3>
                <p className="text-sm text-muted-foreground">
                  AI extracts all relevant details
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 bg-primary/10 rounded-full mb-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">3. Review</h3>
                <p className="text-sm text-muted-foreground">
                  Review and submit the request
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AIRequest;
