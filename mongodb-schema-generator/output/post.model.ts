import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: Types.ObjectId;
  categories: Types.ObjectId[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  featuredImage?: string;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IPostMethods {
  incrementViews(): Promise<void>;
  publish(): Promise<void>;
}

type PostModel = Model<IPost, {}, IPostMethods>;

const postSchema = new Schema<IPost, PostModel, IPostMethods>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    categories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    publishedAt: Date,
    featuredImage: String,
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ tags: 1 });

// Virtual for reading time
postSchema.virtual('readingTime').get(function () {
  const wordsPerMinute = 200;
  const words = this.content?.split(/\s+/).length || 0;
  return Math.ceil(words / wordsPerMinute);
});

// Methods
postSchema.methods.incrementViews = async function () {
  this.viewCount += 1;
  await this.save();
};

postSchema.methods.publish = async function () {
  this.status = 'published';
  this.publishedAt = new Date();
  await this.save();
};

// Pre-save hook for slug generation
postSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

export const Post = mongoose.model<IPost, PostModel>('Post', postSchema);
