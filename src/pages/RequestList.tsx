import { useState } from "react";
import { Header } from "@/components/Header";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Filter, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Request = {
  id: string;
  title: string;
  description: string;
  amount: string;
  status: "pending" | "approved" | "rejected";
  createdBy: string;
  date: string;
};

const RequestList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const requests: Request[] = [
    {
      id: "PR-001",
      title: "Office Supplies - Q1",
      description: "Stationery, paper, and general office supplies for Q1 2024",
      amount: "$2,500",
      status: "pending",
      createdBy: "John Doe",
      date: "2024-01-15",
    },
    {
      id: "PR-002",
      title: "Software Licenses",
      description: "Annual licenses for design and development tools",
      amount: "$15,000",
      status: "approved",
      createdBy: "Jane Smith",
      date: "2024-01-14",
    },
    {
      id: "PR-003",
      title: "Hardware Equipment",
      description: "New laptops and monitors for engineering team",
      amount: "$8,750",
      status: "pending",
      createdBy: "Mike Johnson",
      date: "2024-01-13",
    },
    {
      id: "PR-004",
      title: "Marketing Materials",
      description: "Brochures, business cards, and promotional items",
      amount: "$3,200",
      status: "approved",
      createdBy: "Sarah Williams",
      date: "2024-01-12",
    },
    {
      id: "PR-005",
      title: "Travel Expenses",
      description: "Conference attendance and accommodation",
      amount: "$4,500",
      status: "rejected",
      createdBy: "Tom Brown",
      date: "2024-01-11",
    },
  ];

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header userName="John Doe" role="Staff" onLogout={() => navigate("/login")} />

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Purchase Requests</h1>
            <p className="text-muted-foreground text-lg">Manage and track all procurement requests</p>
          </div>
          <Link to="/requests/new">
            <Button size="lg" className="gap-2 h-12 px-6 text-base font-medium shadow-lg hover:shadow-xl transition-shadow">
              <Plus className="h-5 w-5" />
              New Request
            </Button>
          </Link>
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
                      <span className="font-medium">Created by {request.createdBy}</span>
                      <span>{request.date}</span>
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <p className="text-3xl font-bold text-primary">{request.amount}</p>
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
      </main>
    </div>
  );
};

export default RequestList;
