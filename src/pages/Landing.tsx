import React from 'react';
import { Link } from 'react-router-dom';
import {
  Receipt,
  LayoutDashboard,
  FileText,
  Users,
  DollarSign,
  BarChart3,
  Download,
  Zap,
  ArrowRight,
  UserPlus,
  Plus,
  ChevronRight,
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: LayoutDashboard,
      title: 'Smart Dashboard',
      description: 'Track earnings, unpaid amounts, and invoice metrics at a glance. Monitor overdue and upcoming invoices.',
    },
    {
      icon: FileText,
      title: 'Invoice Management',
      description: 'Create, edit, and manage professional invoices. Update status from draft to sent, paid, or overdue.',
    },
    {
      icon: Users,
      title: 'Client Management',
      description: 'Store client details in one place. Link clients to invoices for seamless billing.',
    },
    {
      icon: Download,
      title: 'PDF Export',
      description: 'Generate polished PDF invoices for your clients. Download and send with one click.',
    },
    {
      icon: DollarSign,
      title: 'Multi-Currency',
      description: 'Create invoices in USD, JPY, AED, or INR. Add tax and discounts with flexible options.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'View payment success rates, collection efficiency, and monthly earnings trends.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-slate-900 p-2 rounded-xl">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">InvoiceFlow</span>
            </Link>
            <nav className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-slate-700 font-medium hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm font-medium text-slate-700 mb-8">
            <Zap className="h-4 w-4 text-amber-500" />
            Streamline your invoicing workflow
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6">
            Invoice smarter.
            <br />
            <span className="text-slate-500">Get paid faster.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
            Create professional invoices, manage clients, and track your earnings—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/25 hover:shadow-slate-900/30"
            >
              Get started free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* How it works - Create invoice flow */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Create your first invoice in 2 steps
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Add your clients first, then generate professional invoices in minutes.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* Step 1: Add Client */}
            <div className="flex-1 max-w-md w-full">
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg z-10">
                  1
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden hover:border-slate-300 transition-colors">
                  <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                      <UserPlus className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Add a client</h3>
                      <p className="text-sm text-slate-500">Clients</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-10 bg-slate-100 rounded-lg"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-10 bg-slate-100 rounded-lg"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-1/5"></div>
                      <div className="h-10 bg-slate-100 rounded-lg"></div>
                    </div>
                    <button className="w-full py-3 bg-emerald-500 text-white font-medium rounded-lg flex items-center justify-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Client
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-center text-slate-600 mt-4 font-medium">
                Enter name, email, company & contact details
              </p>
            </div>

            {/* Arrow connector */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="hidden lg:flex w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 items-center justify-center">
                <ChevronRight className="h-8 w-8 text-slate-500" />
              </div>
              <div className="lg:hidden flex w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 items-center justify-center rotate-90">
                <ChevronRight className="h-8 w-8 text-slate-500" />
              </div>
              <span className="text-sm font-medium text-slate-500">then</span>
            </div>

            {/* Step 2: Create Invoice */}
            <div className="flex-1 max-w-md w-full">
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg z-10">
                  2
                </div>
                <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden hover:border-slate-300 transition-colors">
                  <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Create invoice</h3>
                      <p className="text-sm text-slate-500">New Invoice</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-10 bg-slate-100 rounded-lg flex items-center px-3">
                        <Users className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="text-slate-400 text-sm">Select client</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-10 bg-slate-100 rounded-lg"></div>
                      <div className="h-10 bg-slate-100 rounded-lg"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-10 bg-slate-100 rounded-lg"></div>
                      <button className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg text-sm flex items-center gap-1">
                        <Plus className="h-3 w-3" />
                        Item
                      </button>
                    </div>
                    <button className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg">
                      Generate Invoice
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-center text-slate-600 mt-4 font-medium">
                Pick client, add line items & download PDF
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to manage invoices
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built for freelancers and small businesses who want a simple, powerful invoicing solution.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-5">
                  <feature.icon className="h-6 w-6 text-slate-700" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
            >
              Start creating invoices
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900 rounded-3xl p-12 sm:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to streamline your invoicing?
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
              Join InvoiceFlow today and spend less time on paperwork, more time on what matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
              >
                Create account
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-600 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-slate-500" />
            <span className="font-semibold text-slate-700">InvoiceFlow</span>
          </div>
          <div className="flex gap-8">
            <Link to="/login" className="text-slate-500 hover:text-slate-700 text-sm font-medium">
              Sign In
            </Link>
            <Link to="/register" className="text-slate-500 hover:text-slate-700 text-sm font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
