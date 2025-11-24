import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Requests",
      value: "24",
      description: "All purchase requests",
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "Pending",
      value: "8",
      description: "Awaiting approval",
      icon: Clock,
      color: "text-warning",
    },
    {
      title: "Approved",
      value: "14",
      description: "Successfully approved",
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: "Rejected",
      value: "2",
      description: "Not approved",
      icon: XCircle,
      color: "text-destructive",
    },
  ];

  const recentRequests = [
    {
      id: "PR-001",
      title: "Office Supplies - Q1",
      amount: "$2,500",
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: "PR-002",
      title: "Software Licenses",
      amount: "$15,000",
      status: "approved",
      date: "2024-01-14",
    },
    {
      id: "PR-003",
      title: "Hardware Equipment",
      amount: "$8,750",
      status: "pending",
      date: "2024-01-13",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header userName="John Doe" role="Staff" onLogout={() => navigate("/login")} />
      
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Dashboard</h1>
            <p className="text-muted-foreground text-lg">Welcome back! Here's your procurement overview.</p>
          </div>
          <Link to="/requests/new">
            <Button size="lg" className="gap-2 h-12 px-6 text-base font-medium shadow-lg hover:shadow-xl transition-shadow">
              <Plus className="h-5 w-5" />
              New Request
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Recent Requests</CardTitle>
            <CardDescription className="text-base">Your latest purchase requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <Link
                  key={request.id}
                  to={`/requests/${request.id}`}
                  className="flex items-center justify-between p-5 border border-border rounded-xl hover:bg-accent/50 hover:border-primary/30 transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-muted-foreground font-medium">{request.id}</span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          request.status === "approved"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <p className="font-semibold text-base mb-1">{request.title}</p>
                    <p className="text-sm text-muted-foreground">{request.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-primary">{request.amount}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link to="/requests">
                <Button variant="outline" className="h-11 px-6 text-base">View All Requests</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
