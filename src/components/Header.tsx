'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { HeaderAuth } from './HeaderAuth';

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Faixas', href: '/#faixas' },
    { name: 'Simulados', href: '/quiz' },
    { name: 'Progresso', href: '/progress' },
    { name: 'Perfil', href: '#' },
  ];

  const isLoginPage = pathname === '/login';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b-4 border-black bg-white shadow-sm">
        <div className={`flex h-20 items-center px-6 ${isLoginPage ? 'justify-center' : 'justify-between'}`}>
          <Link href="/" onClick={closeSidebar} className="relative h-16 w-32 hover:scale-105 transition-transform">
            <Image 
              src="/logo.png" 
              alt="WazaHub Logo"
              fill
              className="object-contain"
              priority
            />
          </Link>
          
          {!isLoginPage && (
            <button 
              onClick={toggleSidebar}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              <span className="block h-1 w-6 bg-current"></span>
              <span className="block h-1 w-6 bg-current"></span>
              <span className="block h-1 w-6 bg-current"></span>
            </button>
          )}
        </div>
      </header>

      {/* Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Drawer */}
      <div 
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[80vw] transform border-l-4 border-black bg-white transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-end p-6 border-b-2 border-black">
          <button 
            onClick={closeSidebar}
            className="flex h-10 w-10 items-center justify-center border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col px-6 py-6 flex-1 overflow-y-auto">
          <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-neutral-400">Navegação Principal</h2>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const isPlaceholder = link.href === '#';
            return (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={closeSidebar}
                className={`mb-4 border-l-4 py-3 pl-4 text-2xl font-black uppercase tracking-tighter transition-all hover:bg-neutral-100 ${
                  isActive ? 'border-green-500 text-green-700 bg-neutral-50' : 'border-black text-black'
                } ${isPlaceholder ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {link.name}
                {isPlaceholder && <span className="block text-[10px] tracking-widest mt-1 text-black">Em breve</span>}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-6 border-t-2 border-black mt-auto flex justify-between items-center bg-neutral-50">
           <span className="font-bold text-xs uppercase tracking-widest opacity-60">Sessão Ativa</span>
           <HeaderAuth />
        </div>
      </div>
    </>
  );
}

