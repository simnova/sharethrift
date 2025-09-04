```mermaid
flowchart TD
    subgraph API
        A[api-graphql]:::node
        B[api-application-services]:::node
        C[api-persistence]:::node
        D[api-data-sources-mongoose-models]:::node
        E[api-domain]:::node
    end

    %% Edges
    A --> B
    B --> C
    B --> E
    C --> D
    C --> E

    %% Notes / annotations
    A_note["expose apis to front end"]:::note
    A_note2["use application service layer to handle logic of queries and mutations to keep the resolvers simple"]:::detail

    B_note["expose use cases in the system"]:::note
    B_note2["use persistence layer to interact with data in database"]:::detail
    B_note3["use domain context objects as return type of results returning to application service layer"]:::detail

    C_note["get and update data in database and return domain context objects<br/>- domain: update/delete data<br/>- read-only: query data"]:::note
    C_note2["use models to directly interact with data in database"]:::detail

    D_note["define how data in database looks like"]:::note

    E_note["act as in-memory objects that represent data objects in database"]:::note
    E_note2["use domain context objects as return type of results returning to graphql resolvers"]:::detail

    %% Attach notes
    A -.-> A_note
    A -.-> A_note2
    B -.-> B_note
    B -.-> B_note2
    B -.-> B_note3
    C -.-> C_note
    C -.-> C_note2
    D -.-> D_note
    E -.-> E_note
    E -.-> E_note2

    %% Styles
    classDef node fill:#d5e8d4,stroke:#82b366,stroke-width:1px,color:#000
    classDef note fill:#fff2cc,stroke:#d6b656,stroke-width:1px,color:#000
    classDef detail fill:#dae8fc,stroke:#6c8ebf,stroke-width:1px,color:#000
