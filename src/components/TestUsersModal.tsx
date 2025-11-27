import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Check, Copy, Users } from "lucide-react";
import { useState } from "react";

interface TestUser {
  username: string;
  email: string;
  password: string;
  group: string;
  department: string;
}

const testUsers: TestUser[] = [
  {
    username: "staff_user",
    email: "staff@example.com",
    password: "password123",
    group: "Staff",
    department: "Procurement",
  },
  {
    username: "manager_user",
    email: "manager@example.com",
    password: "password123",
    group: "Manager",
    department: "Management",
  },
  {
    username: "finance_user",
    email: "finance@example.com",
    password: "password123",
    group: "Finance",
    department: "Finance",
  },

  {
    username: "admin",
    email: "admin@example.com",
    password: "password123",
    group: "Admin",
    department: "Admin",
  },
];

const groupPermissions: Record<string, string[]> = {
  Staff: [
    "Add purchase requests",
    "View purchase requests",
    "Change purchase requests",
    "Add request items",
    "View request items",
    "Change request items",
  ],
  Manager: [
    "Add purchase requests",
    "View purchase requests",
    "Change purchase requests",
    "Approve purchase requests",
    "Reject purchase requests",
    "Add request items",
    "View request items",
    "Change request items",
  ],
  Finance: [
    "View purchase requests",
    "Approve purchase requests",
    "Reject purchase requests",
    "View purchase orders",
    "Add purchase orders",
    "Change purchase orders",
  ],
};

const groupColors: Record<string, string> = {
  Staff: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  Manager: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  Finance: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
};

export const TestUsersModal = () => {
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCredentials = (user: TestUser, index: number) => {
    const credentials = `Username: ${user.username}\nPassword: ${user.password}`;
    navigator.clipboard.writeText(credentials);
    setCopiedIndex(index);
    toast({
      title: "Copied!",
      description: "Credentials copied to clipboard",
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          Test Users
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Test User Accounts
          </DialogTitle>
          <DialogDescription className="text-base">
            Use these credentials to test different user roles and permissions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {testUsers.map((user, index) => (
            <Card key={user.username} className="border-2 hover:border-primary/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{user.username}</h3>
                      <Badge className={groupColors[user.group]}>
                        {user.group}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.department} Department</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCredentials(user, index)}
                    className="gap-2"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Username</p>
                    <p className="font-mono text-sm font-medium">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Password</p>
                    <p className="font-mono text-sm font-medium">{user.password}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">PERMISSIONS</p>
                  <div className="flex flex-wrap gap-1.5">
                    {groupPermissions[user.group]?.map((permission, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> These are test accounts for development purposes. Each role has different permissions that control what actions they can perform in the system.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
