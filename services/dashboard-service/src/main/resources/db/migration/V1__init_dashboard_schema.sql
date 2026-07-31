CREATE TABLE dashboard_metrics_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_key VARCHAR(100) UNIQUE NOT NULL,
    metric_value JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
