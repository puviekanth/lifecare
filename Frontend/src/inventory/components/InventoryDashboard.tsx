import React, { useState } from 'react';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  RefreshCw,
  ShoppingCart,
  Calendar,
  User,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  code: string;
  currentStock: number;
  reorderLevel: number;
  location: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Near Expiry' | 'Expired';
  expiryDate: string;
  value: number;
  supplier?: string;
  suggestedQty?: number;
  cost?: number;
}

interface Transaction {
  id: string;
  date: string;
  productId: string;
  type: 'IN' | 'OUT' | 'EXPIRED';
  quantity: number;
  reason: string;
  reference: string;
  user: string;
}

interface Alert {
  id: string;
  productName: string;
  productId: string;
  message: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  date: string;
  type: 'stock' | 'expiry' | 'reorder';
}

const products: Product[] = [
  {
    id: 'MED001',
    name: 'Paracetamol 500mg',
    code: 'MED001',
    currentStock: 100,
    reorderLevel: 50,
    location: 'A1-B2',
    status: 'In Stock',
    expiryDate: '2025-12-31',
    value: 2000.00
  },
  {
    id: 'MED002',
    name: 'Amoxicillin 250mg',
    code: 'MED002',
    currentStock: 25,
    reorderLevel: 30,
    location: 'B2-C1',
    status: 'Low Stock',
    expiryDate: '2025-08-15',
    value: 875.00,
    supplier: 'PharmaDist Co',
    suggestedQty: 60,
    cost: 2100.00
  },
  {
    id: 'MED003',
    name: 'Ibuprofen 200mg',
    code: 'MED003',
    currentStock: 0,
    reorderLevel: 40,
    location: 'C1-D2',
    status: 'Out of Stock',
    expiryDate: '2025-10-20',
    value: 0.00,
    supplier: 'HealthCare Solutions',
    suggestedQty: 80,
    cost: 1920.00
  },
  {
    id: 'MED004',
    name: 'Cetirizine 10mg',
    code: 'MED004',
    currentStock: 120,
    reorderLevel: 60,
    location: 'D2-E1',
    status: 'Near Expiry',
    expiryDate: '2024-03-10',
    value: 1800.00
  },
  {
    id: 'MED005',
    name: 'Omeprazole 20mg',
    code: 'MED005',
    currentStock: 75,
    reorderLevel: 35,
    location: 'E1-F2',
    status: 'Expired',
    expiryDate: '2023-12-22',
    value: 3375.00
  },
  {
    id: 'MED006',
    name: 'Metformin 500mg',
    code: 'MED006',
    currentStock: 90,
    reorderLevel: 45,
    location: 'F2-G1',
    status: 'In Stock',
    expiryDate: '2025-11-15',
    value: 3150.00
  }
];

const transactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-15',
    productId: 'MED001',
    type: 'IN',
    quantity: 50,
    reason: 'Stock replenishment',
    reference: 'PO-2024-001',
    user: 'John Doe'
  },
  {
    id: '2',
    date: '2024-01-14',
    productId: 'MED002',
    type: 'OUT',
    quantity: 25,
    reason: 'Sale',
    reference: 'INV-2024-045',
    user: 'Jane Smith'
  },
  {
    id: '3',
    date: '2024-01-13',
    productId: 'MED003',
    type: 'OUT',
    quantity: 80,
    reason: 'Bulk order',
    reference: 'INV-2024-044',
    user: 'Mike Johnson'
  },
  {
    id: '4',
    date: '2024-01-12',
    productId: 'MED005',
    type: 'EXPIRED',
    quantity: 15,
    reason: 'Expired stock removal',
    reference: 'EXP-2024-001',
    user: 'System'
  }
];

const alerts: Alert[] = [
  {
    id: '1',
    productName: 'Ibuprofen 200mg',
    productId: 'MED003',
    message: 'Product is out of stock',
    priority: 'HIGH',
    date: '2024-01-13',
    type: 'stock'
  },
  {
    id: '2',
    productName: 'Amoxicillin 250mg',
    productId: 'MED002',
    message: 'Stock level below reorder point',
    priority: 'MEDIUM',
    date: '2024-01-14',
    type: 'reorder'
  },
  {
    id: '3',
    productName: 'Cetirizine 10mg',
    productId: 'MED004',
    message: 'Product expires in 2 months',
    priority: 'MEDIUM',
    date: '2024-01-12',
    type: 'expiry'
  },
  {
    id: '4',
    productName: 'Omeprazole 20mg',
    productId: 'MED005',
    message: 'Product has expired',
    priority: 'HIGH',
    date: '2024-01-11',
    type: 'expiry'
  }
];

const InventoryDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + product.value, 0);
  const lowStockItems = products.filter(p => p.status === 'Low Stock').length;
  const outOfStockItems = products.filter(p => p.status === 'Out of Stock').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      case 'Near Expiry': return 'bg-orange-100 text-orange-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'IN': return 'bg-green-100 text-green-800';
      case 'OUT': return 'bg-blue-100 text-blue-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-3xl font-bold text-gray-900">Rs. {totalValue.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-3xl font-bold text-yellow-600">{lowStockItems}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600">{outOfStockItems}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setActiveTab('stock-levels')}
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
          >
            <Package className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">View Stock Levels</span>
          </button>
          <button 
            onClick={() => setActiveTab('reorder')}
            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
          >
            <ShoppingCart className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-900">Reorder Management</span>
          </button>
          <button 
            onClick={() => setActiveTab('alerts')}
            className="flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
          >
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-900">View Alerts ({alerts.length})</span>
          </button>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
        <div className="space-y-4">
          {alerts.slice(0, 4).map((alert) => (
            <div key={alert.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {alert.type === 'stock' && <XCircle className="h-5 w-5 text-red-500" />}
                {alert.type === 'reorder' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                {alert.type === 'expiry' && <Clock className="h-5 w-5 text-orange-500" />}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{alert.productName}</h4>
                <p className="text-sm text-gray-600">{alert.message}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                  {alert.priority}
                </span>
                <span className="text-sm text-gray-500">{alert.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStockLevels = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Package className="h-6 w-6 text-blue-600" />
          Stock Level Management
        </h3>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by medicine name, product ID, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>All Status</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
            <option>Near Expiry</option>
            <option>Expired</option>
          </select>
          <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All OTC</option>
            <option>Prescription</option>
            <option>OTC</option>
          </select>
        </div>
      </div>

      {/* Stock Levels Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-blue-600">Stock Levels ({filteredProducts.length})</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <Package className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-lg font-semibold ${
                      product.currentStock === 0 ? 'text-red-600' :
                      product.currentStock <= product.reorderLevel ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {product.currentStock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.reorderLevel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.expiryDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs. {product.value.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <FileText className="h-6 w-6 text-blue-600" />
        Recent Transactions
      </h3>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.productId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.user}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-blue-600" />
        Stock Alerts ({alerts.length})
      </h3>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {alert.type === 'stock' && <XCircle className="h-6 w-6 text-red-500" />}
                  {alert.type === 'reorder' && <AlertTriangle className="h-6 w-6 text-yellow-500" />}
                  {alert.type === 'expiry' && <Clock className="h-6 w-6 text-orange-500" />}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{alert.productName}</h4>
                  <p className="text-gray-600">{alert.message}</p>
                  <p className="text-sm text-gray-500 mt-1">Product ID: {alert.productId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(alert.priority)}`}>
                  {alert.priority}
                </span>
                <span className="text-sm text-gray-500">{alert.date}</span>
                <button className="text-gray-400 hover:text-gray-600">
                  <CheckCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReorder = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-blue-600" />
          Reorder Management
        </h3>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200">
          <ShoppingCart className="h-4 w-4" />
          Generate Purchase Order
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suggested Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.filter(p => p.supplier).map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <Package className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-lg font-semibold ${
                      product.currentStock === 0 ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {product.currentStock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.reorderLevel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-blue-600">{product.suggestedQty}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      defaultValue={product.suggestedQty}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs. {product.cost?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200">
                      Add to Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-blue-600" />
        Analytics & Reports
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-blue-600" />
            Stock Status Distribution
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">In Stock</span>
              </div>
              <span className="text-sm font-medium">3 items</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Low Stock</span>
              </div>
              <span className="text-sm font-medium">1 item</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Out of Stock</span>
              </div>
              <span className="text-sm font-medium">1 item</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Near Expiry</span>
              </div>
              <span className="text-sm font-medium">1 item</span>
            </div>
          </div>
        </div>

        {/* Top Products by Value */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Top Products by Value
          </h4>
          <div className="space-y-3">
            {products.sort((a, b) => b.value - a.value).slice(0, 4).map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="text-sm text-gray-900">{product.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">Rs. {product.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Recent Activity
        </h4>
        <div className="space-y-4">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                transaction.type === 'IN' ? 'bg-green-500' :
                transaction.type === 'OUT' ? 'bg-blue-500' : 'bg-red-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{transaction.productId}</span> - {transaction.reason}
                </p>
                <p className="text-xs text-gray-500">{transaction.date} by {transaction.user}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
                {transaction.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Comprehensive Inventory Management</h1>
              <p className="text-blue-100 mt-1">Manage your medical inventory efficiently</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200">
                <Download className="h-4 w-4" />
                Export
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200">
                <Upload className="h-4 w-4" />
                Import
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'stock-levels', label: 'Stock Levels', icon: Package },
              { id: 'transactions', label: 'Transactions', icon: FileText },
              { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
              { id: 'reorder', label: 'Reorder', icon: ShoppingCart },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'stock-levels' && renderStockLevels()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'alerts' && renderAlerts()}
        {activeTab === 'reorder' && renderReorder()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default InventoryDashboard;