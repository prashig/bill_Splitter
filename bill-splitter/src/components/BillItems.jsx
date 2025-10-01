import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

export default function BillItems({ items, setItems, tax, setTax, tip, setTip, onNavigate, onBack }) {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const addItem = () => {
    if (itemName.trim() && itemPrice && parseFloat(itemPrice) > 0) {
      setItems([...items, {
        id: Date.now(),
        name: itemName.trim(),
        price: parseFloat(itemPrice)
      }]);
      setItemName('');
      setItemPrice('');
    }
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + parseFloat(tax || 0) + parseFloat(tip || 0);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              color: '#51331b'
            }}
          >
            <ArrowLeft size={24} />
          </button>
          <h2 style={{
            fontSize: '1.8rem',
            color: '#51331b',
            margin: '0 0 0 15px',
            fontWeight: '700'
          }}>
            Bill Items
          </h2>
        </div>

        {/* Add Item Form */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              style={{
                flex: 1,
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <input
              type="number"
              placeholder="Price"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              step="0.01"
              style={{
                width: '100px',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>
          <button
            onClick={addItem}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #51331b 0%, #6b4423 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>

        {/* Items List */}
        <div style={{ marginBottom: '25px' }}>
          {items.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', padding: '30px 0' }}>
              No items added yet
            </p>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  background: '#f8f9fa',
                  borderRadius: '10px',
                  marginBottom: '10px'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#51331b', fontSize: '1.1rem' }}>
                    {item.name}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.95rem' }}>
                    ${item.price.toFixed(2)}
                  </div>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    color: '#dc3545',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Tax and Tip */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#51331b', fontWeight: '600' }}>
              Tax ($)
            </label>
            <input
              type="number"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
              step="0.01"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#51331b', fontWeight: '600' }}>
              Tip ($)
            </label>
            <input
              type="number"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              step="0.01"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Summary */}
        <div style={{
          background: 'linear-gradient(135deg, #dee6bf 0%, #d2deeb 100%)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#51331b', fontWeight: '600' }}>Subtotal:</span>
            <span style={{ color: '#51331b', fontWeight: '600' }}>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#51331b' }}>Tax:</span>
            <span style={{ color: '#51331b' }}>${parseFloat(tax || 0).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{ color: '#51331b' }}>Tip:</span>
            <span style={{ color: '#51331b' }}>${parseFloat(tip || 0).toFixed(2)}</span>
          </div>
          <div style={{
            borderTop: '2px solid #51331b',
            paddingTop: '15px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span style={{ color: '#51331b', fontWeight: '700', fontSize: '1.2rem' }}>Total:</span>
            <span style={{ color: '#51331b', fontWeight: '700', fontSize: '1.2rem' }}>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => items.length > 0 && onNavigate('people')}
          disabled={items.length === 0}
          style={{
            width: '100%',
            background: items.length === 0 
              ? '#ccc' 
              : 'linear-gradient(135deg, #51331b 0%, #6b4423 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '18px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: items.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Continue to People
        </button>
      </div>
    </div>
  );
}