// bluetooth.js
export const startBluetoothScan = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['battery_service'] }]  // Example: replace with your custom services
      });
  
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('battery_service'); // Replace with your custom service
      const characteristic = await service.getCharacteristic('battery_level'); // Example characteristic
  
      // Use the characteristic to read/write messages
      const value = await characteristic.readValue();
      console.log('Received value:', value);
    } catch (error) {
      console.error('Bluetooth Error:', error);
    }
  };
  
  export const sendSOSOverBluetooth = async (message) => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['battery_service'] }]  // Example: replace with your custom services
      });
  
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('battery_service'); // Replace with your custom service
      const characteristic = await service.getCharacteristic('battery_level'); // Example characteristic
  
      // Write the SOS message
      const encoder = new TextEncoder();
      const messageBuffer = encoder.encode(message);
      await characteristic.writeValue(messageBuffer);
  
      console.log('SOS message sent!');
    } catch (error) {
      console.error('Error sending SOS:', error);
    }
  };
  