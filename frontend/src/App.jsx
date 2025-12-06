import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import DatasetPage from './pages/DatasetPage';
import { Button, Center, Title } from '@mantine/core';

function PlaceholderPage({ title }) {
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
          <Route index element={<Navigate to="/dataset" replace />} />
          <Route path="dataset" element={<DatasetPage />} />
          <Route path="training" element={<PlaceholderPage title="Training Page (Todo)" />} />
          <Route path="models" element={<PlaceholderPage title="Models Page (Todo)" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
