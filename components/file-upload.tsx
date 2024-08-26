'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import { FileIcon, X } from 'lucide-react';
import Image from 'next/image';

interface Props {
  endpoint: 'serverImage' | 'messageFile';
  value: string;
  onChange: (url?: string) => void;
}

export default function FileUpload({ endpoint, onChange, value }: Props) {
  const fileType = value.split('.')[2];

  console.log({ value, fileType });

  if (value && fileType !== 'pdf') {
    return (
      <div className="relative w-20 h-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          onClick={() => onChange('')}
          className="absolute top-0 right-0 bg-rose-600 shadow-sm rounded-full p-[2px] text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (endpoint === 'messageFile' && value && fileType === 'pdf') {
    return (
      <div className="relative flex items-center p-2 mtp-2 rounded-md bg-background/10">
        <FileIcon className="size-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          onClick={() => onChange('')}
          className="absolute top-0 right-0 bg-rose-600 shadow-sm rounded-full p-[2px] text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      disabled={!!value}
      className="ut-label:text-indigo-500 w-full"
      appearance={{
        button:
          'bg-indigo-500 ut-uploading:bg-indigo-500/80 after:bg-indigo-500',
        container: 'w-full',
      }}
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res[0].url);
      }}
      onUploadError={(error) => {
        console.log(error);
        alert(
          error.message.includes('FileSizeMismatch')
            ? 'File size exceeded'
            : error.message
        );
      }}
    />
  );
}
