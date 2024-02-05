export interface SearchCriteria {
    searchType?: string;
    keyword?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    status?: 'recruiting' | 'completed' | 'finished';
    maxParticipants?: number;
}