import React from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../api';

const ElderlyDashboard: React.FC = () => {
  const { socket } = useSocket();
  const [sosStatus, setSosStatus] = React.useState<'idle' | 'triggering' | 'active'>('idle');

  const sosMutation = useMutation({
    mutationFn: async () => {
      let geolocation = null;
      if (navigator.geolocation) {
        geolocation = await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => resolve(null)
          );
        });
      }
      return api.post('/emergency/trigger', { geolocation });
    },
    onMutate: () => setSosStatus('triggering'),
    onSuccess: () => setSosStatus('active'),
    onError: () => setSosStatus('idle'),
  });

  // Example reminder query
  const { data: reminders, isLoading } = useQuery({
    queryKey: ['reminders'],
    queryFn: () => api.get('/reminders').then(res => res.data.data)
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-900 font-sans">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Hello, how can we help?</h1>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="col-span-1 md:col-span-2">
          <button
            onClick={() => sosMutation.mutate()}
            disabled={sosStatus !== 'idle'}
            aria-label="Trigger Emergency SOS"
            className={`w-full py-12 rounded-3xl text-3xl font-bold text-white transition-all transform active:scale-95 shadow-xl ${
              sosStatus === 'idle' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-800'
            }`}
          >
            {sosStatus === 'idle' ? 'SOS EMERGENCY' : 'Guardians Notified!'}
          </button>
        </section>

        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-3xl font-semibold mb-6">Today's Reminders</h2>
          {isLoading ? (
            <p className="text-xl text-slate-500">Loading...</p>
          ) : reminders?.length ? (
            <ul className="space-y-4">
              {reminders.map((r: any) => (
                <li key={r._id} className="p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                  <p className="text-2xl font-bold">{r.message || r.type}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-2xl text-slate-600">No reminders for today.</p>
          )}
        </section>
        
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
           <h2 className="text-3xl font-semibold mb-6">Voice Command</h2>
           <button className="w-full py-8 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-2xl text-2xl font-bold flex items-center justify-center gap-4">
              <span>Tap to Speak</span>
           </button>
        </section>
      </main>
    </div>
  );
};

export default ElderlyDashboard;
