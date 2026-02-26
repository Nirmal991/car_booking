import mongoose, {Document} from 'mongoose';

export interface IBlacklistToken extends Document {
  token: string;
  createdAt: Date;
}

const blacklistTokenSchema = new mongoose.Schema<IBlacklistToken>({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // 24 hours in seconds
    }
});

export const BlacklistToken = mongoose.model<IBlacklistToken>('BlacklistToken', blacklistTokenSchema);