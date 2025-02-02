(function() {
    const isDebug =
        window.location.hostname === 'localhost' ||
        window.location.search.includes('eruda=true') ||
        localStorage.getItem('eruda') === 'true';

    if (!isDebug) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdmirror.com/npm/eruda';
    script.onload = function() {
        eruda.init({
            // tool: ['console', 'elements'],
            defaults: {
                displaySize: 40
            }
        });
        if (!localStorage.getItem('eruda')) {
            localStorage.setItem('eruda', 'true');
        }
        console.log('[Eruda] Activated.');
        console.log('[Eruda] To deactivate, use:');
        console.log('[Eruda] `localStorage.removeItem("eruda")`');
    };
    script.onerror = function() {
        console.warn('[Eruda] Failure.');
    };
    document.head.appendChild(script);
})();
