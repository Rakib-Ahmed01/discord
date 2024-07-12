import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

type Props = {
  children: React.ReactNode;
  align: 'center' | 'end' | 'start';
  side: 'top' | 'right' | 'bottom' | 'left';
  label: string;
};

export default function ActionTooltip({ children, align, side, label }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className="text-md font-medium z-50"
          align={align}
          side={side}
        >
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
