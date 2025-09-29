import React from 'react';

const Preview = React.forwardRef(({ code, isDragging }, ref) => {
  const generateHTML = (userCode) => {
    return `
      <html>
      <head>
          <style>
              body { margin: 0; overflow: hidden; }
          </style>
      </head>
      <body>
          <script type="importmap">
          {
              "imports": {
                  "three": "https://unpkg.com/three@0.157.0/build/three.module.js",
                  "three/addons/": "https://unpkg.com/three@0.157.0/examples/jsm/"
              }
          }
          </script>
          <script type="module">
              ${userCode}
          </script>
      </body>
      </html>
    `;
  };

  const htmlContent = generateHTML(code);
  const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);

  return (
    <iframe
      id="preview-frame"
      ref={ref} // Attach the ref here
      src={dataUrl}
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