# Relationship Engine

The Relationship Engine stores semantic links between business entities and projects them into graph edges.

## Supported Relationships

Canonical relationship types:

- owns
- belongs_to
- works_in
- manages
- contains
- depends_on
- drives
- influences
- generates
- connected_to
- assigned_to
- created_by
- executes
- recommends

Required business relationships supported by the model:

- Customer to Invoice.
- Invoice to Revenue.
- Revenue to KPI.
- Employee to Department.
- Project to Task.
- Workflow to Event.
- Goal to KPI.
- Agent to Recommendation.
- Department to Business Unit.

## Runtime Flow

`RelationshipService.createRelationship` creates an `OntologyRelationship`, then creates the matching `KnowledgeEdge`. This keeps semantic relationships and graph traversal data aligned.

## Storage Model

- `ontology_relationships`: canonical semantic relationship records.
- `knowledge_edges`: graph traversal edges.
- `relationship_templates`: reusable industry or module-level relationship definitions.

## API Surface

- `POST /v1/knowledge-graph/relationships`