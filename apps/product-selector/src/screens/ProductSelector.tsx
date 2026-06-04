import { Link } from "react-router";
import { Monitor, Shield, Building, Layout, Users } from "lucide-react";
import { Button, Card } from "@stayflo/ui";

export function ProductSelector() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-12 text-left">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <h1 className="text-4xl md:text-5xl font-semibold mb-2">
              <span style={{ color: '#111827' }}>Rent</span>
              <span style={{ color: '#1D9E75' }}>flo</span>
            </h1>
            <p className="text-lg" style={{ color: '#6B7280' }}>PG management, simplified</p>
          </div>
          <p className="text-base" style={{ color: '#9CA3AF' }}>
            Choose a responsive web product to explore the complete UI system
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Owner Web Dashboard */}
          <Card className="p-6 hover:shadow-lg transition-shadow bg-white flex flex-col justify-between border border-slate-200">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#E1F5EE]">
                  <Monitor className="w-5 h-5 text-[#1D9E75]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-sans">Owner Dashboard</h3>
                  <p className="text-xs text-slate-500">7 screens · Core Management</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-600">
                Full-featured control deck for PG owners to monitor rent collections, BESCOM unit charges, food waste cutoff tallies, tenant directories, and custom drag-and-drop floor planners.
              </p>
            </div>
            <a href="http://localhost:5174" className="mt-6 block">
              <Button className="w-full font-bold uppercase tracking-wider text-[10px] h-10" style={{ background: '#1D9E75', color: '#FFFFFF' }}>
                Open Owner Dashboard
              </Button>
            </a>
          </Card>

          {/* Tenant Web Portal */}
          <Card className="p-6 hover:shadow-lg transition-shadow bg-white flex flex-col justify-between border border-slate-200">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-50">
                  <Users className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-sans">Tenant Web Portal</h3>
                  <p className="text-xs text-slate-500">5 screens · Resident Portal</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-600">
                Self-service hub for active residents to settle monthly rents, book daily meals before the 6:00 PM cutoff, upload electricity meter photos, and submit maintenance complaints.
              </p>
            </div>
            <a href="http://localhost:5176/splash" className="mt-6 block">
              <Button className="w-full font-bold uppercase tracking-wider text-[10px] h-10" style={{ background: '#1D9E75', color: '#FFFFFF' }}>
                Open Tenant Portal
              </Button>
            </a>
          </Card>

          {/* Super Admin Dashboard */}
          <Card className="p-6 hover:shadow-lg transition-shadow bg-white flex flex-col justify-between border border-slate-200">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-50">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-sans">Super Admin Dashboard</h3>
                  <p className="text-xs text-slate-500">10 screens · Platform Control</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-600">
                Centralized dashboard to oversee registered PG locations, owner subscriptions, overall MRR growth projections, Razorpay gateway logs, and customer support channels.
              </p>
            </div>
            <a href="http://localhost:5178" className="mt-6 block">
              <Button className="w-full font-bold uppercase tracking-wider text-[10px] h-10" style={{ background: '#EF9F27', color: '#FFFFFF' }}>
                Open Super Admin Panel
              </Button>
            </a>
          </Card>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* PG Portfolio Website */}
          <Card className="p-6 hover:shadow-lg transition-shadow bg-neutral-900 text-white flex flex-col justify-between border border-neutral-800">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-neutral-800">
                  <Building className="w-5 h-5 text-[#1D9E75]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-sans">PG Portfolio Website</h3>
                  <p className="text-xs text-slate-400">Dark luxury design · Fully Responsive Web</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-350">
                Lead-facing search portfolio for prospective residents. Highly responsive web layout featuring photo galleries, dynamic room grids, food menus, location maps, and booking CTAs.
              </p>
            </div>
            <a href="http://localhost:5175/portfolio/sunrise-pg" className="mt-6 block">
              <Button className="w-full font-bold uppercase tracking-wider text-[10px] h-10 animate-pulse" style={{ background: '#1D9E75', color: '#FFFFFF' }}>
                Explore PG Website
              </Button>
            </a>
          </Card>

          {/* Component Library */}
          <Card className="p-6 hover:shadow-lg transition-shadow bg-teal-50 flex flex-col justify-between border border-teal-100">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-100">
                  <Layout className="w-5 h-5 text-teal-800" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-sans">Design Component Library</h3>
                  <p className="text-xs text-slate-500">Design System Standards & Tokens</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-600">
                Complete unified token guidelines displaying Stayflo UI building blocks: buttons, inputs, badge variants, bottoms sheets, avatars, and alert layouts.
              </p>
            </div>
            <Link to="/components" className="mt-6 block">
              <Button className="w-full font-bold uppercase tracking-wider text-[10px] h-10 hover:opacity-90" style={{ background: '#1D9E75', color: '#FFFFFF' }}>
                Open Component Library
              </Button>
            </Link>
          </Card>

        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm" style={{ color: '#9CA3AF' }}>
          <p>Stayflo Web UI System · Responsive Web Applications</p>
          <p className="mt-1">Built with React, TypeScript, Tailwind CSS v4, and Radix UI</p>
        </div>
      </div>
    </div>
  );
}
