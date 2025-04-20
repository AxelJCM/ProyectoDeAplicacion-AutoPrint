// src/components/Status.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Status() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/status')
      .then(response => setStatus(response.data));
  }, []);

  return (
    <div>
      {status ? `Versión: ${status.version}` : 'Cargando...'}
    </div>
  );
}