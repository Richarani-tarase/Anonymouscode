import React, { useState } from 'react';
import { addMessage } from './db';
import { sendSOSOverBluetooth } from './bluetooth';

const SOSButton = () => {
  const [status, setStatus] = useState('Click SOS');

  const handleSOS = async () => {
    const timestamp = new Date().toISOString();
    const message = {
      timestamp,
      latitude: 40.7128,  // Mock coordinates for now
      longitude: -74.0060,
      text: 'I need help',
      status: 'URGENT',
    };

    // Add the message to IndexedDB for offline storage
    await addMessage(message);
    setStatus('SOS Sent!');

    // Send the SOS message over Bluetooth
    await sendSOSOverBluetooth(JSON.stringify(message));
  };

  return (
    <div>
      <button onClick={handleSOS}>{status}</button>
    </div>
  );
};

export default SOSButton;
