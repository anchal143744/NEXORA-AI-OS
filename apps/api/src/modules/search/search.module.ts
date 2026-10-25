import { Module } from '@nestjs/common';
import { EventsModule } from '../events/events.module';
import { TenantsModule } from '../tenants/tenants.module';
import { ContextSearchController } from './context/context-search.controller';
import { ContextSearchService } from './context/context-search.service';
import { KnowledgeSearchController } from './engine/knowledge-search.controller';
import { KnowledgeSearchService } from './engine/knowledge-search.service';
import { SearchIndexController } from './indexes/search-index.controller';
import { SearchIndexService } from './indexes/search-index.service';
import { RetrievalController } from './retrieval/retrieval.controller';
import { RetrievalService } from './retrieval/retrieval.service';
import { SecureSearchService } from './security/secure-search.service';
import { SemanticSearchController } from './semantic/semantic-search.controller';
import { SemanticSearchService } from './semantic/semantic-search.service';

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [KnowledgeSearchController, SemanticSearchController, ContextSearchController, RetrievalController, SearchIndexController],
  providers: [KnowledgeSearchService, SemanticSearchService, ContextSearchService, RetrievalService, SearchIndexService, SecureSearchService],
  exports: [KnowledgeSearchService, SemanticSearchService, ContextSearchService, RetrievalService, SearchIndexService, SecureSearchService],
})
export class SearchModule {}