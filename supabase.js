import React, { useState, useMemo } from 'react';
import { Search, Download, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase';

export default function TabellaAllievi({ allievi, onRefresh, userRole }) {
  const [ricerca, setRicerca] = useState('');
  const [deleting, setDeleting] = useState(null);

  // Filtra allievi in base alla ricerca
  const allieviFiltrati = useMemo(() => {
    if (!ricerca.trim()) return allievi;

    const q = ricerca.toLowerCase();
    return allievi.filter(a =>
      a.nome?.toLowerCase().includes(q) ||
      a.cognome?.toLowerCase().includes(q) ||
      a.codice_fiscale?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.corso?.toLowerCase().includes(q)
    );
  }, [allievi, ricerca]);

  const handleExportExcel = () => {
    if (allieviFiltrati.length === 0) {
      alert('Nessun allievo da esportare');
      return;
    }

    // Prepara dati per Excel
    const datiExport = allieviFiltrati.map(a => ({
      'Num. Registro': a.num_registro || '',
      'Codice Fiscale': a.codice_fiscale || '',
      'Cognome': a.cognome || '',
      'Nome': a.nome || '',
      'Data Nascita': a.data_nascita || '',
      'Nazione Nascita': a.nazione_nascita || '',
      'Provincia Nascita': a.provincia_nascita || '',
      'Comune Nascita': a.comune_nascita || '',
      'Sesso': a.sesso || '',
      'Cittadinanza': a.cittadinanza || '',
      'Nazione Residenza': a.nazione_residenza || '',
      'Provincia Residenza': a.provincia_residenza || '',
      'Comune Residenza': a.comune_residenza || '',
      'Indirizzo Residenza': a.indirizzo_residenza || '',
      'CAP': a.cap || '',
      'Titolo Studio': a.titolo_studio || '',
      'E-mail': a.email || '',
      'Telefono': a.telefono || '',
      'Profilazione': a.profilazione || '',
      'SAL': a.sal || '',
      'Data Iscrizione': a.data_iscrizione || '',
      'ID Corso': a.id_corso || '',
      'COD. Corso': a.cod_corso || '',
      'Edizione': a.edizione || '',
      'Corso': a.corso || '',
    }));

    // Crea workbook
    const ws = XLSX.utils.json_to_sheet(datiExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Allievi');

    // Esporta
    const fileName = `anagrafica_allievi_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handleDelete = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questo allievo?')) return;

    setDeleting(id);
    try {
      const { error } = await supabase
        .from('allievi')
        .delete()
        .eq('id', id);

      if (error) throw error;
      onRefresh();
    } catch (err) {
      alert('Errore durante l\'eliminazione: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Ricerca */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cerca per nome, cognome, CF, email..."
            value={ricerca}
            onChange={(e) => setRicerca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        {/* Pulsanti */}
        <button
          onClick={handleExportExcel}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 rounded-lg transition-colors font-medium"
        >
          <Download className="w-4 h-4" />
          Esporta Excel
        </button>
      </div>

      {/* Tabella */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden">
        {allieviFiltrati.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            {allievi.length === 0 ? (
              <p>Nessun allievo registrato. Inizia ad aggiungerne uno!</p>
            ) : (
              <p>Nessun risultato corrispondente alla ricerca</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-slate-600/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Nome</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Cognome</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Codice Fiscale</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Telefono</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Corso</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Iscrizione</th>
                  {userRole === 'admin' && (
                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-300">Azioni</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {allieviFiltrati.map((allievo) => (
                  <tr
                    key={allievo.id}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-white">{allievo.nome}</td>
                    <td className="px-4 py-3 text-sm text-white">{allievo.cognome}</td>
                    <td className="px-4 py-3 text-sm text-slate-300 font-mono">{allievo.codice_fiscale}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{allievo.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{allievo.telefono}</td>
                    <td className="px-4 py-3 text-sm text-cyan-300">{allievo.corso}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">
                      {new Date(allievo.data_iscrizione).toLocaleDateString('it-IT')}
                    </td>
                    {userRole === 'admin' && (
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(allievo.id)}
                          disabled={deleting === allievo.id}
                          className="p-1 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Elimina allievo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-700/30 border-t border-slate-600/50 px-4 py-3 text-sm text-slate-400">
          <p>
            Mostrando <span className="text-white font-semibold">{allieviFiltrati.length}</span> di{' '}
            <span className="text-white font-semibold">{allievi.length}</span> allievi
          </p>
        </div>
      </div>
    </div>
  );
}
