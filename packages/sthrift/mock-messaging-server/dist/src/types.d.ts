export interface Conversation {
    id: string;
    account_id: string;
    display_name?: string;
    unique_name?: string;
    created_at: string;
    updated_at: string;
    state: 'active' | 'inactive' | 'closed';
    metadata?: Record<string, unknown>;
    url?: string;
    links?: Record<string, string>;
}
export interface Message {
    id: string;
    account_id: string;
    conversation_id: string;
    body: string;
    author?: string;
    participant_id?: string;
    created_at: string;
    updated_at?: string;
    index: number;
    metadata?: Record<string, unknown>;
    url?: string;
    links?: Record<string, string>;
}
export interface Participant {
    id: string;
    account_id: string;
    conversation_id: string;
    identity?: string;
    messaging_binding?: {
        type: string;
        address: string;
        proxy_address?: string;
    };
    created_at: string;
    updated_at?: string;
    role_id?: string;
    url?: string;
    links?: Record<string, string>;
}
export interface PaginatedResponse {
    meta: {
        page: number;
        page_size: number;
        first_page_url: string;
        previous_page_url?: string;
        next_page_url?: string;
        url: string;
        key?: string;
    };
}
export interface ConversationsListResponse extends PaginatedResponse {
    conversations: Conversation[];
}
export interface MessagesListResponse extends PaginatedResponse {
    messages: Message[];
}
export interface ParticipantsListResponse extends PaginatedResponse {
    participants: Participant[];
}
