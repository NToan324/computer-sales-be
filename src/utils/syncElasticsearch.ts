import elasticsearchService from '@/services/elasticsearch.service'
import categoryModel from '@/models/category.model'
import brandModel from '@/models/brand.model'
import productModel from '@/models/product.model'
import ProductVariantModel from '@/models/productVariant.model'
import UserModel from '@/models/user.model'

let isSynced = true // Cờ kiểm soát đồng bộ

export async function syncElasticsearch() {
    if (isSynced) {
        console.log('Elasticsearch is already synced. Skipping synchronization.')
        return
    }

    console.log('Starting Elasticsearch synchronization...')

    // Xóa toàn bộ các index hiện có
    const indices = ['users', 'categories', 'brands', 'products', 'product_variants']
    for (const index of indices) {
        try {
            await elasticsearchService.getClient().indices.delete({ index })
            console.log(`Deleted index: ${index}`)
        } catch (error) {
            console.log(`Index ${index} does not exist or could not be deleted.`)
        }
    }

    // Đồng bộ dữ liệu từ MongoDB lên Elasticsearch
    await syncCollectionToIndex(UserModel, 'users')
    await syncCollectionToIndex(categoryModel, 'categories')
    await syncCollectionToIndex(brandModel, 'brands')
    await syncCollectionToIndex(productModel, 'products')
    await syncCollectionToIndex(ProductVariantModel, 'product_variants')

    console.log('Elasticsearch synchronization completed.')
    isSynced = true // Đánh dấu đã đồng bộ
}

async function syncCollectionToIndex(model: any, index: string) {
    console.log(`Syncing data for index: ${index}`)
    const documents = await model.find().lean()
    for (const doc of documents) {
        const { _id, ...rest } = doc
        await elasticsearchService.indexDocument(index, _id.toString(), rest)
    }
    console.log(`Synced ${documents.length} documents to index: ${index}`)
}