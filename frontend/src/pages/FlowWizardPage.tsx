import { useParams, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { LoadingOverlay } from '@mantine/core';

export default function FlowWizardPage() {
    const { flowId } = useParams<{ flowId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // If we land on /flows/:id, redirect to /flows/:id/dataset
    // Unless we are already on a specific step
    const isRoot = location.pathname.endsWith(flowId!);

    useEffect(() => {
        if (isRoot && flowId) {
            navigate(`/flows/${flowId}/dataset`, { replace: true });
        }
    }, [isRoot, flowId, navigate]);

    if (!flowId) return <LoadingOverlay visible />;

    return <Outlet />;
}
