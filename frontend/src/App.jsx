import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({ name: '', quantity: '', expiryDate: '', batchNumber: '' });

  const fetchData = async () => {
    const res = await axios.get('http://localhost:4000/medicines');
    setMedicines(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    await axios.post('http://localhost:4000/medicines', form);
    setForm({ name: '', quantity: '', expiryDate: '', batchNumber: '' });
    fetchData();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/medicines/${id}`);
    fetchData();
  };

  const isNearExpiry = (date) => {
    const diff = new Date(date) - new Date();
    return diff < 1000 * 60 * 60 * 24 * 30; // < 30 days
  };

  return (
    <div className="bg:white">
      <h1>Pharmacy Inventory</h1>
      <input
        placeholder="Medicine Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={form.quantity}
        onChange={e => setForm({ ...form, quantity: e.target.value })}
      />
      <input
        type="date"
        value={form.expiryDate}
        onChange={e => setForm({ ...form, expiryDate: e.target.value })}
      />
      <input
        placeholder="Batch No"
        value={form.batchNumber}
        onChange={e => setForm({ ...form, batchNumber: e.target.value })}
      />
      <button onClick={handleAdd}>Add Medicine</button>

      <h2>Inventory</h2>
      <ul>
        {medicines.map(med => (
          <li key={med._id} style={{ color: new Date(med.expiryDate) < new Date() ? 'red' : isNearExpiry(med.expiryDate) ? 'orange' : 'black' }}>
            {med.name} - Qty: {med.quantity} - Expires: {med.expiryDate.split('T')[0]} - Batch: {med.batchNumber}
            <button onClick={() => handleDelete(med._id)} style={{ marginLeft: 10 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
