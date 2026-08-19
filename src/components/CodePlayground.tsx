'use client';

import React, { useState } from 'react';

export default function CodePlayground() {
  const [lang, setLang] = useState<'html' | 'python'>('html');
  
  const [htmlCode, setHtmlCode] = useState(
    `<div style="text-align: center; font-family: sans-serif; padding: 20px;">\n  <h2 style="color: #e2c085;">Halo dari HTML!</h2>\n  <p>Coba ganti teks ini atau tambahkan tombol!</p>\n  <button onclick="alert('Mantap!')" style="padding: 8px 16px; border-radius: 8px; cursor: pointer;">Klik Saya</button>\n</div>`
  );
  
  const [pythonCode, setPythonCode] = useState(
    `print("Halo dari Python!")\n\nfor i in range(1, 6):\n    print(f"Bintang ke-{i}: {'★' * i}")`
  );

  const [outputHtml, setOutputHtml] = useState(htmlCode);
  const [pythonOutput, setPythonOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async () => {
    if (lang === 'html') {
      setOutputHtml(htmlCode);
    } else {
      setIsLoading(true);
      setPythonOutput('Running Python via Pyodide...');
      try {
        // Load Pyodide script dynamically via CDN
        if (!(window as any).loadPyodide) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
          document.body.appendChild(script);
          await new Promise((resolve) => (script.onload = resolve));
        }

        const pyodide = await (window as any).loadPyodide();
        
        // Redirect stdout Python to JS string
        pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
        `);
        
        await pyodide.runPythonAsync(pythonCode);
        const stdout = pyodide.runPython('sys.stdout.getvalue()');
        setPythonOutput(stdout || '(Program selesai tanpa output)');
      } catch (err: any) {
        setPythonOutput(`Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full bg-[#0c0c0e] border border-border rounded-2xl overflow-hidden font-sans shadow-2xl">
      {/* Header Bar */}
      <div className="bg-[#18181b] px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          {/* Tab Switcher */}
          <div className="flex bg-muted p-1 rounded-lg border border-border text-xs">
            <button
              onClick={() => setLang('html')}
              className={`px-3 py-1 rounded-md transition-all ${lang === 'html' ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              HTML & CSS
            </button>
            <button
              onClick={() => setLang('python')}
              className={`px-3 py-1 rounded-md transition-all ${lang === 'python' ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Python
            </button>
          </div>
        </div>

        <button
          onClick={handleRun}
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-lg disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? 'Executing...' : '▶ Run Code'}
        </button>
      </div>

      {/* Editor & Output Section (Side by Side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border h-[420px]">
        {/* Left: Input Textarea */}
        <div className="p-4 flex flex-col h-full bg-[#0c0c0e]">
          <span className="mono-label text-xs text-muted-foreground mb-2">CODE EDITOR ({lang.toUpperCase()})</span>
          <textarea
            value={lang === 'html' ? htmlCode : pythonCode}
            onChange={(e) => (lang === 'html' ? setHtmlCode(e.target.value) : setPythonCode(e.target.value))}
            className="w-full flex-1 bg-transparent font-mono text-sm text-foreground outline-none resize-none leading-relaxed p-2 rounded-lg bg-muted/20 border border-border/50 focus:border-primary/50"
            spellCheck={false}
          />
        </div>

        {/* Right: Preview Output */}
        <div className="p-4 flex flex-col h-full bg-[#111115]">
          <span className="mono-label text-xs text-muted-foreground mb-2">OUTPUT PREVIEW</span>
          
          <div className="flex-1 w-full rounded-lg bg-white/5 border border-border/50 overflow-hidden">
            {lang === 'html' ? (
              <iframe
                srcDoc={outputHtml}
                title="Output Preview"
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts"
              />
            ) : (
              <pre className="p-4 font-mono text-sm text-emerald-400 whitespace-pre-wrap h-full overflow-y-auto">
                {pythonOutput || 'Klik "Run Code" untuk menjalankan program Python...'}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}