import React from 'react';

const Preview = React.forwardRef(({ isDragging }, ref) => {

  return (
    <iframe
      id="preview-frame"
      ref={ref} // Attach the ref here
      src="/preview.html"
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        backgroundColor: '#282828',
        pointerEvents: isDragging ? 'none' : 'auto',
      }}
      title="Three.js Preview"
    />
  );
});

export default Preview;
