import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Edit,
  Trash2,
  Download,
  Eye,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  totalInvoiced: number;
  projects: number;
}

interface Project {
  id: string;
  name: string;
  client: string;
  status: "active" | "completed" | "on-hold";
  rate: number;
  type: "hourly" | "flat";
  hoursLogged?: number;
  dueDate: string;
}

interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  date: string;
  dueDate: string;
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients] = useState<Client[]>([
    {
      id: "1",
      name: "Acme Corporation",
      email: "contact@acme.com",
      phone: "+1 (555) 123-4567",
      company: "Acme",
      totalInvoiced: 5200,
      projects: 2,
    },
    {
      id: "2",
      name: "TechStart Inc.",
      email: "hello@techstart.com",
      phone: "+1 (555) 987-6543",
      company: "TechStart",
      totalInvoiced: 3800,
      projects: 1,
    },
  ]);

  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Website Redesign",
      client: "Acme Corporation",
      status: "active",
      rate: 85,
      type: "hourly",
      hoursLogged: 24,
      dueDate: "2024-02-15",
    },
    {
      id: "2",
      name: "Logo Design",
      client: "TechStart Inc.",
      status: "completed",
      rate: 1500,
      type: "flat",
      dueDate: "2024-01-20",
    },
  ]);

  const [invoices] = useState<Invoice[]>([
    {
      id: "1",
      number: "INV-001",
      client: "Acme Corporation",
      amount: 2040,
      status: "paid",
      date: "2024-01-15",
      dueDate: "2024-02-15",
    },
    {
      id: "2",
      number: "INV-002",
      client: "TechStart Inc.",
      amount: 1500,
      status: "sent",
      date: "2024-01-20",
      dueDate: "2024-02-20",
    },
    {
      id: "3",
      number: "INV-003",
      client: "Acme Corporation",
      amount: 3160,
      status: "overdue",
      date: "2023-12-01",
      dueDate: "2024-01-01",
    },
  ]);

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-50 text-green-700 border-green-200";
      case "draft":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "sent":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "overdue":
        return "bg-red-50 text-red-700 border-red-200";
      case "active":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">
                InvoiceFlow
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Paid</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  ${paidAmount.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  ${pendingAmount.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Clients</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {clients.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="invoices" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="invoices">
              <FileText className="w-4 h-4 mr-2" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="clients">
              <Users className="w-4 h-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="projects">
              <BarChart3 className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
          </TabsList>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <Card className="border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Invoices</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      New Invoice
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Invoice</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-slate-600">
                        Select a client and configure invoice details to generate a
                        professional PDF invoice.
                      </p>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Generate Invoice
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Invoice #
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b border-slate-200 hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {invoice.number}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {invoice.client}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                          ${invoice.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              invoice.status
                            )}`}
                          >
                            {invoice.status.charAt(0).toUpperCase() +
                              invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-600 hover:text-slate-900"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <Card className="border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search clients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Client</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-slate-600">
                        Add a new client to start tracking projects and invoices.
                      </p>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Save Client
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Projects
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Total Invoiced
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr
                        key={client.id}
                        className="border-b border-slate-200 hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {client.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {client.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {client.phone}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {client.projects}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                          ${client.totalInvoiced.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-600 hover:text-slate-900"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card className="border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Projects</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      New Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Project</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-slate-600">
                        Create a new project for a client to start tracking work and
                        billable hours.
                      </p>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Save Project
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Project Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Rate
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr
                        key={project.id}
                        className="border-b border-slate-200 hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {project.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {project.client}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                            {project.type === "hourly"
                              ? "Hourly"
                              : "Flat Rate"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                          {project.type === "hourly"
                            ? `$${project.rate}/hr`
                            : `$${project.rate.toLocaleString()}`}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              project.status
                            )}`}
                          >
                            {project.status.charAt(0).toUpperCase() +
                              project.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-600 hover:text-slate-900"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
