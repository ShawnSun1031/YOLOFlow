import { useState } from 'react';
import {
    Container,
    Title,
    Paper,
    Group,
    Button,
    TextInput,
    Select,
    Textarea,
    Table,
    ScrollArea,
    Modal,
    Checkbox,
    Pagination,
    LoadingOverlay,
    Badge,
    Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IconSearch, IconEye } from '@tabler/icons-react';
import axios from 'axios';
import { ImageCanvas } from '../components/ImageCanvas';

// API Client (can be moved to separate file)
const api = axios.create({ baseURL: 'http://localhost:8000/api' });

interface ImageMetadata {
    id: string | number;
    name: string;
    url: string;
    size: string;
    tags: string[];
    path: string;
    format: string;
}

interface Dataset {
    id: number;
    name: string;
    path: string;
    type: string;
    description: string;
    created_at: string;
    images_metadata?: ImageMetadata[];
}

interface DatasetForm {
    name: string;
    path: string;
    type: string;
    description: string;
}

export default function DatasetPage() {
    const [opened, { open, close }] = useDisclosure(false); // Modal for upload
    // Modal for preview - actually used inside DatasetImagesView or we might want to lift state?
    // In original code: const [previewOpened, { open: openPreview, close: closePreview }] = useDisclosure(false);
    // But it wasn't used? Ah, I see `DatasetImagesView` has its own state. The openPreview/closePreview were unused in main component?
    // Checking original code: `previewOpened` unused. `openPreview` unused. `closePreview` unused.
    // Cleaned up unused vars.

    const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(null);

    const [formState, setFormState] = useState<DatasetForm>({
        name: '',
        path: '',
        type: 'yolo',
        description: '',
    });

    const queryClient = useQueryClient();

    // Query Datasets
    const { data: datasets, isLoading } = useQuery<Dataset[]>({
        queryKey: ['datasets'],
        queryFn: async () => {
            const res = await api.get('/stepper/datasets');
            return res.data;
        },
    });

    // Create Dataset Mutation
    const createMutation = useMutation({
        mutationFn: (newDataset: DatasetForm) => api.post('/stepper/datasets', newDataset),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['datasets'] });
            close();
        },
    });

    const handleSubmit = () => {
        createMutation.mutate(formState);
        setFormState({ name: '', path: '', type: 'yolo', description: '' }); // Reset
    };

    return (
        <Container fluid>
            <Group justify="space-between" mb="md">
                <Title order={2}>Datasets</Title>
                <Button onClick={open}>Create dataset</Button>
            </Group>

            <Modal opened={opened} onClose={close} title="Create New Dataset">
                <Stack>
                    <TextInput
                        label="Dataset Name"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                    <TextInput
                        label="Path"
                        placeholder="/path/to/dataset"
                        value={formState.path}
                        onChange={(e) => setFormState({ ...formState, path: e.target.value })}
                    />
                    <Select
                        label="Type"
                        data={['yolo', 'coco', 'voc']}
                        value={formState.type}
                        onChange={(val) => setFormState({ ...formState, type: val || 'yolo' })}
                    />
                    <Textarea
                        label="Description"
                        value={formState.description}
                        onChange={(e) =>
                            setFormState({ ...formState, description: e.target.value })
                        }
                    />
                    <Button onClick={handleSubmit} loading={createMutation.isPending}>
                        Submit
                    </Button>
                </Stack>
            </Modal>

            {/* List of datasets */}
            <Group align="flex-start" py="md">
                <Paper flex={1} withBorder p="md">
                    <Title order={4} mb="md">
                        Available Datasets
                    </Title>
                    {isLoading ? (
                        <LoadingOverlay visible />
                    ) : (
                        <Stack>
                            {datasets?.map((ds) => (
                                <Paper
                                    key={ds.id}
                                    withBorder
                                    p="sm"
                                    style={{
                                        cursor: 'pointer',
                                        borderColor:
                                            selectedDatasetId === ds.id
                                                ? 'var(--mantine-color-blue-5)'
                                                : undefined,
                                    }}
                                    onClick={() => setSelectedDatasetId(ds.id)}
                                >
                                    <Group justify="space-between">
                                        <div>
                                            <Title order={5}>{ds.name}</Title>
                                            <Badge>{ds.type}</Badge>
                                        </div>
                                        <Badge color="gray">
                                            {new Date(ds.created_at).toLocaleDateString()}
                                        </Badge>
                                    </Group>
                                </Paper>
                            ))}
                        </Stack>
                    )}
                </Paper>

                {/* Images Table for Selected Dataset */}
                {selectedDatasetId && <DatasetImagesView datasetId={selectedDatasetId} />}
            </Group>
        </Container>
    );
}

