import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { User } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Controlla se l'utente è già loggato
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Determina il ruolo in base all'email
        const email = session.user.email;
        if (email === 'marco@innovazionepiemonte.com') {
          setUserRole('admin');
        } else {
          setUserRole('operator');
        }
      }
      setLoading(false);
    };

    checkAuth();

    // Ascolta i cambiamenti di autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          const email = session.user.email;
          if (email === 'marco@innovazionepiemonte.com') {
            setUserRole('admin');
          } else {
            setUserRole('operator');
          }
        } else {
          setUser(null);
          setUserRole(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-500 border-opacity-20 border-t-opacity-100 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg font-medium">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {!user ? (
        <Login />
      ) : (
        <Dashboard user={user} userRole={userRole} />
      )}
    </div>
  );
}
