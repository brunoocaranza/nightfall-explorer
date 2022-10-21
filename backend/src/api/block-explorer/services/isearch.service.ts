import { SearchResultDTO } from '../../../models';
import { SearchTerms } from '../../../utils';

export interface ISearchService {
  search(searchParam: string, searchTerm: SearchTerms): Promise<SearchResultDTO | SearchResultDTO[]>;
}