interface DatasetImagesViewProps {
    datasetId: number;
}

function DatasetImagesView({ datasetId }: DatasetImagesViewProps) {
    // Fetch specific dataset details to get images
    const { data: dataset, isLoading } = useQuery<Dataset>({
        queryKey: ['dataset', datasetId],
        queryFn: async () => {
            const res = await api.get(`/stepper/datasets/${datasetId}`);
            return res.data;
        },
    });

    const [page, setPage] = useState(1);
    const pageSize = 5;
    const [search, setSearch] = useState('');
    const [previewImage, setPreviewImage] = useState<ImageMetadata | null>(null);
    const [showBox, setShowBox] = useState(true);

    if (isLoading || !dataset)
        return (
            <Paper flex={2} p="md" withBorder>
                <LoadingOverlay visible />
            </Paper>
        );

    const filteredImages = (dataset.images_metadata || []).filter((img) =>
        img.name.toLowerCase().includes(search.toLowerCase()),
    );

    const total = filteredImages.length;
    const paginatedImages = filteredImages.slice((page - 1) * pageSize, page * pageSize);

    return (
        <Paper flex={3} withBorder p="md">
            <Title order={4} mb="md">
                {dataset.name} - Images
            </Title>

            <Group mb="md">
                <TextInput
                    placeholder="Search images..."
                    leftSection={<IconSearch size={16} />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Group>

            <ScrollArea>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Preview</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Size</Table.Th>
                            <Table.Th>Tags</Table.Th>
                            <Table.Th>Action</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {paginatedImages.map((img) => (
                            <Table.Tr key={img.id}>
                                <Table.Td>
                                    <img
                                        src={img.url}
                                        alt="mini"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            objectFit: 'cover',
                                            borderRadius: 4,
                                        }}
                                    />
                                </Table.Td>
                                <Table.Td>{img.name}</Table.Td>
                                <Table.Td>{img.size}</Table.Td>
                                <Table.Td>
                                    {img.tags.map((t) => (
                                        <Badge key={t} size="xs" mr={4}>
                                            {t}
                                        </Badge>
                                    ))}
                                </Table.Td>
                                <Table.Td>
                                    <Button
                                        size="xs"
                                        variant="light"
                                        leftSection={<IconEye size={12} />}
                                        onClick={() => setPreviewImage(img)}
                                    >
                                        Details
                                    </Button>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </ScrollArea>

            <Pagination
                total={Math.ceil(total / pageSize)}
                value={page}
                onChange={setPage}
                mt="md"
            />

            {/* Detail Modal with Canvas */}
            <Modal
                size="xl"
                opened={!!previewImage}
                onClose={() => setPreviewImage(null)}
                title={previewImage?.name}
            >
                {previewImage && (
                    <Stack>
                        <Group>
                            <Checkbox
                                label="Show Bounding Boxes"
                                checked={showBox}
                                onChange={(e) => setShowBox(e.currentTarget.checked)}
                            />
                        </Group>
                        <ImageCanvas
                            src={previewImage.url}
                            showBoxes={showBox}
                            boxes={[
                                // Generating mock boxes based on tags for demo
                                [0, 0.5, 0.5, 0.4, 0.3], // class 0, center, center, w, h
                                [1, 0.2, 0.2, 0.1, 0.1],
                            ]}
                        />
                        <Textarea
                            label="Description"
                            readOnly
                            value={`Path: ${previewImage.path}\nSize: ${previewImage.size}\nFormat: ${previewImage.format}`}
                        />
                    </Stack>
                )}
            </Modal>
        </Paper>
    );
}
