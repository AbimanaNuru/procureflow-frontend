
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequests } from "@/hooks/use-request";
import { CheckCircle, Clock, FileText, Loader2, Plus, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();



  const { data, isLoading, isError } = useRequests(1);
  const recentRequests = data?.results?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-background">
      
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

   
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Recent Requests</CardTitle>
            <CardDescription className="text-base">Your latest purchase requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-3 text-muted-foreground">Loading requests...</p>
                </div>
              ) : isError ? (
                <div className="text-center py-8">
                  <p className="text-destructive">Failed to load recent requests</p>
                </div>
              ) : recentRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent requests found</p>
                </div>
              ) : (
                recentRequests.map((request) => (
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
                              : request.status === "rejected"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-warning/10 text-warning"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="font-semibold text-base mb-1">{request.title}</p>
                      <p className="text-sm text-muted-foreground">{new Date(request.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-primary">${parseFloat(request.amount).toFixed(2)}</p>
                    </div>
                  </Link>
                ))
              )}
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
