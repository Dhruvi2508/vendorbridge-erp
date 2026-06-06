import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageWrapper from '../../components/layout/PageWrapper';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDateTime } from '../../utils/formatters';

const ActivityLogsPage = () => {
  const [filterModule, setFilterModule] = useState('All');

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['activityLogs'],
    queryFn: async () => [
      { id: 1, action: 'CREATE', module_name: 'RFQ', description: 'RFQ-2024-0015 Microchip Components created by Alex Thompson.', created_at: '2026-06-06T09:30:00Z' },
      { id: 2, action: 'SUBMIT', module_name: 'QUOTATION', description: 'Quotation QTN-2024-9122 submitted by Industrial Dynamics Ltd. for RFQ-2024-0012.', created_at: '2026-06-06T09:10:00Z' },
      { id: 3, action: 'APPROVE', module_name: 'APPROVAL', description: 'Procurement bid approved for PO #4412 by Sarah Jenkins.', created_at: '2026-06-06T06:10:00Z' },
      { id: 4, action: 'CREATE', module_name: 'INVOICE', description: 'Invoice INV-2024-0412 generated from PO-4412.', created_at: '2026-06-05T15:00:00Z' },
      { id: 5, action: 'ADD', module_name: 'VENDOR', description: 'Supplier Swift Logistics Solutions added to directory.', created_at: '2026-06-04T14:20:00Z' }
    ]
  });

  const filteredLogs = filterModule === 'All'
    ? logs
    : logs.filter(l => l.module_name === filterModule);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <PageWrapper
      title="System Activity Logs"
      description="Track structural modifications, contract releases, and workflow approvals."
    >
      {/* Module Filters */}
      <div className="bg-surface p-lg rounded-xl card-shadow border border-outline-variant flex flex-wrap gap-md items-center mt-md">
        <span className="font-label-sm uppercase text-on-surface-variant text-xs">Filter Module</span>
        <div className="flex gap-xs flex-wrap">
          {['All', 'RFQ', 'QUOTATION', 'APPROVAL', 'INVOICE', 'VENDOR'].map(mod => (
            <button
              key={mod}
              onClick={() => setFilterModule(mod)}
              className={`px-md py-sm border rounded-lg text-body-sm font-semibold transition-colors ${
                filterModule === mod ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container hover:bg-surface-container-high'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-surface p-xl rounded-xl border border-outline-variant card-shadow mt-lg">
        <div className="space-y-lg relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant">
          {filteredLogs.map((log) => (
            <div key={log.id} className="relative">
              <span className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold font-label-sm text-[10px]">
                {log.action[0]}
              </span>
              <div>
                <div className="flex gap-md items-center flex-wrap">
                  <p className="font-bold text-on-surface text-sm">{log.description}</p>
                  <span className="px-sm py-0.5 bg-surface-container-highest text-on-surface text-[10px] font-bold rounded uppercase tracking-wider border border-outline-variant">
                    {log.module_name}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-xs font-label-md">{formatDateTime(log.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ActivityLogsPage;
