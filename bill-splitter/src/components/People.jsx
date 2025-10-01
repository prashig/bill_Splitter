import React, { useState } from 'react';
import { Plus, X, ArrowLeft } from 'lucide-react';

export default function People({ 
  items, 
  people, 
  setPeople, 
  splitMode, 
  setSplitMode,
  itemAssignments,
  setItemAssignments,
  tax,
  tip,
  onNavigate,
  onBack 
}) {
  const [personName, setPersonName] = useState('');

  const addPerson = () => {
    if (personName.trim()) {
      setPeople([...people, {
        id: Date.now(),
        name: personName.trim()
      }]);
      setPersonName('');
    }
  };

  const removePerson = (id) => {
    setPeople(people.filter(p => p.id !== id));
    const newAssignments = { ...itemAssignments };
    Object.keys(newAssignments).forEach(itemId => {
      newAssignments[itemId] = newAssignments[itemId].filter(personId => personId !== id);
    });
    setItemAssignments(newAssignments);
  };

  const toggleItemAssignment = (itemId, personId) => {
    const currentAssignments = itemAssignments[itemId] || [];
    const newAssignments = { ...itemAssignments };
    
    if (currentAssignments.includes(personId)) {
      newAssignments[itemId] = currentAssignments.filter(id => id !== personId);
    } else {
      newAssignments[itemId] = [...currentAssignments, personId];
    }
    
    setItemAssignments(newAssignments);
  };

  const canProceed = people.length > 0 && (
    splitMode === 'even' || 
    (splitMode === 'custom' && Object.values(itemAssignments).some(arr => arr.length > 0))
  );

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
            Add People
          </h2>
        </div>

        {/* Add Person Form */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Person's name"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPerson()}
              style={{
                flex: 1,
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <button
              onClick={addPerson}
              style={{
                background: 'linear-gradient(135deg, #51331b 0%, #6b4423 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* People List */}
        <div style={{ marginBottom: '25px' }}>
          {people.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', padding: '30px 0' }}>
              No people added yet
            </p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {people.map(person => (
                <div
                  key={person.id}
                  style={{
                    background: 'linear-gradient(135deg, #dee6bf 0%, #d2deeb 100%)',
                    padding: '10px 15px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: '600',
                    color: '#51331b'
                  }}
                >
                  {person.name}
                  <button
                    onClick={() => removePerson(person.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#dc3545'
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Split Mode Selection */}
        {people.length > 0 && (
          <>
            <div style={{
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '25px'
            }}>
              <label style={{ display: 'block', marginBottom: '15px', color: '#51331b', fontWeight: '700', fontSize: '1.1rem' }}>
                Split Mode
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSplitMode('even')}
                  style={{
                    flex: 1,
                    padding: '15px',
                    border: splitMode === 'even' ? '3px solid #51331b' : '2px solid #e0e0e0',
                    borderRadius: '10px',
                    background: splitMode === 'even' ? '#fff5e6' : 'white',
                    color: '#51331b',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Even Split
                </button>
                <button
                  onClick={() => setSplitMode('custom')}
                  style={{
                    flex: 1,
                    padding: '15px',
                    border: splitMode === 'custom' ? '3px solid #51331b' : '2px solid #e0e0e0',
                    borderRadius: '10px',
                    background: splitMode === 'custom' ? '#fff5e6' : 'white',
                    color: '#51331b',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Custom Split
                </button>
              </div>
            </div>

            {/* Custom Split Item Assignment */}
            {splitMode === 'custom' && (
              <div style={{
                background: '#f8f9fa',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '25px'
              }}>
                <h3 style={{ marginBottom: '20px', color: '#51331b', fontWeight: '700' }}>
                  Assign Items
                </h3>
                {items.map(item => (
                  <div
                    key={item.id}
                    style={{
                      background: 'white',
                      borderRadius: '10px',
                      padding: '15px',
                      marginBottom: '15px'
                    }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontWeight: '600', color: '#51331b', fontSize: '1.05rem' }}>
                        {item.name}
                      </div>
                      <div style={{ color: '#666', fontSize: '0.9rem' }}>
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {people.map(person => (
                        <label
                          key={person.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 12px',
                            background: (itemAssignments[item.id] || []).includes(person.id)
                              ? 'linear-gradient(135deg, #dee6bf 0%, #d2deeb 100%)'
                              : '#f8f9fa',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: (itemAssignments[item.id] || []).includes(person.id)
                              ? '2px solid #51331b'
                              : '2px solid transparent'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={(itemAssignments[item.id] || []).includes(person.id)}
                            onChange={() => toggleItemAssignment(item.id, person.id)}
                            style={{ cursor: 'pointer' }}
                          />
                          <span style={{ fontSize: '0.95rem', color: '#51331b', fontWeight: '600' }}>
                            {person.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Calculate Button */}
        <button
          onClick={() => canProceed && onNavigate('results')}
          disabled={!canProceed}
          style={{
            width: '100%',
            background: !canProceed 
              ? '#ccc' 
              : 'linear-gradient(135deg, #51331b 0%, #6b4423 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '18px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: !canProceed ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Calculate Split
        </button>
      </div>
    </div>
  );
};
