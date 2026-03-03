import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { Flow, Dataset, ImageMetadata } from '../types';

export const generateImageMetadata = (datasetId: string): ImageMetadata => ({
    id: uuidv4(),
    name: faker.system.fileName(),
    url: faker.image.url({ width: 640, height: 480 }),
    size: `${faker.number.int({ min: 100, max: 5000 })} KB`,
    tags: faker.helpers.arrayElements(['car', 'person', 'dog', 'cat', 'traffic light'], { min: 1, max: 3 }),
    path: `/datasets/${datasetId}/${faker.system.fileName()}`,
    format: 'jpg',
});

export const generateDataset = (): Dataset => {
    const id = uuidv4();
    return {
        id,
        name: faker.commerce.productName(),
        path: `/opt/data/${faker.system.fileName()}`,
        type: faker.helpers.arrayElement(['yolo', 'coco', 'voc']),
        description: faker.commerce.productDescription(),
        status: faker.helpers.arrayElement(['active', 'processing', 'error']),
        created_at: faker.date.past().toISOString(),
        tags: faker.helpers.arrayElements(['training', 'validation', 'test'], { min: 1, max: 2 }),
        images_metadata: Array.from({ length: 10 }, () => generateImageMetadata(id)),
    };
};

export const generateFlow = (): Flow => ({
    id: uuidv4(),
    name: faker.company.catchPhrase(),
    description: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(['draft', 'active', 'completed']),
    created_at: faker.date.past().toISOString(),
    dataset_id: uuidv4(),
    training_id: null,
    model_id: null,
});

export const mockData = {
    flows: Array.from({ length: 5 }, generateFlow),
    datasets: Array.from({ length: 3 }, generateDataset),
};
