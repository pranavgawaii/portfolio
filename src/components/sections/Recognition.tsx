import React, { Suspense, lazy } from 'react';
import { LEADERSHIP } from '../../config/constants';

const LeadershipCard = lazy(() => import('../features/LeadershipCard'));

const Recognition: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100 dark:bg-neutral-900 rounded-lg"></div>}>
                {LEADERSHIP.map((item) => (
                    <LeadershipCard key={item.id} item={item} />
                ))}
            </Suspense>
        </div>
    );
};

export default Recognition;
