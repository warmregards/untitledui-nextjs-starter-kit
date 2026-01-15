'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_INSPECTIONS } from '@/data/mock-data';
import { Plus, Map as MapIcon, List as ListIcon, Search, Filter, Calendar, Clock, MapPin } from 'lucide-react';
import { Inspection } from '@/types';

export default function InspectionsPage() {
  const [isMapView, setIsMapView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Simple filter logic
  const filteredInspections = MOCK_INSPECTIONS.filter(inspection => 
    inspection.propertyId.includes(searchQuery) || 
    (inspection.loanNumber && inspection.loanNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* --- HEADER & TOOLBAR --- */}
      <div className="px-8 py-6 bg-white border-b border-gray-200 flex-none z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inspections</h1>
            <p className="text-gray-500">Manage your schedule and field reports.</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 bg-white text-gray-700">
               <Filter className="w-4 h-4" /> Filter
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 shadow-sm">
               <Plus className="w-4 h-4" /> Schedule Inspection
             </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search address or loan #..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button 
              onClick={() => setIsMapView(false)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${!isMapView ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ListIcon className="w-4 h-4" /> List
            </button>
            <button 
              onClick={() => setIsMapView(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${isMapView ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <MapIcon className="w-4 h-4" /> Map
            </button>
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA (Split View) --- */}
      <div className="flex-1 overflow-hidden flex bg-gray-50">
        
        {/* LEFT PANEL: The List */}
        <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isMapView ? 'w-1/2 max-w-2xl border-r border-gray-200' : 'w-full'}`}>
          <div className="p-8 space-y-4">
            {filteredInspections.map((inspection) => (
              <Link 
                key={inspection.id} 
                href={`/inspections/${inspection.id}`}
                className="block group"
              >
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      {/* Date Box */}
                      <div className="flex flex-col items-center justify-center w-14 h-14 bg-gray-50 rounded-lg border border-gray-100 text-gray-600 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                        <span className="text-xs font-bold uppercase">{new Date(inspection.scheduledDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="text-xl font-bold">{new Date(inspection.scheduledDate).getDate()}</span>
                      </div>
                      
                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {inspection.propertyId === 'p2' ? '990 Lake Shore Dr' : '123 Oak Street'}
                          </h3>
                          {inspection.workflow === 'ORIGINATION_MF' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-purple-100 text-purple-700">Origination</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-blue-100 text-blue-700">Servicing</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {inspection.scheduledTime}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {inspection.propertyId === 'p2' ? 'Chicago, IL' : 'Austin, TX'}
                          </div>
                          {inspection.loanNumber && (
                            <div className="text-gray-400 font-mono text-xs">
                              Loan #: {inspection.loanNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      inspection.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      inspection.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-green-50 text-green-700 border-green-100'
                    }`}>
                      {inspection.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            
            {filteredInspections.length === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No inspections found</h3>
                <p className="text-gray-500">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: The Map (Only visible if isMapView is true) */}
        {isMapView && (
          <div className="flex-1 bg-slate-100 relative hidden lg:block">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-87.6298,41.8781,13,0/800x600?access_token=pk.mock')] bg-cover bg-center opacity-50 mix-blend-multiply"></div>
            
            {/* Map Pins (Mock) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
               <div className="relative group cursor-pointer">
                  <div className="w-8 h-8 bg-brand-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold animate-bounce">
                    1
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-white p-2 rounded shadow-xl text-xs hidden group-hover:block z-20">
                    <p className="font-bold">990 Lake Shore</p>
                    <p className="text-purple-600">Origination</p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}