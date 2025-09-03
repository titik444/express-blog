import { prisma, QueryMode } from '../../config/database'
import slugify from 'slugify'

// Create post
export const createPost = async (
  userId: string,
  title: string,
  content: string,
  featuredImage?: string,
  categories?: string[]
) => {
  const slug = slugify(title, { lower: true, strict: true })

  const existingPost = await prisma.post.findUnique({ where: { slug } })
  if (existingPost) throw { status: 400, message: 'Post with similar title already exists' }

  // Create the post
  const post = await prisma.post.create({
    data: {
      title,
      content,
      slug,
      featuredImage,
      authorId: userId
    }
  })

  // Create post-category relations (pivot entries)
  if (categories && categories.length > 0) {
    await prisma.postCategory.createMany({
      data: categories.map((categoryId) => ({
        postId: post.id,
        categoryId
      })),
      skipDuplicates: true
    })
  }

  // Return the post with included data
  const fullPost = await prisma.post.findUnique({
    where: { id: post.id },
    include: {
      author: true,
      categories: {
        include: {
          category: true
        }
      }
    }
  })

  return {
    id: fullPost?.id,
    title: fullPost?.title,
    slug: fullPost?.slug,
    content: fullPost?.content,
    featuredImage: fullPost?.featuredImage,
    isLiked: false,
    likeCount: fullPost?.likeCount,
    createdAt: fullPost?.createdAt,
    author: {
      id: fullPost?.author.id,
      name: fullPost?.author.name,
      avatarUrl: fullPost?.author.avatarUrl
    },
    categories: fullPost?.categories.map((pc) => ({
      id: pc.category.id,
      name: pc.category.name,
      slug: pc.category.slug
    }))
  }
}

// Get all posts with pagination and optional search
export const getPosts = async (page: number, limit: number, search?: string, userId?: string) => {
  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: QueryMode.insensitive } },
          { content: { contains: search, mode: QueryMode.insensitive } }
        ]
      }
    : {}

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        categories: {
          include: {
            category: true
          }
        },
        author: true
      }
    }),
    prisma.post.count({ where })
  ])

  let likedPostIds: Set<string> = new Set()

  if (userId) {
    const likes = await prisma.postLike.findMany({
      where: { userId },
      select: { postId: true }
    })

    likedPostIds = new Set(likes.map((like) => like.postId))
  }

  const items = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    featuredImage: post.featuredImage,
    isLiked: likedPostIds.has(post.id),
    likeCount: post?.likeCount,
    createdAt: post.createdAt,
    author: {
      id: post.author.id,
      name: post.author.name,
      avatarUrl: post.author.avatarUrl
    },
    categories: post.categories.map((pc) => ({
      id: pc.category.id,
      name: pc.category.name,
      slug: pc.category.slug
    }))
  }))

  return { items, total, page, limit }
}

// Get post by slug
export const getPostBySlug = async (slug: string, userId?: string) => {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      categories: {
        include: {
          category: true
        }
      },
      author: true,
      comments: {
        include: {
          author: true
        }
      }
    }
  })

  if (!post) throw { status: 404, message: 'Post not found' }

  let isLiked = false
  let likedCommentIds: Set<string> = new Set()

  if (userId) {
    const [postLike, commentLikes] = await Promise.all([
      prisma.postLike.findUnique({
        where: { userId_postId: { userId, postId: post.id } }
      }),
      prisma.commentLike.findMany({
        where: {
          userId,
          commentId: { in: post.comments.map((c) => c.id) }
        },
        select: { commentId: true }
      })
    ])

    isLiked = !!postLike
    likedCommentIds = new Set(commentLikes.map((c) => c.commentId))
  }

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    featuredImage: post.featuredImage,
    isLiked,
    likeCount: post.likeCount,
    createdAt: post.createdAt,
    author: {
      id: post.author.id,
      name: post.author.name,
      avatarUrl: post.author.avatarUrl
    },
    categories: post.categories.map((pc) => ({
      id: pc.category.id,
      name: pc.category.name,
      slug: pc.category.slug
    })),
    comments: post.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      isLiked: likedCommentIds.has(comment.id),
      likeCount: comment.likeCount,
      createdAt: comment.createdAt,
      author: {
        id: comment.author.id,
        name: comment.author.name,
        avatarUrl: comment.author.avatarUrl
      }
    }))
  }
}

