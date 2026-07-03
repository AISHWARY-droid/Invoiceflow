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
  X,
  RotateCcw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { downloadInvoicePDF } from "@/lib/pdf-generator";

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

const DEFAULT_CLIENTS: Client[] = [
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
];

const DEFAULT_PROJECTS: Project[] = [
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
];

const DEFAULT_INVOICES: Invoice[] = [
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
];

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useLocalStorage<Client[]>("clients", DEFAULT_CLIENTS);
  const [projects, setProjects] = useLocalStorage<Project[]>("projects", DEFAULT_PROJECTS);
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>("invoices", DEFAULT_INVOICES);

  const [newClientOpen, setNewClientOpen] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: "",
    client: "",
    rate: "",
    type: "hourly" as "hourly" | "flat",
    dueDate: "",
  });

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

  const handleAddClient = () => {
    if (!newClientData.name || !newClientData.email || !newClientData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    const newClient: Client = {
      id: Date.now().toString(),
      ...newClientData,
      totalInvoiced: 0,
      projects: 0,
    };

    setClients([...clients, newClient]);
    setNewClientData({ name: "", email: "", phone: "", company: "" });
    setNewClientOpen(false);
  };

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter((c) => c.id !== id));
  };

  const handleAddProject = () => {
    if (!newProjectData.name || !newProjectData.client || !newProjectData.rate || !newProjectData.dueDate) {
      alert("Please fill in all required fields");
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      ...newProjectData,
      status: "active",
      rate: parseFloat(newProjectData.rate),
      hoursLogged: 0,
    };

    setProjects([...projects, newProject]);
    setNewProjectData({
      name: "",
      client: "",
      rate: "",
      type: "hourly",
      dueDate: "",
    });
    setNewProjectOpen(false);
  };

  const handleChangeInvoiceStatus = (id: string, newStatus: Invoice["status"]) => {
    setInvoices(
      invoices.map((inv) =>
        inv.id === id ? { ...inv, status: newStatus } : inv
      )
    );
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    const client = clients.find((c) => c.name === invoice.client);
    if (!client) {
      alert("Client not found");
      return;
    }

    downloadInvoicePDF(invoice, {
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
    });
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter((inv) => inv.id !== id));
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResetData = () => {
    if (window.confirm("Reset all data to defaults? This cannot be undone.")) {
      localStorage.removeItem("clients");
      localStorage.removeItem("projects");
      localStorage.removeItem("invoices");
      window.location.reload();
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
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleResetData} className="text-red-600">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset All Data
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              {invoices.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No invoices yet
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Get started by creating your first invoice. Select a client and generate a professional PDF.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Invoice
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
              ) : (
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
                            <select
                              value={invoice.status}
                              onChange={(e) =>
                                handleChangeInvoiceStatus(
                                  invoice.id,
                                  e.target.value as Invoice["status"]
                                )
                              }
                              className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${getStatusColor(
                                invoice.status
                              )}`}
                            >
                              <option value="draft">Draft</option>
                              <option value="sent">Sent</option>
                              <option value="paid">Paid</option>
                              <option value="overdue">Overdue</option>
                            </select>
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
                                onClick={() => handleDownloadInvoice(invoice)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteInvoice(invoice.id)}
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
              )}
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
                <Dialog open={newClientOpen} onOpenChange={setNewClientOpen}>
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
                      <div>
                        <label className="text-sm font-medium text-slate-900">Name *</label>
                        <Input
                          placeholder="Client name"
                          value={newClientData.name}
                          onChange={(e) =>
                            setNewClientData({
                              ...newClientData,
                              name: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-900">Email *</label>
                        <Input
                          placeholder="client@example.com"
                          type="email"
                          value={newClientData.email}
                          onChange={(e) =>
                            setNewClientData({
                              ...newClientData,
                              email: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-900">Phone *</label>
                        <Input
                          placeholder="+1 (555) 000-0000"
                          value={newClientData.phone}
                          onChange={(e) =>
                            setNewClientData({
                              ...newClientData,
                              phone: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-900">Company</label>
                        <Input
                          placeholder="Company name (optional)"
                          value={newClientData.company}
                          onChange={(e) =>
                            setNewClientData({
                              ...newClientData,
                              company: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleAddClient}
                      >
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
                    {filteredClients.map((client) => (
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
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteClient(client.id)}
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
                <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
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
                      <div>
                        <label className="text-sm font-medium text-slate-900">Project Name *</label>
                        <Input
                          placeholder="Project name"
                          value={newProjectData.name}
                          onChange={(e) =>
                            setNewProjectData({
                              ...newProjectData,
                              name: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-900">Client *</label>
                        <select
                          value={newProjectData.client}
                          onChange={(e) =>
                            setNewProjectData({
                              ...newProjectData,
                              client: e.target.value,
                            })
                          }
                          className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        >
                          <option value="">Select a client</option>
                          {clients.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-900">Type *</label>
                        <select
                          value={newProjectData.type}
                          onChange={(e) =>
                            setNewProjectData({
                              ...newProjectData,
                              type: e.target.value as "hourly" | "flat",
                            })
                          }
                          className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        >
                          <option value="hourly">Hourly</option>
                          <option value="flat">Flat Rate</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-900">Rate *</label>
                        <Input
                          placeholder={newProjectData.type === "hourly" ? "Rate per hour" : "Flat rate"}
                          type="number"
                          value={newProjectData.rate}
                          onChange={(e) =>
                            setNewProjectData({
                              ...newProjectData,
                              rate: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-900">Due Date *</label>
                        <Input
                          type="date"
                          value={newProjectData.dueDate}
                          onChange={(e) =>
                            setNewProjectData({
                              ...newProjectData,
                              dueDate: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleAddProject}
                      >
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
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteProject(project.id)}
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
        </Tabs>
      </main>
    </div>
  );
}
