/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  FileText, 
  Users, 
  AlertCircle,
  Calendar,
  Plus,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  CreditCard,
  PieChart,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';

interface DashboardStats {
  totalEarnings: number;
  unpaidAmount: number;
  totalClients: number;
  recentInvoices: any[];
  overdueInvoices: any[];
  upcomingInvoices: any[];
  monthlyEarnings: any[];
  stats: {
    totalInvoices: number;
    paidInvoices: number;
    unpaidInvoices: number;
    overdueCount: number;
  };
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateGrowthRate = () => {
    if (!stats?.monthlyEarnings || stats.monthlyEarnings.length < 2) return 0;
    const current = stats.monthlyEarnings[stats.monthlyEarnings.length - 1]?.total || 0;
    const previous = stats.monthlyEarnings[stats.monthlyEarnings.length - 2]?.total || 0;
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getQuickActions = () => [
    {
      title: 'Create Invoice',
      description: 'Generate a new invoice',
      icon: FileText,
      color: 'bg-blue-500',
      href: '/invoices/new'
    },
    {
      title: 'Add Client',
      description: 'Add new client details',
      icon: Users,
      color: 'bg-emerald-500',
      href: '/clients/new'
    },
    {
      title: 'View Reports',
      description: 'Analyze your earnings',
      icon: BarChart3,
      color: 'bg-purple-500',
      href: '/invoices'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  const growthRate = calculateGrowthRate();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Welcome back! Here's your business overview.</p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center space-x-4">
          <div className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <Activity className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-700 font-medium">Live Dashboard</span>
          </div>
          <Link
            to="/invoices/new"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Invoice
          </Link>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total Earnings</p>
              <p className="text-3xl font-bold mt-1">
                {formatCurrency(stats?.totalEarnings || 0)}
              </p>
              <div className="flex items-center mt-2">
                {growthRate >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-200" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-emerald-200" />
                )}
                <span className="text-emerald-200 text-sm ml-1">
                  {Math.abs(growthRate).toFixed(1)}% this month
                </span>
              </div>
            </div>
            <div className="bg-emerald-400 bg-opacity-30 p-3 rounded-xl">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Unpaid Amount</p>
              <p className="text-3xl font-bold mt-1">
                {formatCurrency(stats?.unpaidAmount || 0)}
              </p>
              <p className="text-amber-200 text-sm mt-2">
                {stats?.stats.unpaidInvoices || 0} pending invoices
              </p>
            </div>
            <div className="bg-amber-400 bg-opacity-30 p-3 rounded-xl">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Invoices</p>
              <p className="text-3xl font-bold mt-1">
                {stats?.stats.totalInvoices || 0}
              </p>
              <p className="text-blue-200 text-sm mt-2">
                {stats?.stats.paidInvoices || 0} completed
              </p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-xl">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Active Clients</p>
              <p className="text-3xl font-bold mt-1">
                {stats?.totalClients || 0}
              </p>
              <p className="text-purple-200 text-sm mt-2">
                Growing network
              </p>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-xl">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Zap className="h-6 w-6 text-yellow-500 mr-2" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getQuickActions().map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="group p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center">
                <div className={`${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Payment Success Rate</h3>
            <Target className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Paid on Time</span>
              <span className="text-sm font-medium text-emerald-600">
                {stats?.stats.paidInvoices || 0}/{stats?.stats.totalInvoices || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${stats?.stats.totalInvoices ? (stats.stats.paidInvoices / stats.stats.totalInvoices) * 100 : 0}%` 
                }}
              ></div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.stats.totalInvoices ? Math.round((stats.stats.paidInvoices / stats.stats.totalInvoices) * 100) : 0}%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Average Invoice Value</h3>
            <CreditCard className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(stats?.stats.totalInvoices ? (stats.totalEarnings / stats.stats.totalInvoices) : 0)}
            </p>
            <p className="text-sm text-gray-600">Per invoice</p>
            <div className="flex items-center mt-4">
              <div className="flex-1 bg-blue-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full w-3/4"></div>
              </div>
              <span className="ml-2 text-sm text-blue-600 font-medium">Above average</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Collection Efficiency</h3>
            <PieChart className="h-5 w-5 text-purple-500" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Collected</span>
              </div>
              <span className="text-sm font-medium">{formatCurrency(stats?.totalEarnings || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <span className="text-sm font-medium">{formatCurrency(stats?.unpaidAmount || 0)}</span>
            </div>
            <div className="pt-2">
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalEarnings && stats?.unpaidAmount ? 
                  Math.round((stats.totalEarnings / (stats.totalEarnings + stats.unpaidAmount)) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-600">Collection rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <FileText className="h-6 w-6 text-blue-500 mr-2" />
                Recent Invoices
              </h3>
              <Link
                to="/invoices"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center group"
              >
                View all
                <ArrowUpRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            {stats?.recentInvoices && stats.recentInvoices.length > 0 ? (
              <div className="space-y-4">
                {stats.recentInvoices.map((invoice) => (
                  <div key={invoice._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all duration-200 group">
                    <div className="flex items-center">
                      <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-600">{invoice.clientId?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(invoice.total)}</p>
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">No invoices found</p>
                <Link
                  to="/invoices/new"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first invoice
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Due Dates */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-6 w-6 text-amber-500 mr-2" />
              Upcoming Due Dates
            </h3>
          </div>
          <div className="p-6">
            {stats?.upcomingInvoices && stats.upcomingInvoices.length > 0 ? (
              <div className="space-y-4">
                {stats.upcomingInvoices.map((invoice) => (
                  <div key={invoice._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 hover:border-amber-300 transition-all duration-200">
                    <div className="flex items-center">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <Clock className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-600">{invoice.clientId?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(invoice.total)}</p>
                      <p className="text-sm text-amber-600 font-medium">Due {formatDate(invoice.dueDate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-amber-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-amber-500" />
                </div>
                <p className="text-gray-500">No upcoming due dates</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overdue Invoices Alert */}
      {stats?.overdueInvoices && stats.overdueInvoices.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl border border-red-200 shadow-sm">
          <div className="p-6 border-b border-red-200">
            <h3 className="text-xl font-bold text-red-800 flex items-center">
              <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
              Overdue Invoices ({stats.overdueInvoices.length})
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.overdueInvoices.map((invoice) => (
                <div key={invoice._id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-200 hover:border-red-300 transition-all duration-200">
                  <div className="flex items-center">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-gray-600">{invoice.clientId?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(invoice.total)}</p>
                    <p className="text-sm text-red-600 font-medium">Overdue since {formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;