// Update post
export const updatePost = async (
  id: string,
  userId: string,
  data: {
    title?: string
    content?: string
    featuredImage?: string
    categories?: string[]
  }
) => {
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) throw { status: 404, message: 'Post not found' }
  if (post.authorId !== userId) throw { status: 403, message: 'Forbidden: not your post' }

  const updateData: any = {}

  if (data.title) {
    updateData.title = data.title
    updateData.slug = slugify(data.title, { lower: true, strict: true })

    const existingPost = await prisma.post.findFirst({
      where: {
        slug: updateData.slug,
        id: { not: id }
      }
    })

    if (existingPost) throw { status: 400, message: 'Another post with the same title already exists' }
  }

  if (data.content) updateData.content = data.content
  if (data.featuredImage) updateData.featuredImage = data.featuredImage

  if (data.categories) {
    // Hapus semua kategori yang terkait dengan post ini
    await prisma.postCategory.deleteMany({
      where: { postId: id }
    })

    // Tambahkan kategori baru
    await prisma.postCategory.createMany({
      data: data.categories.map((categoryId) => ({
        postId: id,
        categoryId
      })),
      skipDuplicates: true
    })
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: updateData,
    include: {
      categories: {
        include: {
          category: true
        }
      },
      author: true
    }
  })

  const liked = await prisma.postLike.findUnique({
    where: { userId_postId: { userId, postId: updatedPost.id } }
  })

  return {
    id: updatedPost.id,
    title: updatedPost.title,
    slug: updatedPost.slug,
    content: updatedPost.content,
    featuredImage: updatedPost.featuredImage,
    isLiked: !!liked,
    likeCount: updatedPost.likeCount,
    createdAt: updatedPost.createdAt,
    author: {
      id: updatedPost.author.id,
      name: updatedPost.author.name,
      avatarUrl: updatedPost.author.avatarUrl
    },
    categories: updatedPost.categories.map((pc) => ({
      id: pc.category.id,
      name: pc.category.name,
      slug: pc.category.slug
    }))
  }
}

// Delete post
export const deletePost = async (id: string, userId: string) => {
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) throw { status: 404, message: 'Post not found' }
  if (post.authorId !== userId) throw { status: 403, message: 'Forbidden: not your post' }

  // Hapus semua relasi post-category dulu
  await prisma.postCategory.deleteMany({
    where: { postId: id }
  })

  // Baru hapus post-nya
  return prisma.post.delete({ where: { id } })
}

export const likePost = async (postId: string, userId: string) => {
  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) throw { status: 404, message: 'Post not found' }

  const alreadyLiked = await prisma.postLike.findUnique({
    where: { userId_postId: { userId, postId } }
  })

  if (alreadyLiked) throw { status: 400, message: 'You already liked this post' }

  await prisma.$transaction([
    prisma.postLike.create({
      data: { postId, userId }
    }),
    prisma.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } }
    })
  ])

  return { message: 'Post liked' }
}

export const unlikePost = async (postId: string, userId: string) => {
  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) throw { status: 404, message: 'Post not found' }

  const like = await prisma.postLike.findUnique({
    where: { userId_postId: { userId, postId } }
  })

  if (!like) throw { status: 400, message: 'You have not liked this post' }

  await prisma.$transaction([
    prisma.postLike.delete({
      where: { userId_postId: { userId, postId } }
    }),
    prisma.post.update({
      where: { id: postId },
      data: { likeCount: { decrement: 1 } }
    })
  ])

  return { message: 'Post unliked' }
}
