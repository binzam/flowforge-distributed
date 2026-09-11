CREATE TYPE fulfillment_status AS ENUM (
    'pending',
    'processing',
    'packed',
    'shipped',
    'delivered',
    'cancelled'
);

CREATE TABLE fulfillments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL
        REFERENCES orders(id)
        ON DELETE RESTRICT,

    status fulfillment_status NOT NULL DEFAULT 'pending',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (order_id)
);

CREATE INDEX idx_fulfillments_status
    ON fulfillments(status);