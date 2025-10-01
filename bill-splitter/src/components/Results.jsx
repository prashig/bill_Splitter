import React from 'react';
import { Home, Share2 } from 'lucide-react';

export default function Results({ items, people, tax, tip, splitMode, itemAssignments, onReset }) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const taxAmount = parseFloat(tax || 0);
  const tipAmount = parseFloat(tip || 0);
  const total = subtotal + taxAmount + tipAmount;

  const calculateSplits = () => {
    if (splitMode === 'even') {
      const perPerson = total / people.length;
      return people.map(person => ({
        person,
        amount: perPerson,
        items: []
      }));
    } else {
      const splits = [];
      
      for (const person of people) {
        const assignedItems = items.filter(item => 
          (itemAssignments[item.id] || []).includes(person.id)
        );
        
        let personSubtotal = 0;
        assignedItems.forEach(item => {
          const numAssigned = (itemAssignments[item.id] || []).length;
          personSubtotal += item.price / numAssigned;
        });
        
        const personTax = (personSubtotal / subtotal) * taxAmount;
        const personTip = (personSubtotal / subtotal) * tipAmount;
        const personTotal = personSubtotal + personTax + personTip;
        
        splits.push({
          person,
          amount: personTotal,
          items: assignedItems.map(item => ({
            ...item,
            splitPrice: item.price / (itemAssignments[item.id] || []).length
          }))
        });
      }
      
      return splits;
    }
  };

  const splits = calculateSplits();

  const shareResults = () => {
    let shareText = '💰 Bill Split Results\n\n';
    splits.forEach(split => {
      shareText += `${split.person.name}: $${split.amount.toFixed(2)}\n`;
      if (split.items.length > 0) {
        split.items.forEach(item => {
          shareText += `  • ${item.name}: $${item.splitPrice.toFixed(2)}\n`;
        });
      }
      shareText += '\n';
    });
    shareText += `Total: $${total.toFixed(2)}`;

    if (navigator.share) {
      navigator.share({
        title: 'Bill Split',
        text: shareText
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Results copied to clipboard!');
      });
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{
            fontSize: '2rem',
            color: '#51331b',
            marginBottom: '10px',
            fontWeight: '700'
          }}>
            Split Results
          </h2>
          <p style={{ color: '#666', fontSize: '1rem' }}>
            {splitMode === 'even' ? 'Split evenly' : 'Custom split'}
          </p>
        </div>

        {/* Results */}
        <div style={{ marginBottom: '25px' }}>
          {splits.map(split => (
            <div
              key={split.person.id}
              style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #fff 100%)',
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '15px',
                border: '2px solid #e0e0e0'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: split.items.length > 0 ? '15px' : '0'
              }}>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: '#51331b'
                }}>
                  {split.person.name}
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#51331b'
                }}>
                  ${split.amount.toFixed(2)}
                </div>
              </div>

              {split.items.length > 0 && (
                <div style={{
                  borderTop: '1px solid #e0e0e0',
                  paddingTop: '15px'
                }}>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#666',
                    marginBottom: '10px',
                    fontWeight: '600'
                  }}>
                    Assigned Items:
                  </div>
                  {split.items.map(item => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        fontSize: '0.95rem',
                        color: '#51331b'
                      }}
                    >
                      <span>{item.name}</span>
                      <span style={{ fontWeight: '600' }}>
                        ${item.splitPrice.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Total Summary */}
        <div style={{
          background: 'linear-gradient(135deg, #dee6bf 0%, #d2deeb 100%)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.3rem',
            fontWeight: '700',
            color: '#51331b'
          }}>
            <span>Total Bill</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={shareResults}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #dee6bf 0%, #c8d4a7 100%)',
              color: '#51331b',
              border: 'none',
              borderRadius: '12px',
              padding: '18px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s ease'
            }}
          >
            <Share2 size={20} />
            Share
          </button>

          <button
            onClick={onReset}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #51331b 0%, #6b4423 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '18px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s ease'
            }}
          >
            <Home size={20} />
            New Split
          </button>
        </div>
      </div>
    </div>
  );
}