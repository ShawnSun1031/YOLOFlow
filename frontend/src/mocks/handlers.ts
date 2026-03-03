import { http, HttpResponse } from 'msw';
import { mockData, generateFlow, generateDataset } from './data';

const BASE_URL = 'http://localhost:8000/api';

export const handlers = [
    // Flows
    http.get(`${BASE_URL}/flows`, () => {
        return HttpResponse.json(mockData.flows);
    }),

    http.post(`${BASE_URL}/flows`, async ({ request }) => {
        const body = (await request.json()) as { name: string; description: string; status: string };
        const newFlow = {
            ...generateFlow(),
            name: body.name,
            description: body.description,
            status: body.status,
        };
        mockData.flows.push(newFlow);
        return HttpResponse.json(newFlow, { status: 201 });
    }),

    http.patch(`${BASE_URL}/flows/:flowId`, async ({ params, request }) => {
        const { flowId } = params;
        const body = (await request.json()) as { dataset_id?: string };
        const flowIndex = mockData.flows.findIndex((f) => f.id === flowId);
        if (flowIndex !== -1) {
            mockData.flows[flowIndex] = { ...mockData.flows[flowIndex], ...body };
            return HttpResponse.json(mockData.flows[flowIndex]);
        }
        return new HttpResponse(null, { status: 404 });
    }),

    // Datasets
    http.get(`${BASE_URL}/stepper/datasets`, () => {
        return HttpResponse.json(mockData.datasets);
    }),

    http.post(`${BASE_URL}/stepper/datasets`, async ({ request }) => {
        const body = (await request.json()) as { name: string; path: string; type: string; description: string };
        const newDataset = {
            ...generateDataset(),
            name: body.name,
            path: body.path,
            type: body.type,
            description: body.description,
            status: 'active',
        };
        mockData.datasets.push(newDataset);
        return HttpResponse.json(newDataset, { status: 201 });
    }),

    http.get(`${BASE_URL}/stepper/datasets/:datasetId`, ({ params }) => {
        const { datasetId } = params;
        const dataset = mockData.datasets.find((d) => d.id === datasetId);
        if (dataset) {
            return HttpResponse.json(dataset);
        }
        return new HttpResponse(null, { status: 404 });
    }),
];
