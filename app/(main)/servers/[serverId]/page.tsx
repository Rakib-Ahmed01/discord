import { Button } from '@/components/ui/button';

type Props = {
  params: { serverId: string };
};

export default function ServerPage({ params }: Props) {
  return (
    <div className="p-4">
      ServerPage {params.serverId}
      <Button variant="destructive">Delete</Button>
    </div>
  );
}
