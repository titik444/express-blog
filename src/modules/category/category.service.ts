import { prisma, QueryMode } from '../../config/database'
import slugify from 'slugify'

export const createCategory = async (name: string) => {
  const slug = slugify(name, { lower: true, strict: true })

  const exists = await prisma.category.findUnique({ where: { slug } })
  if (exists) throw { status: 400, message: 'Category already exists' }

  return prisma.category.create({
    data: { name, slug }
  })
}

export const getCategories = async (page: number, limit: number, search?: string) => {
  const where = search ? { name: { contains: search, mode: QueryMode.insensitive } } : {}

  const [items, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.category.count({ where })
  ])

  return { items, total, page, limit }
}

export const getCategoryBySlug = (slug: string) => {
  return prisma.category.findUnique({ where: { slug } })
}

export const updateCategory = async (id: string, data: { name?: string; slug?: string }) => {
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) throw { status: 404, message: 'Category not found' }

  if (data.name) {
    const exists = await prisma.category.findFirst({
      where: {
        name: data.name,
        id: { not: id }
      }
    })
    if (exists) throw { status: 400, message: 'Category already exists' }
  }

  if (data.name) {
    data = {
      ...data,
      slug: slugify(data.name, { lower: true, strict: true })
    }
  }

  return prisma.category.update({
    where: { id },
    data
  })
}

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) throw { status: 404, message: 'Category not found' }

  return prisma.category.delete({ where: { id } })
}
