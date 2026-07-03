import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileText,
  Users,
  BarChart3,
  Download,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">
                InvoiceFlow
              </span>
            </div>
            <Link to="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Manage Clients & Invoices,
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            Effortlessly
          </span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          All-in-one portal for freelancers and small businesses. Track clients,
          manage projects, log hours, and generate professional PDF invoices in
          seconds.
        </p>
        <Link to="/dashboard">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg h-auto rounded-lg">
            Start Managing <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
          Everything You Need
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card className="border border-slate-200 p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Client Management
            </h3>
            <p className="text-slate-600">
              Create and organize client profiles with contact information,
              project history, and communication preferences.
            </p>
          </Card>

          {/* Feature 2 */}
          <Card className="border border-slate-200 p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Project Tracking
            </h3>
            <p className="text-slate-600">
              Log billable hours, track milestones, and manage flat-rate or
              hourly projects with ease.
            </p>
          </Card>

          {/* Feature 3 */}
          <Card className="border border-slate-200 p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Invoice Generation
            </h3>
            <p className="text-slate-600">
              Generate professional PDF invoices instantly with automatic
              calculations for taxes, totals, and aging.
            </p>
          </Card>

          {/* Feature 4 */}
          <Card className="border border-slate-200 p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Export & Download
            </h3>
            <p className="text-slate-600">
              Download PDF invoices, export client data, and integrate with your
              accounting tools.
            </p>
          </Card>

          {/* Feature 5 */}
          <Card className="border border-slate-200 p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Analytics
            </h3>
            <p className="text-slate-600">
              Get insights into your revenue, invoiced amounts, pending payments,
              and client trends.
            </p>
          </Card>

          {/* Feature 6 */}
          <Card className="border border-slate-200 p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Payment Tracking
            </h3>
            <p className="text-slate-600">
              Mark invoices as paid, track overdue payments, and manage payment
              statuses.
            </p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your billing?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Start managing your clients and invoices today. No credit card required.
          </p>
          <Link to="/dashboard">
            <Button className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-6 text-lg h-auto rounded-lg font-semibold">
              Launch Dashboard <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-slate-600">
            <p>© 2024 InvoiceFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
