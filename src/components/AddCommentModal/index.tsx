import { CommentType } from '@/services/comment';
import { FC } from 'react';

interface AddCommentModalProps {
  questionId: string;
  commentId?: string;
  onClose: () => void;
  onReload?: (comment: CommentType) => void;
}

const AddCommentModal: FC<AddCommentModalProps> = () => {
  return <div>dasdas </div>;
};

export default AddCommentModal;
