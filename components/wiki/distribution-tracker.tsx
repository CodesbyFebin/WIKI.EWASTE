'use client';

import { DistributionStatus } from '@/lib/infographics/types';
import { CheckCircle2, Clock } from 'lucide-react';

interface DistributionTrackerProps {
  status: DistributionStatus;
}

export function DistributionTracker({ status }: DistributionTrackerProps) {
  const channels = [
    { name: 'Pinterest', key: 'pinterest' as const, color: 'from-red-600 to-pink-600' },
    { name: 'Google Business', key: 'googleBusiness' as const, color: 'from-blue-600 to-cyan-600' },
    { name: 'LinkedIn', key: 'linkedin' as const, color: 'from-blue-700 to-blue-500' },
    { name: 'Blog', key: 'blog' as const, color: 'from-purple-600 to-indigo-600' },
  ];

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Distribution Status</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {channels.map((channel) => {
          const channelStatus = status[channel.key];
          const isPublished = channelStatus.published;
          const publishedAt = channelStatus.publishedAt;

          return (
            <div
              key={channel.key}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50"
            >
              <div className={`flex-shrink-0 ${isPublished ? 'text-green-600' : 'text-gray-400'}`}>
                {isPublished ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Clock className="w-6 h-6" />
                )}
              </div>
              
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900">{channel.name}</p>
                {isPublished && publishedAt && (
                  <p className="text-xs text-gray-500">
                    {new Date(publishedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              {isPublished && channelStatus.url && (
                <a
                  href={channelStatus.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  View
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
