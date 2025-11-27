import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRequests } from "@/hooks/use-request";
import { Bot, Filter, Loader2, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const RequestList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useRequests(currentPage);

  const filteredRequests = data?.results?.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleNextPage = () => {
    if (data?.next) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (data?.previous) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Purchase Requests</h1>
            <p className="text-muted-foreground text-lg">Manage and track all procurement requests</p>
          </div>
          <div className="flex gap-3">
            <Link to="/requests/ai">
              <Button size="lg" variant="outline" className="gap-2 h-12 px-6 text-base font-medium border-primary/30 hover:bg-primary/10">
                <Bot className="h-5 w-5" />
                AI Request
              </Button>
            </Link>
            <Link to="/requests/new">
              <Button size="lg" className="gap-2 h-12 px-6 text-base font-medium shadow-lg hover:shadow-xl transition-shadow">
                <Plus className="h-5 w-5" />
                New Request
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search requests by title or ID..."
              className="pl-11 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[220px] h-12 text-base">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-muted-foreground text-lg">Loading requests...</p>
          </div>
        )}

        {isError && (
          <div className="text-center py-16">
            <p className="text-destructive text-lg">Error loading requests: {error?.message}</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="p-6 hover:shadow-lg transition-all hover:border-primary/30 shadow-sm">
                  <Link to={`/requests/${request.id}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-sm font-mono text-muted-foreground font-medium">{request.id}</span>
                          <StatusBadge status={request.status} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{request.title}</h3>
                        <p className="text-base text-muted-foreground mb-4">{request.description}</p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="font-medium">Created by {request.created_by_name}</span>
                          <span>{new Date(request.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <p className="text-3xl font-bold text-primary">${parseFloat(request.amount).toFixed(2)}</p>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No requests found matching your criteria</p>
              </div>
            )}

            {/* Pagination Controls */}
            {data && (filteredRequests.length > 0) && (
              <div className="flex items-center justify-between mt-8">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredRequests.length} of {data.count} requests
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePreviousPage}
                    disabled={!data.previous}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={!data.next}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default RequestList;
