'use client';

import React, { useState, useEffect } from 'react';
import { fetchBlockedDates } from '@/app/actions/fetchBlockedDates';

export function CalendarPicker({ selectedDate: propSelectedDate, onSelectDate }: { selectedDate?: Date | null, onSelectDate?: (date: Date) => void }) {
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(propSelectedDate ? propSelectedDate.toISOString().split('T')[0] : null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1)); // default to June 2026 as per workspace time

  useEffect(() => {
    fetchBlockedDates().then(setBlockedDates);
  }, []);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  // Calculate total slots needed (days + starting offset + ending offset) to complete the grid
  const totalSlots = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  const remainingSlots = totalSlots - (firstDayOfMonth + daysInMonth);

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    // Pad months and days with leading zeros for ISO formatting
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const day = String(i + 1).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return {
      date: dateStr,
      dayNumber: i + 1,
      isBlocked: blockedDates.includes(dateStr),
    };
  });

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div 
      className="w-full max-w-3xl mx-auto border overflow-hidden shadow-sm" 
      style={{ fontFamily: 'var(--font-mono), monospace', backgroundColor: "#1A1816", borderColor: "rgba(196, 181, 157, 0.2)", color: "#EAE2D5" }}
      data-testid="calendar-picker"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-8 border-b" style={{ borderColor: "rgba(196, 181, 157, 0.2)", backgroundColor: "transparent" }}>
        <button onClick={prevMonth} className="text-[11px] uppercase tracking-[0.2em] transition-colors py-2 px-4 border" style={{ color: "#9C958A", borderColor: "rgba(196, 181, 157, 0.2)" }}>Prev</button>
        <h2 className="text-3xl font-normal tracking-wide" style={{ fontFamily: 'var(--font-serif), serif', color: "#EAE2D5" }}>{monthName}</h2>
        <button onClick={nextMonth} className="text-[11px] uppercase tracking-[0.2em] transition-colors py-2 px-4 border" style={{ color: "#9C958A", borderColor: "rgba(196, 181, 157, 0.2)" }}>Next</button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-[1px]" style={{ backgroundColor: "rgba(196, 181, 157, 0.1)" }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-4 text-center text-[10px] uppercase tracking-[0.2em]" style={{ backgroundColor: "#1A1816", color: "#9C958A" }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-t-0 border-b" style={{ backgroundColor: "transparent", borderColor: "rgba(196, 181, 157, 0.2)" }}>
        {/* Leading empty slots */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-start-${i}`} className="aspect-square" style={{ backgroundColor: "rgba(196, 181, 157, 0.02)" }} />
        ))}
        
        {/* Actual days */}
        {days.map((day) => {
          const isSelected = selectedDate === day.date;
          return (
            <button
              key={day.date}
              disabled={day.isBlocked}
              onClick={() => {
                setSelectedDate(day.date);
                if (onSelectDate) onSelectDate(new Date(day.date));
              }}
              data-testid={`date-${day.date}`}
              className={`
                relative flex items-center justify-center aspect-square border-t border-l -mt-px -ml-px transition-all duration-500
                ${day.isBlocked ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#EAE2D5]/5 cursor-pointer'}
                ${isSelected ? 'z-10' : 'z-0'}
              `}
              style={{ 
                backgroundColor: isSelected ? "#8C382A" : "transparent",
                borderColor: "rgba(196, 181, 157, 0.2)",
                color: isSelected ? "#EAE2D5" : "inherit"
              }}
            >
              <span 
                className={`text-xl transition-all duration-300 ${isSelected ? 'scale-110' : ''}`} 
                style={isSelected ? { fontFamily: 'var(--font-serif), serif' } : {}}
              >
                {day.dayNumber}
              </span>
              {day.isBlocked && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-px transform rotate-45" style={{ backgroundColor: "rgba(140, 56, 42, 0.3)" }} />
                  <div className="w-full h-px transform -rotate-45" style={{ backgroundColor: "rgba(140, 56, 42, 0.3)" }} />
                </div>
              )}
            </button>
          );
        })}

        {/* Trailing empty slots */}
        {Array.from({ length: remainingSlots }).map((_, i) => (
          <div key={`empty-end-${i}`} className="aspect-square" style={{ backgroundColor: "rgba(196, 181, 157, 0.02)" }} />
        ))}
      </div>
      
      {/* Footer / Action */}
      <div className="p-8 flex justify-between items-center" style={{ backgroundColor: "transparent" }}>
        <div className="text-[11px] tracking-[0.2em] uppercase" style={{ color: "#9C958A" }}>
          {selectedDate ? (
            <span style={{ color: "#EAE2D5" }}>Selected: <span style={{ fontFamily: 'var(--font-serif), serif', fontSize: '1.125rem' }} className="ml-2">{selectedDate}</span></span>
          ) : (
            'Select your date'
          )}
        </div>
        {/* Hidden button since InquiryFlow has the confirm action now, but keeping for semantic completeness if needed */}
      </div>
    </div>
  );
}
