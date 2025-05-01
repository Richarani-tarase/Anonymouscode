import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');  // Connect to backend

function App() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState({ lat: 0, lon: 0 });

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
    
    // Listen for SOS status updates from the backend
    socket.on('sosStatus', (data) => {
      setStatus(data.status);
    });

    return () => {
      socket.off('sosStatus');
    };
  }, []);

  const handleSOSClick = () => {
    const sosData = {
      message: message || 'Help! I need assistance!',
      location: location,
    };
    socket.emit('sendSOS', sosData);  // Send SOS to backend
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md max-w-sm w-full">
        <h1 className="text-xl font-bold mb-4">Disaster Communication</h1>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="mb-4">
          <p>Location: {location.lat}, {location.lon}</p>
        </div>
        <button
          onClick={handleSOSClick}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Send SOS
        </button>
        {status && <p className="mt-4 text-center text-lg">{status}</p>}
      </div>
    </div>
  );
}

export default App;
