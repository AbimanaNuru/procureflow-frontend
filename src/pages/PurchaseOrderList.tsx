import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePurchaseOrders } from "@/hooks/use-purchase-order";
import { PurchaseOrder } from "@/types";
import { FileText, Loader2, Package, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const PurchaseOrderList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = usePurchaseOrders(currentPage);

  // Client-side filtering based on search query
  const filteredPOs = useMemo(() => {
    if (!data?.results) return [];
    if (!searchQuery.trim()) return data.results;

    const query = searchQuery.toLowerCase();
    return data.results.filter((po: PurchaseOrder) => {
      const matchesId = po.id?.toLowerCase().includes(query);
      const matchesTitle = po.request_title?.toLowerCase().includes(query);
      const matchesVendor = po.vendor_name?.toLowerCase().includes(query);
      return matchesId || matchesTitle || matchesVendor;
    });
  }, [data?.results, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-muted-foreground text-lg">Loading purchase orders...</p>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="text-center py-16">
            <p className="text-destructive text-lg">Error loading purchase orders: {error?.message}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Purchase Orders
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage and track all generated purchase orders
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search POs by title, ID, or vendor..."
              className="pl-11 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Purchase Orders List */}
        <div className="space-y-4">
          {filteredPOs.map((po) => {
            if (!po || !po.id) return null;
            return (
              <Card 
                key={po.id} 
                className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/30 shadow-sm group"
              >
                <Link to={`/purchase-orders/${po.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="text-sm font-mono text-muted-foreground font-medium">
                            PO #{po.id.slice(0, 8)}
                          </span>
                        </div>
                        <StatusBadge status="approved" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {po.request_title || 'Untitled Request'}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span className="font-medium">
                            Vendor: {po.vendor_name || 'Unknown Vendor'}
                          </span>
                        </div>
                        <span>
                          Generated: {po.generated_at ? new Date(po.generated_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <p className="text-3xl font-bold text-primary">
                        ${parseFloat(po.total_amount || "0").toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPOs.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">
              {searchQuery ? 'No purchase orders found matching your search' : 'No purchase orders found'}
            </p>
            {searchQuery && (
              <p className="text-sm text-muted-foreground">
                Try adjusting your search query
              </p>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {data && filteredPOs.length > 0 && !searchQuery && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-muted-foreground">
              Showing {data.results?.length || 0} of {data.count} purchase orders
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={!data.previous}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!data.next}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Search Results Info */}
        {searchQuery && filteredPOs.length > 0 && (
          <div className="mt-8">
            <p className="text-sm text-muted-foreground text-center">
              Showing {filteredPOs.length} of {data?.results?.length || 0} purchase orders
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PurchaseOrderList;
