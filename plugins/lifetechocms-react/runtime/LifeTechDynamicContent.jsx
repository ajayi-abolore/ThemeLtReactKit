
import { useLayoutEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import views from 'virtual:lifetech-views';

export default function LifeTechDynamicContent() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const source = document.getElementById('lt-dynamic-content');
    const target = containerRef.current;

    if (!source || !target) {
      console.warn(
        'LifeTechOCMS dynamic content container not found.'
      );
      return;
    }

    // Move framework-generated content into the Layout.
    while (source.firstChild) {
      target.appendChild(source.firstChild);
    }

    // Render every React View requested by LifeTechOCMS.
    const roots = [];

    target.querySelectorAll('[data-lt-view]').forEach(element => {
      const viewName = element.dataset.ltView;
      const View = views[viewName];

      if (!View) {
        console.error(
          `LifeTechOCMS React View not found: ${viewName}`
        );
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
