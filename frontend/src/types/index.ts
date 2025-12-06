export interface Flow {
    id: string;
    name: string | null;
    description: string | null;
    status: string;
    created_at: string;
    dataset_id: string | null;
    training_id: string | null;
    model_id: string | null;
}

export interface ImageMetadata {
    id: string | number;
    name: string;
    url: string;
    size: string;
    tags: string[];
    path: string;
    format: string;
}

export interface Dataset {
    id: string;
    name: string;
    path: string;
    type: string;
    description: string | null;
    status: string;
    created_at: string;
    tags: string[];
    images_metadata?: ImageMetadata[];
}

export interface Training {
    id: string;
    status: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hyperparameters: Record<string, any>;
    created_at: string;
    mlflow_run_id: string | null;
}

export interface Model {
    id: string;
    name: string;
    path: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metrics: Record<string, any> | null;
    created_at: string;
}
