window.MathJax = {
  loader: {load: ['[tex]/mhchem'],debug: true},
  tex: {
    inlineMath: [ ["\\(","\\)"] ],
    displayMath: [ ["\\[","\\]"] ],
    processEscapes: true,
    processEnvironments: true,
    packages: {'[+]': ['mhchem']}
  },
  options: {
    ignoreHtmlClass: ".*",
    processHtmlClass: "arithmatex"
  }
};
