import { model, Schema } from 'mongoose'
import { UserDocument } from '../types/user.interface'
import bcryptjs from 'bcryptjs'
import { Role } from '../enums/role.enum'

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: Role,
    default: Role.USER
  },
  phone: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  company_id: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  status: {
    type: Number,
    enum: [1, 0],
    default: 1
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false
})


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next()
  }

  try {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
    return next()
  } catch (err) {
    return next(err as Error)
  }
})


userSchema.methods.validatePassword = async function(password: string) {
  return await bcryptjs.compare(password, this.password)
}

export default model<UserDocument>('User', userSchema)
