import React from 'react';
import { Camera, Plus } from 'lucide-react';

export default function Home({ onNavigate }) {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#51331b',
          marginBottom: '10px',
          fontWeight: '700'
        }}>
            EvenShare
        </h1>
        <p style={{
          color: '#666',
          marginBottom: '40px',
          fontSize: '1.1rem'
        }}>
            Snap, split and settle in seconds.
             </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <button
            onClick={() => onNavigate('upload')}
            style={{
              background: 'linear-gradient(135deg, #51331b 0%, #6b4423 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              padding: '25px',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              transition: 'all 0.3s ease',
              boxShadow: '0 5px 15px rgba(81, 51, 27, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(81, 51, 27, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(81, 51, 27, 0.3)';
            }}
          >
            <Camera size={28} />
            Scan Receipt
          </button>

          <button
            onClick={() => onNavigate('billItems')}
            style={{
              background: 'linear-gradient(135deg, #dee6bf 0%, #c8d4a7 100%)',
              color: '#51331b',
              border: 'none',
              borderRadius: '15px',
              padding: '25px',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              transition: 'all 0.3s ease',
              boxShadow: '0 5px 15px rgba(222, 230, 191, 0.5)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(222, 230, 191, 0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(222, 230, 191, 0.5)';
            }}
          >
            <Plus size={28} />
            Add Manually
          </button>
        </div>
      </div>
    </div>
  );
}