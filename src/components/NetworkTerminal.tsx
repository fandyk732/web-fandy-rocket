'use client';

import React, { useState, useRef, useEffect } from 'react';

interface CommandLog {
  text: string;
  type: 'input' | 'output' | 'error' | 'system';
}

export default function NetworkTerminal() {
  const [history, setHistory] = useState<CommandLog[]>([
    { text: 'RouterOS v1.0.0 (Interaktif Lab Terminal)', type: 'system' },
    { text: 'Ketik "help" untuk melihat daftar perintah yang tersedia.', type: 'system' },
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'user' | 'priv' | 'config' | 'int'>('user');
  const [interfaceName, setInterfaceName] = useState('g0/0');
  const [hostname, setHostname] = useState('Router');
  const [ipConfig, setIpConfig] = useState<Record<string, string>>({
    'g0/0': 'unassigned',
    'g0/1': 'unassigned',
  });

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Prompt generator berdasarkan mode
  const getPrompt = () => {
    switch (mode) {
      case 'user': return `${hostname}>`;
      case 'priv': return `${hostname}#`;
      case 'config': return `${hostname}(config)#`;
      case 'int': return `${hostname}(config-if)#`;
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const newLogs: CommandLog[] = [...history, { text: `${getPrompt()} ${input}`, type: 'input' }];
    const lowerCmd = cmd.toLowerCase();

    // System Commands
    if (lowerCmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    if (lowerCmd === 'help') {
      newLogs.push({
        text: `Daftar Perintah:
  - enable / exit / end : Perpindahan mode CLI
  - configure terminal  : Masuk ke global config
  - interface <name>    : Pilih interface (contoh: interface g0/0)
  - ip address <ip> <mask>: Set IP interface
  - show ip interface brief : Cek status IP interface
  - ping <ip>           : Tes koneksi
  - hostname <name>     : Ganti nama router
  - clear               : Bersihkan layar`,
        type: 'output',
      });
    } 
    // Navigation Mode
    else if (lowerCmd === 'enable' && mode === 'user') {
      setMode('priv');
    } else if (lowerCmd === 'configure terminal' || lowerCmd === 'conf t') {
      if (mode === 'priv') setMode('config');
      else newLogs.push({ text: '% Invalid input detected at "^" marker.', type: 'error' });
    } else if (lowerCmd.startsWith('interface ') || lowerCmd.startsWith('int ')) {
      if (mode === 'config') {
        const name = cmd.split(' ')[1];
        setInterfaceName(name);
        setMode('int');
      } else {
        newLogs.push({ text: '% Invalid command for current mode.', type: 'error' });
      }
    } else if (lowerCmd === 'exit') {
      if (mode === 'int') setMode('config');
      else if (mode === 'config') setMode('priv');
      else if (mode === 'priv') setMode('user');
    } else if (lowerCmd === 'end') {
      if (mode === 'config' || mode === 'int') setMode('priv');
    } 
    // Actions
    else if (lowerCmd.startsWith('hostname ')) {
      if (mode === 'config') {
        setHostname(cmd.split(' ')[1] || 'Router');
      } else {
        newLogs.push({ text: '% Error: Must be in config mode.', type: 'error' });
      }
    } else if (lowerCmd.startsWith('ip address ') || lowerCmd.startsWith('ip add ')) {
      if (mode === 'int') {
        const parts = cmd.split(' ');
        if (parts.length >= 4) {
          const ip = `${parts[2]} ${parts[3]}`;
          setIpConfig((prev) => ({ ...prev, [interfaceName]: ip }));
          newLogs.push({ text: `% Interface ${interfaceName} assigned IP ${ip}`, type: 'output' });
        } else {
          newLogs.push({ text: '% Incomplete command. Format: ip address <ip> <mask>', type: 'error' });
        }
      } else {
        newLogs.push({ text: '% Error: Must be in interface mode (config-if).', type: 'error' });
      }
    } else if (lowerCmd === 'show ip interface brief' || lowerCmd === 'sh ip int br') {
      if (mode === 'priv' || mode === 'config' || mode === 'int') {
        let output = 'Interface          IP-Address      OK? Status\n';
        Object.entries(ipConfig).forEach(([iface, ip]) => {
          output += `${iface.padEnd(18)} ${ip.padEnd(15)} YES up/up\n`;
        });
        newLogs.push({ text: output.trim(), type: 'output' });
      } else {
        newLogs.push({ text: '% Command only allowed in privileged mode.', type: 'error' });
      }
    } else if (lowerCmd.startsWith('ping ')) {
      const target = cmd.split(' ')[1];
      newLogs.push({
        text: `Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to ${target}, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms`,
        type: 'output',
      });
    } else {
      newLogs.push({ text: `% Unknown command or incomplete syntax: "${cmd}"`, type: 'error' });
    }

    setHistory(newLogs);
    setInput('');
  };

  return (
    <div className="w-full bg-[#0c0c0e] border border-border rounded-2xl overflow-hidden font-mono text-sm shadow-2xl">
      {/* Top Bar Header */}
      <div className="bg-[#18181b] px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-muted-foreground font-sans font-semibold">
            Cisco IOS CLI Simulator — interactive
          </span>
        </div>
        <span className="text-xs text-primary/80 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
          Mode: {mode.toUpperCase()}
        </span>
      </div>

      {/* Terminal Area */}
      <div className="p-4 sm:p-6 h-[400px] overflow-y-auto space-y-2">
        {history.map((log, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">
            {log.type === 'input' && <span className="text-primary font-bold">{log.text}</span>}
            {log.type === 'system' && <span className="text-muted-foreground italic">{log.text}</span>}
            {log.type === 'output' && <span className="text-emerald-400">{log.text}</span>}
            {log.type === 'error' && <span className="text-rose-400">{log.text}</span>}
          </div>
        ))}

        {/* Input Line */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 pt-1">
          <span className="text-primary font-bold shrink-0">{getPrompt()}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-foreground outline-none border-none p-0 focus:ring-0"
            autoFocus
            spellCheck={false}
          />
        </form>
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}