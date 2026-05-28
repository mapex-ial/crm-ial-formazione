import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, Upload, Camera, Check, AlertCircle } from 'lucide-react';
import { Loader } from './Loader';
import OcrFotoDocumento from './OcrFotoDocumento';

const CAMPI_FORM = [
  { key: 'num_registro', label: 'Num. Registro', type: 'text', required: false },
  { key: 'codice_fiscale', label: 'Codice Fiscale', type: 'text', required: true },
  { key: 'cognome', label: 'Cognome', type: 'text', required: true },
  { key: 'nome', label: 'Nome', type: 'text', required: true },
  { key: 'data_nascita', label: 'Data Nascita', type: 'date', required: true },
  { key: 'nazione_nascita', label: 'Nazione Nascita', type: 'text', required: false },
  { key: 'provincia_nascita', label: 'Provincia Nascita', type: 'text', required: false },
  { key: 'comune_nascita', label: 'Comune Nascita', type: 'text', required: false },
  { key: 'sesso', label: 'Sesso', type: 'select', options: ['M', 'F'], required: false },
  { key: 'cittadinanza', label: 'Cittadinanza', type: 'text', required: false },
  { key: 'nazione_residenza', label: 'Nazione Residenza', type: 'text', required: true },
  { key: 'provincia_residenza', label: 'Provincia Residenza', type: 'text', required: true },
  { key: 'comune_residenza', label: 'Comune Residenza', type: 'text', required: true },
  { key: 'indirizzo_residenza', label: 'Indirizzo Residenza', type: 'text', required: true },
  { key: 'cap', label: 'CAP', type: 'text', required: true },
  { key: 'titolo_studio', label: 'Titolo Studio', type: 'text', required: false },
  { key: 'email', label: 'E-mail', type: 'email', required: true },
  { key: 'telefono', label: 'Telefono', type: 'tel', required: true },
  { key: 'profilazione', label: 'Profilazione', type: 'text', required: false },
  { key: 'sal', label: 'SAL', type: 'text', required: false },
  { key: 'data_iscrizione', label: 'Data Iscrizione', type: 'date', required: true },
  { key: 'id_corso', label: 'ID Corso', type: 'text', required: true },
  { key: 'cod_corso', label: 'COD. Corso', type: 'text', required: true },
  { key: 'edizione', label: 'Edizione', type: 'text', required: true },
  { key: 'corso', label: 'Corso', type: 'select', options: [
    'Assistente Familiare',
    'Assistente alla Struttura Educativa',
    'Gestione Magazzino e Carrelli Elevatori con Supporto Linguistico',
    'Tecniche di Logistica, Magazzino e Conduzione Carrello Elevatore'
  ], required: true },
];

export default function ModalAggiungiAllievo({ onClose, onSuccess }) {
  const [step, setStep] = useState('ocr'); // 'ocr', 'form', 'review'
  const [formData, setFormData] = useState({});
  const [datiEstratti, setDatiEstratti] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [foto, setFoto] = useState(null);

  const handleOcrSuccess = (dati) => {
    setDatiEstratti(dati);
    setFormData(dati);
    setStep('form');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value || ''
    }));
  };

  const handleSalva = async () => {
    // Validazione campi obbligatori
    const campiObbligatori = CAMPI_FORM.filter(c => c.required);
    const mancanti = campiObbligatori.filter(c => !formData[c.key]);

    if (mancanti.length > 0) {
      setError(`Campi obbligatori mancanti: ${mancanti.map(c => c.label).join(', ')}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Salva i dati su Supabase
      const { error: insertError } = await supabase
        .from('allievi')
        .insert([formData]);

      if (insertError) throw insertError;

      // Se c'è una foto, salvala nello storage
      if (foto) {
        const fileName = `${formData.codice_fiscale}_${Date.now()}.jpg`;
        await supabase.storage
          .from('foto_documenti')
          .upload(`${new Date().getFullYear()}/${fileName}`, foto);
      }

      onSuccess();
    } catch (err) {
      setError(err.message || 'Errore durante il salvataggio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 w-full max-w-4xl my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-2xl font-bold text-white">
            {step === 'ocr' && '📸 Carica Documento'}
            {step === 'form' && '✏️ Verifica e Modifica'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-300 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {step === 'ocr' && (
            <OcrFotoDocumento
              onSuccess={handleOcrSuccess}
              onFotoChange={setFoto}
            />
          )}

          {step === 'form' && (
            <div className="space-y-6">
              {/* Griglia campi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CAMPI_FORM.map(campo => (
                  <div key={campo.key}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {campo.label}
                      {campo.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    {campo.type === 'select' ? (
                      <select
                        name={campo.key}
                        value={formData[campo.key] || ''}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      >
                        <option value="">Seleziona...</option>
                        {campo.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={campo.type}
                        name={campo.key}
                        value={formData[campo.key] || ''}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                        placeholder={`Inserisci ${campo.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Info estratti */}
              {datiEstratti && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-sm text-blue-300">
                    ℹ️ Dati estratti dal documento OCR - verifica e modifica se necessario
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700/50 p-6 flex gap-3 justify-end">
          <button
            onClick={() => {
              if (step === 'form') {
                setStep('ocr');
              } else {
                onClose();
              }
            }}
            className="px-6 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 font-medium rounded-lg transition-colors"
          >
            {step === 'form' ? 'Indietro' : 'Annulla'}
          </button>

          {step === 'form' && (
            <button
              onClick={handleSalva}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Salva Allievo
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
