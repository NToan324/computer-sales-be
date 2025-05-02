import { Client } from '@elastic/elasticsearch';
import { BadRequestError } from '@/core/error.response';

class ElasticsearchService {
    private client: Client;

    constructor() {
        this.client = new Client({
            node: 'http://localhost:9200', 
         });
    }

    async indexDocument(index: string, id: string, document: any) {
        try {
            const response = await this.client.index({
                index,
                id,
                body: document,
            });
            return response;
        } catch (error) {
            throw new BadRequestError('Error indexing document: ' + (error as any).message);
        }
    }

    async searchDocuments(index: string, query: any) {
        try {
            const response = await this.client.search({
                index,
                body: query ,
            });

            console.log('Elasticsearch raw response:', JSON.stringify(response.hits, null, 2));

            return response.hits.hits;
        } catch (error) {
            throw new BadRequestError('Error searching documents: ' + (error as any).message);
        }
    }

    async updateDocument(index: string, id: string, document: any) {
        try {
            const response = await this.client.update({
                index,
                id,
                body: {
                    doc: document,
                },
            });
            return response;
        } catch (error) {
            throw new BadRequestError('Error updating document: ' + (error as any).message);
        }
    }

    async deleteDocument(index: string, id: string) {
        try {
            const response = await this.client.delete({
                index,
                id,
            });
            return response;
        } catch (error) {
            throw new BadRequestError('Error deleting document: ' + (error as any).message);
        }
    }
}

const elasticsearchService = new ElasticsearchService();
export default elasticsearchService;