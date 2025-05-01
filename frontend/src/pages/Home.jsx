import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { openDB } from 'idb';

export default function Home() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketConnection = io('http://localhost:5000'); // Replace with backend URL
    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const saveSOS = async (message) => {
    const db = await openDB('sos-db', 1, {
      upgrade(db) {
        db.createObjectStore('sos-messages', { keyPath: 'id', autoIncrement: true });
      },
    });
    await db.add('sos-messages', { message });
};

const handleSOS = () => {
    const isOnline = navigator.onLine;
  
    if (isOnline) {
      // Emit to backend if online (already done above)
      socket.emit('sendSOS', { message: 'SOS!', location: 'Sample Location' });
    } else {
      saveSOS('SOS! - Offline');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-700">Disaster Connect</h1>
        <button
          onClick={handleSOS}
          className="mt-5 px-6 py-2 bg-red-500 text-white rounded-full"
        >
          Send SOS
        </button>
      </div>
    </div>
  );
}
