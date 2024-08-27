import { Channel, Member, Message, Profile, Server } from '@prisma/client';
import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';

export type ServerWithChannelsAndMembersWithProfiles = Server & {
  channels: Channel[];
  members: (Member & { profile: Profile })[];
};

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

export type MessageWithSenderWithProfile = Message & {
  sender: Member & { profile: Profile };
};
