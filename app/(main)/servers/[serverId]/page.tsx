type Props = {
  params: { serverId: string };
};

export default function ServerPage({ params }: Props) {
  return <div>ServerPage {params.serverId}</div>;
}
