'use client';

import { useState } from 'react';
import { ShieldAlert, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { Button, Input, Card } from '@stayflo/ui';
import { login } from './actions';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setErrorMsg(null);
    const result = await login(formData);
    
    if (result?.error) {
      setErrorMsg(result.error);
      setIsLoading(false);
    }
    // If successful, the server action will redirect us to /dashboard
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <Card className="w-full max-w-md p-8 bg-white border border-slate-200/60 shadow-2xl rounded-[2rem] relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Logo Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-teal-500 to-teal-400 rounded-2xl shadow-lg flex items-center justify-center text-white">
            <KeyRound className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Stayflo Identity</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Corporate-Grade Zero Leakage Authentication</p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200/50 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-sm font-semibold text-rose-800">
              <p>Authentication Failed</p>
              <p className="text-xs font-medium text-rose-600/80 mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form action={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Work Email</label>
            <Input 
              name="email" 
              type="email" 
              placeholder="owner@sunrise-pg.com" 
              required 
              className="h-12 px-4 rounded-xl bg-slate-50 border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-inner"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between pl-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Master Password</label>
              <a href="#" className="text-xs font-bold text-teal-600 hover:text-teal-700">Forgot?</a>
            </div>
            <Input 
              name="password" 
              type="password" 
              placeholder="••••••••••••" 
              required 
              className="h-12 px-4 rounded-xl bg-slate-50 border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-inner"
            />
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In Securely</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </>
              )}
            </Button>
          </div>
        </form>

        <p className="text-center text-xs font-semibold text-slate-400 mt-8">
          Powered by <span className="text-[#3ECF8E] font-bold">Supabase</span> SSR Security
        </p>
      </Card>
    </div>
  );
}
