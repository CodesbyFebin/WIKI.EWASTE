'use client';

import Image from 'next/image';
import { DistributionTracker } from './distribution-tracker';
import { DistributionStatus } from '@/lib/infographics/types';

interface ArticleInfographicProps {
  src: string;
  alt: string;
  title: string;
  description?: string;
  distributionStatus?: DistributionStatus;
}

export function ArticleInfographic({
  src,
  alt,
  title,
  description,
  distributionStatus,
}: ArticleInfographicProps) {
  return (
    <figure className="my-8 rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-b from-gray-50 to-white">
      <div className="relative w-full bg-black p-6">
        <Image
          src={src}
          alt={alt}
          width={1000}
          height={1500}
          className="w-full h-auto rounded"
          priority
        />
      </div>
      
      <figcaption className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          )}
        </div>

        {distributionStatus && (
          <DistributionTracker status={distributionStatus} />
        )}

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Share this infographic:
          </p>
          <div className="mt-2 flex gap-2">
            <a
              href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(src)}&description=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 rounded text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
            >
              Save to Pinterest
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 rounded text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
            >
              Share on LinkedIn
            </a>
          </div>
        </div>
      </figcaption>
    </figure>
  );
}
