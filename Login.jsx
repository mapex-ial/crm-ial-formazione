import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, Plus, Users, BookOpen, Calendar } from 'lucide-react';
import ModalAggiungiAllievo from './ModalAggiungiAllievo';
import TabellaAllievi from './TabellaAllievi';

export default function Dashboard({ user, userRole }) {
  const [allievi, setAllievi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    totalAllievi: 0,
    corsiAttivi: 0,
    ultimoIngresso: null,
  });

  // Carica gli allievi da Supabase
  useEffect(() => {
    caricaAllievi();
  }, []);

  const caricaAllievi = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('allievi')
        .select('*')
        .order('data_iscrizione', { ascending: false });

      if (error) throw error;

      setAllievi(data || []);

      // Calcola statistiche
      if (data && data.length > 0) {
        const corsi = new Set(data.map(a => a.id_corso)).size;
        setStats({
          totalAllievi: data.length,
          corsiAttivi: corsi,
          ultimoIngresso: data[0]?.data_iscrizione || null,
        });
      }
    } catch (error) {
      console.error('Errore caricamento allievi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleAllievoAggiunto = () => {
    setShowModal(false);
    caricaAllievi();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CRM IAL</h1>
              <p className="text-xs text-slate-400">Gestione Iscrizioni</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-white font-medium">{user?.email}</p>
              <p className="text-xs text-slate-400">
                {userRole === 'admin' ? '👑 Amministratore' : '👤 Operatore'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-300 hover:text-white"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Allievi */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 hover:border-cyan-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 text-cyan-400" />
              <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded">Totale</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalAllievi}</p>
            <p className="text-sm text-slate-400 mt-1">Allievi Iscritti</p>
          </div>

          {/* Corsi Attivi */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 hover:border-blue-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">Attivi</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.corsiAttivi}</p>
            <p className="text-sm text-slate-400 mt-1">Corsi Attivi</p>
          </div>

          {/* Ultimo Ingresso */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-6 h-6 text-emerald-400" />
              <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded">Recente</span>
            </div>
            <p className="text-lg font-bold text-white">
              {stats.ultimoIngresso 
                ? new Date(stats.ultimoIngresso).toLocaleDateString('it-IT')
                : '-'
              }
            </p>
            <p className="text-sm text-slate-400 mt-1">Ultimo Ingresso</p>
          </div>
        </div>

        {/* Azioni e Tabella */}
        <div className="space-y-6">
          {/* Bottone Aggiungi Allievo */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Aggiungi Allievo
          </button>

          {/* Tabella Allievi */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500 border-opacity-50 border-t-opacity-100 mx-auto mb-4"></div>
              <p className="text-slate-400">Caricamento dati...</p>
            </div>
          ) : (
            <TabellaAllievi 
              allievi={allievi} 
              onRefresh={caricaAllievi}
              userRole={userRole}
            />
          )}
        </div>
      </main>

      {/* Modal Aggiungi Allievo */}
      {showModal && (
        <ModalAggiungiAllievo
          onClose={() => setShowModal(false)}
          onSuccess={handleAllievoAggiunto}
        />
      )}
    </div>
  );
}
