import React, { useState, useEffect } from 'react';
import { Plus, Calendar, BarChart3 } from 'lucide-react';
import TransactionModal from '../components/TransactionModal';
import TransactionList from '../components/TransactionList';
import SummaryCards from '../components/SummaryCards';
import Filters from '../components/Filters';
import { transactionAPI } from '../utils/api';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summary, setSummary] = useState({});
  const [period, setPeriod] = useState('monthly');
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    division: 'all',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, [period]);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getAll();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await transactionAPI.getSummary(period);
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t.category.toLowerCase() === filters.category);
    }

    if (filters.division !== 'all') {
      filtered = filtered.filter(t => t.division === filters.division);
    }

    if (filters.startDate) {
      filtered = filtered.filter(t => new Date(t.datetime) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(t => new Date(t.datetime) <= new Date(filters.endDate));
    }

    setFilteredTransactions(filtered);
  };

  const handleAddTransaction = async (transaction) => {
    try {
      await transactionAPI.create(transaction);
      fetchTransactions();
      fetchSummary();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await transactionAPI.delete(id);
      fetchTransactions();
      fetchSummary();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEditTransaction = async (transaction) => {
    // For simplicity, we'll just show the modal again
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Money Manager</h1>
            <p className="text-gray-600">Track your income and expenses</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            Add Transaction
          </button>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-4">
            <BarChart3 size={20} />
            <h3 className="text-lg font-semibold">View Period</h3>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="ml-auto p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards summary={summary} />

        {/* Filters */}
        <Filters filters={filters} onFilterChange={setFilters} />

        {/* Transaction List */}
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />

        {/* Transaction Modal */}
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTransaction}
        />
      </div>
    </div>
  );
};

export default Dashboard;