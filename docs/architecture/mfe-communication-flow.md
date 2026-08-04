# Fluxo de comunicação entre Microfrontends

Este diagrama representa o fluxo orientado a eventos do Portal de Seguros. Os MFEs não fazem importações diretas entre si: eles trocam dados pelo Event Bus compartilhado e, no caso do Angular isolado em iframe, pela ponte `postMessage` do Host.

```mermaid
flowchart LR
    Customer["MFE Customer<br/>React · Module Federation"]
    Bus["Event Bus<br/>CustomEvent / publish() / subscribe()"]
    Catalog["MFE Insurance Catalog<br/>React · Module Federation"]
    Host["Host Dashboard<br/>React · Orquestração"]
    Bridge["Iframe bridge<br/>window.postMessage"]
    Notifications["MFE Notifications<br/>Angular · Iframe"]

    Customer -->|"publica customer.updated\nCustomer { id, name, cpf, email, phone }"| Bus
    Bus -->|"consome customer.updated"| Catalog

    Catalog -->|"publica insurance.contracted\nInsuranceContract { customer, insurance, contractDate }"| Bus
    Bus -->|"consome insurance.contracted\nconsolida cards e tabela"| Host

    Host -->|"encaminha contratos"| Bridge
    Bridge -->|"consome mensagens e cria\nnotificação em memória"| Notifications

    Customer -. "persiste o último cliente" .-> Storage[("sessionStorage\nbootstrap de estado")]
    Catalog -. "lê cliente ao inicializar" .-> Storage

    classDef mfe fill:#eff6ff,stroke:#2563eb,color:#172554,stroke-width:2px;
    classDef host fill:#ecfdf5,stroke:#059669,color:#064e3b,stroke-width:2px;
    classDef infra fill:#fff7ed,stroke:#ea580c,color:#7c2d12,stroke-width:2px;
    class Customer,Catalog,Notifications mfe;
    class Host host;
    class Bus,Bridge,Storage infra;
```

## Leitura para a palestra

1. **Customer** é produtor de `customer.updated` e possui apenas o cadastro do segurado.
2. **Insurance Catalog** consome o cliente, permite a contratação e se torna produtor de `insurance.contracted`.
3. **Host Dashboard** consome o contrato para compor a visão consolidada, sem executar a contratação.
4. **Notifications** recebe os contratos pelo Host, pois é um MFE Angular isolado em um iframe; sua lista é mantida em memória.
5. O `sessionStorage` não substitui os eventos: ele apenas permite que o catálogo recupere o último cliente quando é carregado depois do evento original.
