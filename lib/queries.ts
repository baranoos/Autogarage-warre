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
