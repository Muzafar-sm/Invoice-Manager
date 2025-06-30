import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';

interface Client {
  _id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  clientId: string;
  items: InvoiceItem[];
  dueDate: string;
  notes: string;
  taxPercent: number;
  discount: number;
  discountType: 'percent' | 'fixed';
  status: string;
  currency: 'USD' | 'JPY' | 'AED' | 'INR';
}
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const InvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const location = useLocation();

  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState<InvoiceData>({
    clientId: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    dueDate: '',
    notes: '',
    taxPercent: 0,
    discount: 0,
    discountType: 'percent',
    status: 'draft',
    currency: 'USD',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const [autoDownload, setAutoDownload] = useState(false);

  const isInvoiceLoaded = isEdit
    ? formData.clientId && formData.items.length > 0 && formData.dueDate
    : true;

  useEffect(() => {
    fetchClients();
    if (isEdit) {
      fetchInvoice();
    } else {
      // Set default due date to 30 days from now
      const date = new Date();
      date.setDate(date.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        dueDate: date.toISOString().split('T')[0],
      }));
    }
    // Check for ?download=1
    if (location.search.includes('download=1')) {
      setAutoDownload(true);
    }
  }, [id, isEdit, location.search]);

  useEffect(() => {
    if (autoDownload && isInvoiceLoaded) {
      handleDownloadPDF();
      setAutoDownload(false); // Prevent repeated downloads
    }
    // eslint-disable-next-line
  }, [autoDownload, isInvoiceLoaded]);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/clients`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchInvoice = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/invoices/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const invoice = await response.json();
        setFormData({
          clientId: typeof invoice.clientId === 'object' ? invoice.clientId._id : invoice.clientId,
          items: invoice.items,
          dueDate: new Date(invoice.dueDate).toISOString().split('T')[0],
          notes: invoice.notes || '',
          taxPercent: invoice.taxPercent || 0,
          discount: invoice.discount || 0,
          discountType: invoice.discountType || 'percent',
          status: invoice.status || 'draft',
          currency: invoice.currency || 'USD',
        });
        setLogo(invoice.logo || null);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Calculate amount when quantity or rate changes
    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
    }

    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * (formData.taxPercent || 0)) / 100;
  };

  const calculateDiscount = () => {
    if (formData.discountType === 'percent') {
      return (calculateSubtotal() * (formData.discount || 0)) / 100;
    } else {
      return formData.discount || 0;
    }
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate that at least one item has content
    const hasValidItems = formData.items.some(item => 
      item.description.trim() && item.quantity > 0 && item.rate > 0
    );

    if (!hasValidItems) {
      setError('Please add at least one valid item with description, quantity, and rate.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = isEdit ? `${API_BASE}/invoices/${id}` : `${API_BASE}/invoices`;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, logo }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save invoice');
      }

      navigate('/invoices');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formData.currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Drag and drop handlers for logo upload
  const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // PDF Generation
  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    const margin = 15;
    let y = margin;

    // Add logo if present
    if (logo) {
      // Place logo at top right
      //const imgProps = (doc as any).getImageProperties ? (doc as any).getImageProperties(logo) : null;
      const imgWidth = 40;
      const imgHeight = 20;
      doc.addImage(logo, 'PNG', 180 - imgWidth, y, imgWidth, imgHeight);
    }

    // Invoice Title
    doc.setFontSize(18);
    doc.text('Invoice', margin, y + 10);
    y += 20;

    // Client Info
    const client = clients.find(c => c._id === formData.clientId);
    if (client) {
      doc.setFontSize(12);
      doc.text(`Client: ${client.name}`, margin, y);
      if (client.company) doc.text(`Company: ${client.company}`, margin, y + 7);
      if (client.email) doc.text(`Email: ${client.email}`, margin, y + 14);
      if (client.phone) doc.text(`Phone: ${client.phone}`, margin, y + 21);
      if (client.address) doc.text(`Address: ${client.address}`, margin, y + 28);
      y += 35;
    }

    // Invoice Items Table
    doc.setFontSize(12);
    doc.text('Items:', margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.text('Description', margin, y);
    doc.text('Qty', margin + 60, y);
    doc.text('Rate', margin + 80, y);
    doc.text('Amount', margin + 110, y);
    y += 5;
    formData.items.forEach(item => {
      doc.text(item.description, margin, y);
      doc.text(item.quantity.toString(), margin + 60, y);
      doc.text(item.rate.toFixed(2), margin + 80, y);
      doc.text(item.amount.toFixed(2), margin + 110, y);
      y += 7;
    });
    y += 5;
    doc.text(`Subtotal: ${formatCurrency(calculateSubtotal())}`, margin, y);
    y += 7;
    doc.text(`Tax (${formData.taxPercent}%): ${formatCurrency(calculateTax())}`, margin, y);
    y += 7;
    doc.text(`Discount: -${formatCurrency(calculateDiscount())}`, margin, y);
    y += 7;
    doc.text(`Total: ${formatCurrency(calculateTotal())}`, margin, y);
    y += 10;
    if (formData.notes) {
      doc.text('Notes:', margin, y);
      y += 7;
      doc.text(formData.notes, margin, y);
    }
    doc.save('invoice.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/invoices')}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Edit Invoice' : 'Create Invoice'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit ? 'Update invoice details' : 'Create a new invoice for your client'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Invoice Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-2">
                Client
              </label>
              <select
                id="clientId"
                required
                value={formData.clientId}
                onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name} {client.company && `(${client.company})`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                required
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="md:col-span-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Item description"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder='0.00'
                    value={item.rate === 0 ? "" : item.rate}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleItemChange(index, 'rate', value === "" ? 0 : parseFloat(value));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="text"
                    value={formatCurrency(item.amount)}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>

                <div className="md:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={formData.items.length === 1}
                    className="p-2 text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals and Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes or payment terms..."
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between items-center">
                <label htmlFor="taxPercent" className="text-gray-600">Tax %:</label>
                <input
                  type="number"
                  id="taxPercent"
                  min="0"
                  placeholder='0.00'
                  max="100"
                  step="0.01"
                  value={formData.taxPercent === 0 ? "" : formData.taxPercent}
                  onChange={(e)=>{
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, taxPercent: value === "" ? 0 : parseFloat(value) }));
                  }}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-gray-600">Discount:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder='0.00'
                    value={formData.discount === 0 ? "" : formData.discount}
                    onChange={
                      (e) => {
                        const value = e.target.value;
                        setFormData(prev => ({ ...prev, discount: value === "" ? 0 : parseFloat(value) }));
                      }
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={formData.discountType}
                    onChange={e => setFormData(prev => ({ ...prev, discountType: e.target.value as 'percent' | 'fixed' }))}
                    className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="percent">%</option>
                    <option value="fixed">{formData.currency}</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
  <label className="text-gray-600">Currency:</label>
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {['USD', 'JPY', 'AED', 'INR'].map(currency => {
      const currencyLabelMap: Record<string, string> = {
        USD: 'US Dollar ($)',
        JPY: 'Yen (¥)',
        AED: 'Dirham (د.إ)',
        INR: 'Rupee (₹)'
      };

      const isSelected = formData.currency === currency;

      return (
        <button
          key={currency}
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, currency: currency as 'USD' | 'JPY' | 'AED' | 'INR' }))}
          className={`px-4 py-2 rounded border text-sm font-medium
            ${isSelected ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}
            hover:shadow-md transition duration-150 ease-in-out`}
        >
          {currencyLabelMap[currency]}
        </button>
      );
    })}
  </div>
</div>
  <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span>{formatCurrency(calculateTax())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount:</span>
                <span>-{formatCurrency(calculateDiscount())}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded p-4 flex flex-col items-center justify-center mb-4 cursor-pointer hover:border-blue-400"
          onDrop={handleLogoDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('logo-upload-input')?.click()}
          style={{ minHeight: 100 }}
        >
          {logo ? (
            <img src={logo} alt="Logo Preview" style={{ maxHeight: 60, maxWidth: 120, objectFit: 'contain' }} />
          ) : (
            <span className="text-gray-400">Drag & drop a logo here, or click to select</span>
          )}
          <input
            id="logo-upload-input"
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* Download PDF Button */}
        <button
          type="button"
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        >
          Download PDF
        </button>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Invoice' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;