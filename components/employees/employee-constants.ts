// components/employees/employee-constants.ts

export const statusConfig = new Proxy<Record<string, { label: string; className: string; dotClassName: string }>>({}, {
  get(target, prop: string) {
    if (typeof prop !== 'string') return undefined;
    const normalized = prop.trim().toLowerCase();
    
    if (normalized === 'active' || normalized === 'onboarding') {
      return {
        label: prop,
        className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[11px] font-medium inline-flex items-center gap-1.5',
        dotClassName: 'h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
      }
    }
    if (normalized === 'on leave' || normalized === 'leave') {
      return {
        label: prop,
        className: 'bg-slate-500/10 text-slate-400 border border-slate-500/10 px-2.5 py-1 rounded-full text-[11px] font-medium inline-flex items-center gap-1.5',
        dotClassName: 'h-1.5 w-1.5 rounded-full bg-slate-400'
      }
    }
    if (normalized === 'inactive' || normalized === 'terminated') {
      return {
        label: prop,
        className: 'bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full text-[11px] font-medium inline-flex items-center gap-1.5',
        dotClassName: 'h-1.5 w-1.5 rounded-full bg-rose-400'
      }
    }
    if (normalized === 'probation' || normalized === 'pending') {
      return {
        label: prop,
        className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-[11px] font-medium inline-flex items-center gap-1.5',
        dotClassName: 'h-1.5 w-1.5 rounded-full bg-amber-400'
      }
    }
    
    // Default fallback style for dynamic statuses
    return {
      label: prop,
      className: 'bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full text-[11px] font-medium inline-flex items-center gap-1.5',
      dotClassName: 'h-1.5 w-1.5 rounded-full bg-blue-400'
    }
  }
});

export const departmentConfig = new Proxy<Record<string, { label: string; className: string }>>({}, {
  get(target, prop: string) {
    if (typeof prop !== 'string') return undefined;
    const normalized = prop.trim().toLowerCase();
    
    const map: Record<string, string> = {
      engineering: 'bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-[16px] [corner-shape:squircle] text-xs font-medium',
      hr: 'bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2.5 py-0.5 rounded-[16px] [corner-shape:squircle] text-xs font-medium',
      finance: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-[16px] [corner-shape:squircle] text-xs font-medium',
      marketing: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-[16px] [corner-shape:squircle] text-xs font-medium',
      operations: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-[16px] [corner-shape:squircle] text-xs font-medium',
    };
    
    return {
      label: prop,
      className: map[normalized] || 'bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2.5 py-0.5 rounded-[16px] [corner-shape:squircle] text-xs font-medium'
    }
  }
});
