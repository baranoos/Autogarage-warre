import { supabase } from './supabase'
import type { Product, StockStatus } from './data'

type DbProduct = {
  id: string
  name: string
  category: string
  price: number
  price_ex_vat: number
  description: string
  long_description: string
  features: string[]
  stock: StockStatus
  image: string
  specs: Record<string, string>
  rating: number
  review_count: number
}

function mapProduct(p: DbProduct): Product {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: Number(p.price),
    priceExVAT: Number(p.price_ex_vat),
    description: p.description,
    longDescription: p.long_description,
    features: p.features ?? [],
    stock: p.stock,
    image: p.image,
    specs: (p.specs as Record<string, string>) ?? {},
    rating: Number(p.rating),
    reviewCount: p.review_count,
  }
}

function toDbProduct(p: Product) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    price_ex_vat: p.priceExVAT,
    description: p.description,
    long_description: p.longDescription,
    features: p.features,
    stock: p.stock,
    image: p.image,
    specs: p.specs,
    rating: p.rating,
    review_count: p.reviewCount,
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name')
  if (error) return []
  return (data as DbProduct[]).map(mapProduct)
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return mapProduct(data as DbProduct)
}

export async function getRelatedProducts(category: string, excludeId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', excludeId)
    .limit(3)
  if (error) return []
  return (data as DbProduct[]).map(mapProduct)
}

export async function createProduct(product: Product): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert(toDbProduct(product))
    .select()
    .single()
  if (error) throw error
  return mapProduct(data as DbProduct)
}

export async function updateProduct(id: string, product: Product): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(toDbProduct(product))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return mapProduct(data as DbProduct)
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ─── Product Images ────────────────────────────────────────────────────────

export type ProductImage = {
  id: string
  productId: string
  url: string
  sortOrder: number
  isCover: boolean
}

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order')
  if (error) return []
  return (data as { id: string; product_id: string; url: string; sort_order: number; is_cover: boolean }[]).map(r => ({
    id: r.id,
    productId: r.product_id,
    url: r.url,
    sortOrder: r.sort_order,
    isCover: r.is_cover,
  }))
}

export async function setProductImages(
  productId: string,
  images: { url: string; sortOrder: number; isCover: boolean }[]
): Promise<void> {
  await supabase.from('product_images').delete().eq('product_id', productId)
  if (images.length === 0) return
  const { error } = await supabase.from('product_images').insert(
    images.map(img => ({
      product_id: productId,
      url: img.url,
      sort_order: img.sortOrder,
      is_cover: img.isCover,
    }))
  )
  if (error) throw error
}

// ─── Reviews ───────────────────────────────────────────────────────────────

export type Review = {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  body: string
  createdAt: string
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
  if (error) return []
  return (data as { id: string; product_id: string; user_id: string; user_name: string; rating: number; body: string; created_at: string }[]).map(r => ({
    id: r.id,
    productId: r.product_id,
    userId: r.user_id,
    userName: r.user_name,
    rating: r.rating,
    body: r.body,
    createdAt: r.created_at,
  }))
}

export async function addReview(data: {
  productId: string; userId: string; userName: string; rating: number; body: string
}): Promise<Review> {
  const { data: row, error } = await supabase
    .from('reviews')
    .insert({ product_id: data.productId, user_id: data.userId, user_name: data.userName, rating: data.rating, body: data.body })
    .select()
    .single()
  if (error) throw error
  const r = row as { id: string; product_id: string; user_id: string; user_name: string; rating: number; body: string; created_at: string }
  return { id: r.id, productId: r.product_id, userId: r.user_id, userName: r.user_name, rating: r.rating, body: r.body, createdAt: r.created_at }
}

export async function updateReview(id: string, data: { rating: number; body: string }): Promise<void> {
  const { error } = await supabase.from('reviews').update(data).eq('id', id)
  if (error) throw error
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from('reviews').delete().eq('id', id)
  if (error) throw error
}

// ─── Storage ───────────────────────────────────────────────────────────────

export async function uploadProductImage(file: File, productId: string): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const fileName = `${productId || 'product'}-${Date.now()}.${ext}`
  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, { upsert: true, contentType: file.type })
  if (error) throw error
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName)
  return data.publicUrl
}
