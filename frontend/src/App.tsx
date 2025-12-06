import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import DatasetPage from './pages/DatasetPage.tsx';
import FlowsPage from './pages/FlowsPage.tsx';
import FlowWizardPage from './pages/FlowWizardPage.tsx';
import { Center, Title } from '@mantine/core';

interface PlaceholderPageProps {
    title: string;
}

function PlaceholderPage({ title }: PlaceholderPageProps) {
    return (
        <Center h="100%">
            <Title>{title}</Title>
        </Center>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<FlowsPage />} />
                    <Route path="flows/:flowId" element={<FlowWizardPage />}>
                        <Route path="dataset" element={<DatasetPage />} />
                        <Route
                            path="training"
                            element={<PlaceholderPage title="Training Step" />}
                        />
                        <Route
                            path="models"
                            element={<PlaceholderPage title="Model Management Step" />}
                        />
                    </Route>
                    {/* Standalone pages if needed, or redirect old routes */}
                    <Route path="dataset" element={<DatasetPage />} />{' '}
                    {/* Standalone Dataset Manager */}
                    <Route
                        path="training"
                        element={<PlaceholderPage title="Training Page (Standalone)" />}
                    />
                    <Route
                        path="models"
                        element={<PlaceholderPage title="Models Page (Standalone)" />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
