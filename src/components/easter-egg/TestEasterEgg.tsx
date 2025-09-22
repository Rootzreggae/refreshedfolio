import React, { useState } from 'react';

export const TestEasterEgg: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <>
      {!isRevealed && (
        <button
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '0 120px 120px 0',
            borderColor: 'transparent #4a4a4a transparent transparent',
            cursor: 'pointer',
            zIndex: 1000,
            background: 'none',
            padding: 0,
            margin: 0,
          }}
          onClick={() => {
            console.log('Button clicked!');
            setIsRevealed(true);
          }}
          aria-label="Reveal easter egg"
        />
      )}

      {isRevealed && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#1a1a1a',
            zIndex: 9999,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
          }}
        >
          <div>
            <h1>Figma Easter Egg Works!</h1>
            <button
              onClick={() => setIsRevealed(false)}
              style={{
                background: 'white',
                color: 'black',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '20px',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};