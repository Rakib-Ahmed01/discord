type Props = {
  params: { serverId: string };
};

export default function ServerPage({ params }: Props) {
  return <div className="p-4">ServerPage {params.serverId}</div>;
}
