import { Controller, Get, Inject, Query, Headers } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchResultDTO } from '../../../models';
import { SEARCH_SERVICE } from '../../../utils';
import { ISearchService } from '../services/isearch.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(@Inject(SEARCH_SERVICE) private readonly _searchService: ISearchService) {}

  @Get('/')
  @ApiResponse({ status: 200, type: SearchResultDTO })
  search(@Query('q') searchParam: string, @Headers() headers: any): Promise<SearchResultDTO | SearchResultDTO[]> {
    return this._searchService.search(searchParam, headers.searchTerm);
  }
}
