
import { useLayoutEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const views = import.meta.glob('../Views/*.jsx', {
  eager: true
});

export default function LifeTechDynamicContent() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const source = document.getElementById('lt-dynamic-content');
    const target = containerRef.current;

    if (!source || !target) return;

    // Move LifeTechOCMS dynamic content into the layout.
    while (source.firstChild) {
      target.appendChild(source.firstChild);
    }

    // Find React View placeholders.
    const placeholders = target.querySelectorAll('[data-lt-view]');

    const roots = [];

    placeholders.forEach(element => {
      const viewName = element.dataset.ltView;
      const View = views[`../Views/${viewName}.jsx`]?.default;

      if (!View) {
        console.error(`React View not found: ${viewName}`);
        return;
      }

      const root = createRoot(element);
      root.render(<View />);
      roots.push(root);
    });

    return () => {
      roots.forEach(root => root.unmount());
    };
  }, []);

  return <div ref={containerRef} />;
}
