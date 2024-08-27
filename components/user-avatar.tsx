import { cn } from '@/lib/utils';
import { Avatar, AvatarImage } from './ui/avatar';

type Props = {
  src: string;
  className?: string;
};

export default function UserAvatar({ className, src }: Props) {
  return (
    <Avatar className={cn('h-7 w-7 md:h-10 md:w-10', className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
}
